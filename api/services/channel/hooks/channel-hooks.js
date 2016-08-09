/* eslint no-param-reassign: "off" */
const hooks = require('feathers-hooks');
const auth = require('feathers-authentication').hooks;
const customHooks = require('../../../hooks/index.js');
const _ = require('lodash');
const schema = require('../channel-schema');

const jsonSchema = schema.jsonSchema;
const outProperties = schema.outProperties;
const inProperties = schema.inProperties;


function populateMarkets(hook, channel) {
  return hook.app.service('/markets').find({ query: { channel: channel.id, active: true } })
    .then((res) => {
      if (res.data.length > 0) {
        channel.markets = _.map(res.data, 'id');
      } else {
        channel.markets = [];
      }
      return channel;
    });
}

function processData(hook) {
  if (hook.data && hook.data.leagueGameRegion) {
    hook.data.leagueGameRegion = hook.data.leagueGameRegion.toLowerCase();
  } else if (hook.params && hook.params.query && hook.params.query.leagueGameRegion) {
    hook.params.query.leagueGameRegion = hook.params.query.leagueGameRegion.toLowerCase();
  }
}

exports.before = {
  all: [],
  find: [
    customHooks.pluckQuery(outProperties),
    processData,
  ],
  get: [
    customHooks.ensureId(),
  ],
  create: [
    hooks.pluck.apply(hooks, inProperties),
    processData,
    auth.verifyToken(),
    auth.populateUser(),
    auth.restrictToAuthenticated(),
    customHooks.superAdminOnlyHook(),
    customHooks.validateHook(jsonSchema),
  ],
  update: [
    hooks.disable(() => false),
  ],
  patch: [
    customHooks.ensureId(),
    hooks.pluck.apply(hooks, inProperties),
    processData,
    auth.verifyToken(),
    auth.populateUser(),
    auth.restrictToAuthenticated(),
    customHooks.superAdminOnlyHook(),
    customHooks.validateHook(jsonSchema),
  ],
  remove: [
    customHooks.ensureId(),
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
