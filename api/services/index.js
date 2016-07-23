const authentication = require('./authentication');
const user = require('./user');
const channel = require('./channel');

module.exports = function () {
  const app = this;

  app.configure(authentication);
  app.configure(user);
  app.configure(channel);
};
