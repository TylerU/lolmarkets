const service = require('feathers-sequelize');
const hooks = require('./hooks/user-hooks');
const filters = require('./user-filters').filters;
const model = require('./user-model');

module.exports = function () {
  const app = this;

  const options = {
    Model: model(app.get('sequelize')),
    paginate: {
      default: 1000,
      max: 1000,
    },
  };

  // Initialize our service with any options it requires
  app.use('/users', service(options));

  // Get our initialized service to that we can bind hooks
  const userService = app.service('/users');

  // Set up our before hooks
  userService.before(hooks.before);

  // Set up our after hooks
  userService.after(hooks.after);

  userService.filter(filters);
};

