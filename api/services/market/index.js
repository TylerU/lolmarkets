const path = require('path');
const NeDB = require('nedb');
const service = require('feathers-nedb');
const hooks = require('./hooks');

module.exports = function () {
  const app = this;

  const db = new NeDB({
    filename: path.join(app.get('nedb'), 'markets.db'),
    autoload: true,
  });


  const options = {
    Model: db,
    paginate: {
      default: 25,
      max: 25,
    },
  };

  // Initialize our service with any options it requires
  app.use('/markets', service(options));

  // Get our initialized service to that we can bind hooks
  const marketsService = app.service('/markets');

  // Set up our before hooks
  marketsService.before(hooks.before);

  // Set up our after hooks
  marketsService.after(hooks.after);
};
