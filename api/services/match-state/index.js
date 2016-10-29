'use strict';
/* eslint no-else-return: "off" */
const hooks = require('./hooks/match-state-hooks');
const filters = require('./match-state-filters').filters;

const MarketManager = require('../../marketManager');
const Promise = require('bluebird');
const errors = require('feathers-errors');
const _ = require('lodash');

class MatchStateService {
  constructor(options) {
    if (!options.app) throw new Error('App has to be provided');
    this.app = options.app;
    this.marketManager = MarketManager;
  }

  create(data/* , params */) {
    function updateChannelsOnGameOver(match) {
      const ChannelService = this.app.service('channels');
      return ChannelService.find({ query: { $limit: 1000, leagueGameId: match.matchId, leagueGameRegion: match.region } })
        .then((channels) => channels.data)
        .then((channels) => {
          if (channels.length > 0) {
            this.app.logger.info(`Found game over for users ${_.map(channels, 'displayName')}`);
          }
          return channels;
        })
        .then((channels) => Promise.all(_.map(channels, (channel) =>
          ChannelService.patch(channel.id, { inGame: false, leagueGameId: null, leagueGameRegion: null }))));
    }

    if (data.type === 'GAME_START') {
      // TODO - verify that this person isn't currently in game? Race conditions or something.
      const { channelId, leagueGameRegion, leagueGameId, activeAccount } = data;

      return this.app.service('channels').patch(channelId, {
        inGame: true,
        leagueGameId,
        leagueGameRegion,
      })
        // Trigger market creation for the channel that's now in game
        .then((channel) =>
          this.marketManager.handleNewGame(this.app, {
            channel,
            extraDetails: {
              activeAccount,
              leagueGameId,
            },
          })
        );
    } else if (data.type === 'GAME_END') {
      const match = data.match;
      this.marketManager.handleGameOver(this.app, match);
      return updateChannelsOnGameOver(match);
    } else {
      throw new errors.BadRequest('Invalid match state update type. Must be GAME_START or GAME_END');
    }
  }
}

module.exports = function () {
  const app = this;

  const options = {
    app,
  };

  // Initialize our service with any options it requires
  app.use('/match-state', new MatchStateService(options));

  // Get our initialized service to that we can bind hooks
  const matchStateService = app.service('/match-state');

  // Set up our before hooks
  matchStateService.before(hooks.before);

  // Set up our after hooks
  matchStateService.after(hooks.after);

  matchStateService.filter(filters);
};

