const service = require('feathers-sequelize');
const hooks = require('./hooks/market-hooks');
const model = require('./market-model');

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
  app.use('/markets', service(options));

  // Get our initialized service to that we can bind hooks
  const marketService = app.service('/markets');

  // Set up our before hooks
  marketService.before(hooks.before);

  // Set up our after hooks
  marketService.after(hooks.after);
};

