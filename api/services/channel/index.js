const service = require('feathers-sequelize');
const hooks = require('./hooks/channel-hooks');
const model = require('./channel-model');

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
  app.use('/channels', service(options));

  // Get our initialized service to that we can bind hooks
  const channelService = app.service('/channels');

  // Set up our before hooks
  channelService.before(hooks.before);

  // Set up our after hooks
  channelService.after(hooks.after);
};

