const hooks = require('feathers-hooks');
const auth = require('feathers-authentication').hooks;
const superAdminOnly = require('../../../hooks/index.js').superAdminOnlyHook;
const validateHook = require('../../../hooks/index.js').validateHook;
const _ = require('lodash');
/* eslint no-param-reassign: "off" */


const schema = {
  displayName: {
    required: true,
    type: 'string',
  },
  twitchName: {
    required: true,
    type: 'string',
  },
  isStreaming: {
    required: true,
    type: 'boolean',
  },
  activeMarkets: {
    type: 'array',
    items: {
      type: 'string',
    },
  },
  leagueAccounts: {
    type: 'array',
    items: {
      type: 'integer',
    },
  },
  activity: {
    required: true,
    type: 'integer',
  },
};

const outProperties = ['activity', 'displayName', 'twitchName', 'isStreaming', 'activeMarkets'];
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
