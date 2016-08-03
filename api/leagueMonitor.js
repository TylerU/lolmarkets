'use strict';

const LolApi = require('leagueapi');
LolApi.init('d360d3eb-e358-4f80-8759-fbfac4ccab19');
const Promise = require('bluebird');
const _ = require('lodash');
const moment = require('moment');
const marketManager = require('./marketManager');

function log(res) {
  console.log(res);
  return res;
}

// LolApi.Summoner.getByName('WildTurtle', 'na').then(log, log);

// TODO account for rate limiting. Maybe add lastChecked DateTime field
function checkForGameStart(app) {
  const ChannelService = app.service('channels');
  const POLL_INTERVAL = moment.duration(app.get('leagueMonitor').startGamePollInterval, 'minutes').asMilliseconds();

  function getCurrentGameId(account) {
    return LolApi.getCurrentGame(account.id, account.region)
      .then((res) => (res.gameMode === 'CLASSIC' ? res.gameId : null), // Only allow summoner's rift games
        (err) => {
          if (`${err}`.indexOf('404 Not Found') !== -1) {
            return null;
            // return 1234556; // TODO - temp. For Testing only.
          }
          throw err;
        });
  }

  function checkAllAccountsForActiveGame(accounts) {
    return Promise.all(_.map(accounts, getCurrentGameId));
  }

  function actualCheckForGameStart() {
    return ChannelService.find({ query: { $limit: 1000, isStreaming: true, inGame: false } })
      .then((channels) => channels.data)
      .then((channels) =>
        Promise.all(
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

                return _.assign({
                  id: channel.id,
                  save: {
                    inGame: true,
                    leagueGameId,
                  },
                  extraDetails: {
                    activeAccount,
                    leagueGameId,
                  },
                });
              })
              .value()))
      // .then(log, log)
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
        (err) => app.logger.error(`League Game Start Check failed with error ${err}`))
      .then(
        () => setTimeout(actualCheckForGameStart, POLL_INTERVAL),
        () => setTimeout(actualCheckForGameStart, POLL_INTERVAL));
  }

  return actualCheckForGameStart();
}

exports.checkForGameStart = checkForGameStart;
