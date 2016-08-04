'use strict';

const LolApi = require('leagueapi');
LolApi.init('d360d3eb-e358-4f80-8759-fbfac4ccab19');
const Promise = require('bluebird');
const _ = require('lodash');
const marketManager = require('./marketManager');

function log(res) {
  console.log(res);
  return res;
}

function execElem(i, arr, fn) {
  if (i < arr.length) {
    return fn(arr[i]).delay(10000).then(execElem.bind(null, i + 1, arr, fn));
  }
  // Note: will wait 10 seconds after last element is processed to finally resolve
  return null;
}

const RATE_PER_10 = 8;

// LolApi.Summoner.getByName('Wingsofdeath', 'na').then(log, log);

// TODO account for rate limiting. Maybe add lastChecked DateTime field
function checkForGameStart(app) {
  const ChannelService = app.service('channels');

  function getCurrentGameId(account) {
    return LolApi.getCurrentGame(account.id, account.region)
      .then((res) => (res.gameMode === 'CLASSIC' ? res.gameId : null), // Only allow summoner's rift games
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
          .map(_.spread((channel, games) => _.assign({}, channel, { leagueAccounts: _.zip(channel.leagueAccounts, games) })))
          .filter((channel) => channel.inGame === false && _.find(channel.leagueAccounts, _.spread((leagueAcc, gameId) => !!gameId)))
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
        // Update inGame and current game id
        Promise.all(_.map(updates, (obj) => ChannelService.patch(obj.id, obj.save)))
          // Trigger market creation for each channel that is now in game
          .then((updatedChannels) => {
            _.map(updatedChannels, (channel, index) => marketManager.handleNewGame(app, { channel, extraDetails: updates[index].extraDetails }));
            return updatedChannels;
          }))
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
    `SELECT "leagueGameId", "leagueGameRegion"
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
      AND "active" IS TRUE`;

  function updateChannelsOnGameOver(match) {
    const ChannelService = app.service('channels');
    return ChannelService.find({ query: { $limit: 1000, leagueGameId: match.matchId, leagueGameRegion: match.region } })
      .then((channels) => channels.data)
      .then((channels) => {
        if (channels.length > 0) {
          app.logger.info(`Found game over for users ${_.map(channels, 'displayName')}`);
        }
        return channels;
      })
      .then((channels) => Promise.all(_.map(channels, (channel) =>
        ChannelService.patch(channel.id, { inGame: false, leagueGameId: null, leagueGameRegion: null }))));
  }
  function getGameCompletion(game) {
    return LolApi.getMatch(game.leagueGameId, false, game.leagueGameRegion)
      .then((res) => res,
        (err) => {
          if (`${err}`.indexOf('404 Not Found') !== -1) {
            return null;
          }
          throw err;
        })
      .then((match) => {
        if (!!match) {
          marketManager.handleGameOver(app, match);
          return updateChannelsOnGameOver(match);
        }
        return Promise.resolve(true); // TODO - better return value?
      });
  }

  function checkAllGames(games) {
    return Promise.all(_.map(games, (game) => getGameCompletion(game)))
      .then(
        () => app.logger.info('Successfully checked for end game'),
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
  checkForGameStart(app);
};
