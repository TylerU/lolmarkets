/* eslint no-param-reassign: "off" */
const hooks = require('feathers-hooks');
const auth = require('feathers-authentication').hooks;
const customHooks = require('../../../hooks/index.js');
const schema = require('../transaction-schema');

const jsonSchema = schema.jsonSchema;
const outProperties = schema.outProperties;
const inProperties = schema.inProperties;

const debugSettings = true;
if (debugSettings) {
  console.log('out', outProperties);
  console.log('in', inProperties);
}

exports.before = {
  all: [
    auth.verifyToken(),
    auth.populateUser(),
    auth.restrictToAuthenticated(),
  ],
  find: [
    auth.restrictToOwner({ ownerField: 'id' }),
  ],
  get: [
    auth.restrictToOwner({ ownerField: 'id' }), // TODO - update id
  ],
  create: [
    hooks.pluck.apply(hooks, inProperties),
    customHooks.validateHook(jsonSchema),
  ],
  update: [
    hooks.disable(() => true),
  ],
  patch: [
    hooks.disable(() => true),
  ],
  remove: [
    hooks.disable(() => true),
  ],
};

exports.after = {
  all: [customHooks.pluckAfter(outProperties)],
  find: [],
  get: [],
  create: [],
  update: [],
  patch: [],
  remove: [],
};
