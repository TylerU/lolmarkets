/* eslint no-param-reassign: "off" */
const authentication = require('feathers-authentication');
const _ = require('lodash');
const userOutProps = require('../user/hooks/user-hooks').outProperties;

module.exports = function () {
  const app = this;
  const config = app.get('auth');

  app.configure(authentication(config));

  // Remove properties of user object so as not to leak data.
  app.service('auth/token').after({
    create: [function (hook) {
      hook.result.data = _.pick(hook.result.data, userOutProps);
    }],
  });
};
