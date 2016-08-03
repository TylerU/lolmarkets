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
exports.handleNewGame = function (app, details) {
  const MarketService = app.service('markets');
  const channelIn = details.channel;
  const channel = details.channel.id;
  const leagueGameId = details.extraDetails.leagueGameId;
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
    }),
    MarketService.create({
      name: `${name} will get ${numKills} or more kills`,
      predictionDetails: {
        type: predictionTypes.MORE_THAN_X_KILLS,
        activeAccount,
      },
      channel,
      leagueGameId,
    }),
  ];

  return Promise.all(promises).then(
    () => app.logger.info(`Successfully created markets for new game. Player: ${name}`),
    (err) => app.logger.error(`Error creating markets for new game: ${err}`));
};
