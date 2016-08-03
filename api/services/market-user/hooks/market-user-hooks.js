/* eslint no-param-reassign: "off" */
const hooks = require('feathers-hooks');
const auth = require('feathers-authentication').hooks;
const customHooks = require('../../../hooks/index.js');
const schema = require('../market-user-schema');

const jsonSchema = schema.jsonSchema;
const outProperties = schema.outProperties;
const inProperties = schema.inProperties;


exports.before = {
  all: [],
  find: [
    auth.verifyToken(),
    auth.populateUser(),
    auth.restrictToAuthenticated(),
    auth.queryWithCurrentUser({ idField: 'id', as: 'user' }),
  ],
  get: [
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
