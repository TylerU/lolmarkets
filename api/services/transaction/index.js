const service = require('feathers-sequelize');
const hooks = require('./hooks/transaction-hooks');
const model = require('./transaction-model');

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
  app.use('/transactions', service(options));

  // Get our initialized service to that we can bind hooks
  const userService = app.service('/transactions');

  // Set up our before hooks
  userService.before(hooks.before);

  // Set up our after hooks
  userService.after(hooks.after);
};

