/* eslint no-param-reassign: "off" */
const hooks = require('feathers-hooks');
const auth = require('feathers-authentication').hooks;
const customHooks = require('../../../hooks/index.js');
const _ = require('lodash');
const schema = require('../channel-schema');
const Promise = require('bluebird');

const jsonSchema = schema.jsonSchema;
const outProperties = schema.outProperties;
const inProperties = schema.inProperties;

const debugSettings = false;
if (debugSettings) {
  console.log('out', outProperties);
  console.log('in', inProperties);
}

function populateMarkets(hook, channel) {
  return hook.app.service('/markets').find({ query: { channel: channel.id } })
    .then((res) => {
      if (res.data.length > 0) {
        channel.markets = _.map(res.data, 'id');
      }
      return channel;
    });
}

exports.before = {
  all: [],
  find: [],
  get: [],
  create: [
    hooks.pluck.apply(hooks, inProperties),
    auth.verifyToken(),
    auth.populateUser(),
    auth.restrictToAuthenticated(),
    customHooks.superAdminOnlyHook(),
    customHooks.validateHook(jsonSchema),
    customHooks.overrideData({ leagueAccounts: '[]' }),
  ],
  update: [
    hooks.pluck.apply(hooks, inProperties),
    auth.verifyToken(),
    auth.populateUser(),
    auth.restrictToAuthenticated(),
    customHooks.superAdminOnlyHook(),
    customHooks.validateHook(jsonSchema),
  ],
  patch: [
    hooks.disable(() => true),
  ],
  remove: [
    auth.verifyToken(),
    auth.populateUser(),
    auth.restrictToAuthenticated(),
    customHooks.superAdminOnlyHook(),
  ],
};

exports.after = {
  all: [
    customHooks.toJson(),
    customHooks.mapResultHook(populateMarkets),
    hooks.pluck.apply(hooks, outProperties),
  ],
  find: [],
  get: [],
  create: [],
  update: [],
  patch: [],
  remove: [],
};
