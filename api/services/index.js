const authentication = require('./authentication');
const user = require('./user');
const channel = require('./channel');
const market = require('./market');
const Sequelize = require('sequelize');

module.exports = function () {
  const app = this;

  const pgSettings = app.get('postgres');
  pgSettings.username = 'username'; // TODO - fix this bullshit
  const sequelize = new Sequelize(pgSettings.database, pgSettings.username, pgSettings.password, {
    host: pgSettings.host,
    dialect: 'postgres',
    logging: false,
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

  // Associate all of our models
  Object.keys(sequelize.models)
    .map(name => sequelize.models[name])
    .filter(model => model.associate !== undefined)
    .forEach(model => model.associate());

  sequelize.sync({ force: true }).then(() => {
    console.log('Database ready');
    app.service('/users').create({
      email: 'tyler@gmail.com',
      password: 'test123',
      username: 'DinoEntrails',
    });
  });
};
