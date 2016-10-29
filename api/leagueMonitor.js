'use strict';
/* eslint no-use-before-define: "off" */

const LolApi = require('leagueapi');
LolApi.init('d360d3eb-e358-4f80-8759-fbfac4ccab19');
const Promise = require('bluebird');
const _ = require('lodash');
const marketManager = require('./marketManager');

function log(res) {
  console.log(res);
  return res;
}

const RATE_PER_10 = 7;
const WAIT_BETWEEN_BATCHES = 21000;

function execElem(i, arr, fn) {
  if (i < arr.length) {
    return fn(arr[i]).delay(WAIT_BETWEEN_BATCHES).then(execElem.bind(null, i + 1, arr, fn));
  }
  // Note: will wait 10 seconds after last element is processed to finally resolve
  return null;
}

// TODO account for rate limiting. Maybe add lastChecked DateTime field
function checkForGameStart(app) {
  const ChannelService = app.service('channels');
  const MatchStateService = app.service('match-state');
  function getCurrentGameId(account) {
    const relevantQueueTypes = {
      RANKED_SOLO_5x5:	4,
      RANKED_PREMADE_5x5:	6,
      RANKED_PREMADE_3x3:	9,
      RANKED_TEAM_3x3:	41,
      RANKED_TEAM_5x5:	42,
      TEAM_BUILDER_DRAFT_RANKED_5x5:	410,
    };
    const reverseQueueTypes = _.invert(relevantQueueTypes);

    return LolApi.getCurrentGame(account.id, account.region)
      .then(
        (res) =>
          (res.gameMode === 'CLASSIC' &&
          res.gameType === 'MATCHED_GAME' &&
          !!reverseQueueTypes[res.gameQueueConfigId] ? res.gameId : null), // Only allow summoner's rift games
        (err) => {
          if (`${err}`.indexOf('404 Not Found') !== -1) {
            return null;
          }
          throw err;
        });
  }

  function checkAllAccountsForActiveGame(accounts) {
    return Promise.all(_.map(accounts, getCurrentGameId));
  }

  // TODO - may be swallowing errors
  function checkChannelObjectsForGameStart(channels) {
    return Promise.all(
      _.chain(channels)
        .map('leagueAccounts')
        .map(checkAllAccountsForActiveGame)
        .value())
      .then((gameIds) =>
        _.chain(channels)
          .zip(gameIds)
          // Create objects with updated leagueAccounts objects (map to whether or not each account is in game)
          .map(_.spread((channel, games) => _.assign({}, channel, { leagueAccounts: _.zip(channel.leagueAccounts, games) })))
          // Filter for channels that were not in game, but now are
          .filter((channel) => channel.inGame === false && _.find(channel.leagueAccounts, _.spread((leagueAcc, gameId) => !!gameId)))
          // Map to 'updates' objects which include relevant information to save to the db
          .map((channel) => {
            const activeAccountAndGameId = _.find(channel.leagueAccounts, _.spread((leagueAcc, gameId) => !!gameId));
            const activeAccount = activeAccountAndGameId[0];
            const leagueGameId = activeAccountAndGameId[1];
            const leagueGameRegion = activeAccount.region;
            return _.assign({
              id: channel.id,
              save: {
                inGame: true,
                leagueGameId,
                leagueGameRegion,
              },
              extraDetails: {
                activeAccount,
                leagueGameId,
              },
            });
          })
          .value())
      .then((updates) =>
        // Update inGame and current game id  HERE
        // Trigger market creation for each channel that is now in game
        Promise.all(_.map(updates, (obj) => MatchStateService.create({
          type: 'GAME_START',
          channelId: obj.id,
          leagueGameRegion: obj.save.leagueGameRegion,
          leagueGameId: obj.save.leagueGameId,
          activeAccount: obj.extraDetails.activeAccount,
        }))))
      .then(
        () => app.logger.info('Successfully checked for game starts'),
        (err) => app.logger.error('League Game Start Check failed with error', err));
  }

  function splitAndExecuteInSerial(channels) {
    const result = [];
    let curCount = 0;
    let curArr = [];
    for (let i = 0; i < channels.length; i++) {
      const curChannel = channels[i];
      const count = curChannel.leagueAccounts.length;
      if (curCount + count > RATE_PER_10) {
        result.push(curArr);
        curArr = [curChannel];
        curCount = count;
      } else {
        curArr.push(curChannel);
        curCount += count;
      }
    }
    result.push(curArr);

    return execElem(0, result, checkChannelObjectsForGameStart);
  }

  function actualCheckForGameStart() {
    return ChannelService.find({ query: { $limit: 1000, isStreaming: true, inGame: false } })
      .then((channels) => channels.data)
      .then(splitAndExecuteInSerial);
  }

  actualCheckForGameStart().then(
    () => checkForGameEnd(app),
    (err) => {
      app.logger.error('Error encountered checking for game starts', err);
      return checkForGameEnd(app);
    });
}

function checkForGameEnd(app) {
  const allGameIdsQuery =
    `
    SELECT DISTINCT "leagueGameId", "leagueGameRegion" from (
      SELECT "leagueGameId", "leagueGameRegion"
      FROM public."Channel" 
      WHERE 
        "leagueGameId" IS NOT NULL
        AND "leagueGameRegion" IS NOT NULL
        AND "inGame" IS TRUE
      UNION
      SELECT "leagueGameId", "leagueGameRegion"
      FROM public."Market" 
      WHERE 
        "leagueGameId" IS NOT NULL
        AND "leagueGameRegion" IS NOT NULL
        AND "active" IS TRUE
    ) a`;

  function getGameCompletion(game) {
    const MatchStateService = app.service('match-state');

    return LolApi.getMatch(game.leagueGameId, false, game.leagueGameRegion)
      .then((res) => res,
        (err) => {
          if (`${err}`.indexOf('404 Not Found') !== -1) {
            return false;
          } else if (`${err}`.indexOf('429') !== -1) {
            app.logger.info(`Got rate limited in getMatch(${game.leagueGameId}). Unable to complete request.`);
            return null;
          }
          throw err;
        })
      .then((match) => {
        if (!!match) {
          // Game which we thought was running is now over.
          MatchStateService.create({
            type: 'GAME_END',
            match,
          });
        }
        return Promise.resolve(match); // TODO - better return value?
      });
  }

  function checkAllGames(games) {
    return Promise.all(_.map(games, (game) => getGameCompletion(game)))
      .then(
        // (res) => app.logger.info(`Successfully checked for end games: ${_.map(_.filter(games, (game, index) => res[index] !== null), 'leagueGameId')}`),
        () => app.logger.info('Successfully checked for end games'),
        (err) => app.logger.error('Error checking for end game', err));
  }

  function splitAndExecuteInSerial(games) {
    const split = _.chunk(games, RATE_PER_10);
    return execElem(0, split, checkAllGames);
  }

  function actualCheckForGameEnd() {
    return app.get('sequelize').query(allGameIdsQuery, { type: app.get('sequelize').QueryTypes.SELECT })
      .then(splitAndExecuteInSerial);
  }

  actualCheckForGameEnd().then(
    () => checkForGameStart(app),
    (err) => {
      app.logger.error('Error encountered checking for game ends', err);
      return checkForGameStart(app);
    });
}

exports.startMonitoring = function startMonitoring(app) {
  setTimeout(() => checkForGameStart(app), WAIT_BETWEEN_BATCHES);
};
