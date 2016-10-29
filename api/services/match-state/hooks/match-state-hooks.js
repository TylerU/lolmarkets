/* eslint no-param-reassign: "off" */
const hooks = require('feathers-hooks');
const auth = require('feathers-authentication').hooks;
const customHooks = require('../../../hooks/index.js');
const schema = require('../match-state-schema');

const jsonSchema = schema.jsonSchema;
const outProperties = schema.outProperties;
const inProperties = schema.inProperties;

const debugSettings = false;
if (debugSettings) {
  console.log('out', outProperties);
  console.log('in', inProperties);
}

exports.before = {
  all: [
    auth.verifyToken(),
    auth.populateUser(),
    auth.restrictToAuthenticated(),
    customHooks.superAdminOnlyHook(),
  ],
  find: [
    hooks.disable(() => false),
  ],
  get: [
    hooks.disable(() => false),
  ],
  create: [
    hooks.pluck.apply(hooks, inProperties),
    customHooks.validateHook(jsonSchema),
  ],
  update: [
    hooks.disable(() => false),
  ],
  patch: [
    hooks.disable(() => false),
  ],
  remove: [
    hooks.disable(() => false),
  ],
};

exports.after = {
  all: [
    hooks.pluck.apply(hooks, outProperties),
  ],
  find: [],
  get: [],
  create: [],
  update: [],
  patch: [],
  remove: [],
};
