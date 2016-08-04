const _ = require('lodash');
const Promise = require('bluebird');

exports.predictionTypes = {
  WILL_WIN: 0,
  MORE_THAN_X_KILLS: 1,
};

function log(res) {
  console.log(res);
  return res;
}

const predictionTypes = exports.predictionTypes;

// TODO - fix wonky app tossing
exports.handleNewGame = function handleNewGame(app, details) {
  if (!details.channel.isStreaming) return Promise.resolve(null); // Just in case they stopped streaming in the meantime.

  const MarketService = app.service('markets');
  const channelIn = details.channel;
  const channel = details.channel.id;
  const leagueGameId = details.extraDetails.leagueGameId;
  const leagueGameRegion = details.extraDetails.activeAccount.region;
  const activeAccount = details.extraDetails.activeAccount;
  const name = channelIn.displayName;
  const numKills = _.random(3, 9);

  const promises = [
    MarketService.create({
      name: `${name} will win this game`,
      predictionDetails: {
        type: predictionTypes.WILL_WIN,
        activeAccount,
      },
      channel,
      leagueGameId,
      leagueGameRegion,
    }),
    MarketService.create({
      name: `${name} will get ${numKills} or more kills`,
      predictionDetails: {
        type: predictionTypes.MORE_THAN_X_KILLS,
        activeAccount,
        kills: numKills,
      },
      channel,
      leagueGameId,
      leagueGameRegion,
    }),
  ];

  return Promise.all(promises).then(
    () => app.logger.info(`Successfully created markets for new game. Player: ${name}`),
    (err) => app.logger.error('Error creating markets for new game.', err));
};

function getResult(details, match) {
  if (!details || !details.activeAccount) throw new Error('Invalid market. Needs activeAccount set');
  const summonerId = details.activeAccount.id;
  const region = details.activeAccount.region;
  const participantId = _.find(match.participantIdentities, (identity) => identity.player.summonerId == summonerId).participantId;
  const participant = _.find(match.participants, { participantId });

  const resolve = {
    WILL_WIN: () => {
      return participant.winner;
    },
    MORE_THAN_X_KILLS: () => {
      if (!details.kills) {
        throw new Error(`Markets of type ${predictionTypes.MORE_THAN_X_KILLS} must have 'kills' member`);
      }
      return participant.kills > details.kills;
    },
  };

  if (!_.isEqual(_.keys(resolve), _.keys(predictionTypes))) {
    throw new Error('Prediction Types not equal');
  }

  return _.mapKeys(resolve, (value, key) => predictionTypes[key])[details.type]();
}

exports.handleGameOver = function handleGameOver(app, match) {
  // Mark market as over
  // Resolve market
  const MarketService = app.service('markets');
  const MarketUserService = app.service('marketUsers');

  MarketService.find({ query: { $limit: 1000, leagueGameId: match.matchId, leagueGameRegion: match.region} })
    .then((markets) => markets.data)
    // Mark as inactive
    .then((markets) => Promise.all(_.map(markets, (market) => MarketService.patch(market.id, {
      active: false,
      timeClosed: new Date(),
      result: getResult(market.predictionDetails, match),
    }))))
    .then(
    () => app.logger.info(`Successfully resolved markets for match: ${match.matchId}`),
    (err) => app.logger.error('Error resolving markets.', err));
};
