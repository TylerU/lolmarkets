const service = require('feathers-nedb');
const hooks = require('./hooks');
const NeDB = require('nedb');
const path = require('path');

module.exports = function () {
  const app = this;

  const db = new NeDB({
    filename: path.join(app.get('nedb'), 'users.db'),
    autoload: true,
  });

  db.ensureIndex({ fieldName: 'email', unique: true });

  const options = {
    Model: db,
    paginate: {
      default: 25,
      max: 25,
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
};
