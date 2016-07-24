const service = require('feathers-sequelize');
const hooks = require('./hooks/market-user-hooks');
const model = require('./market-user-model');

module.exports = function () {
  const app = this;

  const options = {
    Model: model(app.get('sequelize')),
    paginate: {
      default: 25,
      max: 25,
    },
  };

  // Initialize our service with any options it requires
  app.use('/marketUsers', service(options));

  // Get our initialized service to that we can bind hooks
  const marketUserService = app.service('/marketUsers');

  // Set up our before hooks
  marketUserService.before(hooks.before);

  // Set up our after hooks
  marketUserService.after(hooks.after);
};

