const authentication = require('./authentication');
const user = require('./user');
const channel = require('./channel');
const market = require('./market');
const marketUser = require('./market-user');
const transaction = require('./transaction');
const leaderboard = require('./leaderboard');
const matchState = require('./match-state');

const Sequelize = require('sequelize');
const demoData = require('./demoData');

const twitchMonitor = require('../twitchMonitor');
const LeagueMonitor = require('../leagueMonitor');
const MarketManager = require('../marketManager');

module.exports = function () {
  const app = this;
  let logging = (msg) => (app.logger ? app.logger.info(msg) : console.log(msg));
  logging = false;

  const pgSettings = app.get('postgres');
  const sequelize = new Sequelize(
    process.env.RDS_DB_NAME || pgSettings.database,
    process.env.RDS_USERNAME || pgSettings.username,
    process.env.RDS_PASSWORD || pgSettings.password,
    {
      host: process.env.RDS_HOSTNAME ? `${process.env.RDS_HOSTNAME}` : pgSettings.host,
      dialect: 'postgres',
      logging,
      pool: {
        max: 5,
        min: 0,
        idle: 10000,
      },
    }
  );

  app.set('sequelize', sequelize);

  app.configure(authentication);
  app.configure(user);
  app.configure(channel);
  app.configure(market);
  app.configure(marketUser);
  app.configure(transaction);
  app.configure(leaderboard);
  app.configure(matchState);

  // Associate all of our models
  Object.keys(sequelize.models)
    .map(name => sequelize.models[name])
    .filter(model => model.associate !== undefined)
    .forEach(model => model.associate());

  sequelize.sync({ force: app.settings.env === 'development', logging })
    .then(() => demoData(app))
    .then(() => twitchMonitor(app))
    .then(() => LeagueMonitor.startMonitoring(app))
    .then(null, (err) => app.logger.error('Error encountered during setup', err));
};

