/* eslint no-param-reassign: "off" */
const hooks = require('feathers-hooks');
const auth = require('feathers-authentication').hooks;
const customHooks = require('../../../hooks/index.js');
const schema = require('../market-user-schema');

const jsonSchema = schema.jsonSchema;
const outProperties = schema.outProperties;
const inProperties = schema.inProperties;

function populateMarket(hook, marketUser) {
  if (hook.params.includeMarket) {
    return hook.app.service('/markets').get(marketUser.market, { query: { $beNormal: true } })
      .then((res) => {
        marketUser.marketObj = res;
        return marketUser;
      });
  }
  return marketUser;
}

exports.before = {
  all: [
    (hook) => {
      if (hook.params.query && hook.params.query.$includeMarket) {
        hook.params.includeMarket = true;
      }
    },
  ],
  find: [
    customHooks.pluckQuery(outProperties),
    auth.verifyToken(),
    auth.populateUser(),
    auth.restrictToAuthenticated(),
    auth.queryWithCurrentUser({ idField: 'id', as: 'user' }),
  ],
  get: [
    customHooks.ensureId(),
    auth.verifyToken(),
    auth.populateUser(),
    auth.restrictToAuthenticated(),
    auth.restrictToOwner({ idField: 'id', ownerField: 'user' }),
  ],
  create: [
    hooks.pluck.apply(hooks, inProperties),
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
    auth.verifyToken(),
    auth.populateUser(),
    auth.restrictToAuthenticated(),
    customHooks.superAdminOnlyHook(),
    customHooks.validateHook(jsonSchema),
  ],
  remove: [
    hooks.disable(() => false),
  ],
};

exports.after = {
  all: [
    customHooks.toJson(),
    customHooks.mapResultHook(populateMarket),
    customHooks.ignoreNoProvider(), // Hack for the behavior of hooks.pluck. Do not call any other methods below here
    hooks.pluck.apply(hooks, outProperties),
  ],
  find: [],
  get: [],
  create: [],
  update: [],
  patch: [],
  remove: [],
};
