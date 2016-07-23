const hooks = require('feathers-hooks');
const auth = require('feathers-authentication').hooks;
const superAdminOnly = require('../../../hooks/index.js').superAdminOnlyHook;
const validateHook = require('../../../hooks/index.js').validateHook;
const _ = require('lodash');
/* eslint no-param-reassign: "off" */


const schema = {
  name: {
    type: 'string',
    required: true,
  },
  channel: {
    type: 'string',
    required: true,
  },
};

const outProperties = ['name', 'channel'];
const inProperties = _.keys(schema); // Everything

exports.outProperties = outProperties;
exports.inProperties = inProperties;

exports.before = {
  all: [],
  find: [],
  get: [],
  create: [
    auth.verifyToken(),
    auth.populateUser(),
    auth.restrictToAuthenticated(),
    superAdminOnly(),
    validateHook(schema),
    hooks.pluck.apply(hooks, inProperties),
  ],
  update: [
    auth.verifyToken(),
    auth.populateUser(),
    auth.restrictToAuthenticated(),
    superAdminOnly(),
    validateHook(schema),
    hooks.pluck.apply(hooks, inProperties),
  ],
  patch: [
    hooks.disable(() => true),
  ],
  remove: [
    auth.verifyToken(),
    auth.populateUser(),
    auth.restrictToAuthenticated(),
    superAdminOnly(),
  ],
};

exports.after = {
  all: [hooks.pluck.apply(hooks, outProperties)],
  find: [],
  get: [],
  create: [],
  update: [],
  patch: [],
  remove: [],
};
