const authentication = require('feathers-authentication');


module.exports = function () {
  const app = this;
  const config = app.get('auth');
  app.configure(authentication(config));
};
