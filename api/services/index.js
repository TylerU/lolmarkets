const authentication = require('./authentication');
const user = require('./user');
const channel = require('./channel');
const market = require('./market');
const marketUser = require('./market-user');
const transaction = require('./transaction');

const Sequelize = require('sequelize');

const logging = false;

module.exports = function () {
  const app = this;

  const pgSettings = app.get('postgres');
  pgSettings.username = 'username'; // TODO - fix this bullshit
  const sequelize = new Sequelize(pgSettings.database, pgSettings.username, pgSettings.password, {
    host: pgSettings.host,
    dialect: 'postgres',
    logging,
    pool: {
      max: 5,
      min: 0,
      idle: 10000,
    },
  });

  app.set('sequelize', sequelize);

  app.configure(authentication);
  app.configure(user);
  app.configure(channel);
  app.configure(market);
  app.configure(marketUser);
  app.configure(transaction);

  // Associate all of our models
  Object.keys(sequelize.models)
    .map(name => sequelize.models[name])
    .filter(model => model.associate !== undefined)
    .forEach(model => model.associate());

  sequelize.sync({ force: true, logging }).then(() => {
    console.log('Database ready');

    app.service('/users').create({
      email: 'tyler@gmail.com',
      password: 'test123',
      username: 'DinoEntrails',
    })
      .then(() => app.service('/channels').create({
        displayName: 'Voyboy',
        twitchName: 'Voyboy',
        isStreaming: false,
      }))
      .then((voy) => app.service('/markets').create({
        name: 'Voyboy will win this game',
        leagueGameId: 12345,
        channel: voy.id,
      }))
      // .then((res) => console.dir(res, { depth: null }), console.log.bind(console, 'failure'))
  });
};

