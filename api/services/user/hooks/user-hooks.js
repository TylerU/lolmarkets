/* eslint no-param-reassign: "off" */
const hooks = require('feathers-hooks');
const auth = require('feathers-authentication').hooks;
const _ = require('lodash');
const customHooks = require('../../../hooks');
const schema = require('../user-schema');

const jsonSchema = schema.jsonSchema;
const outProperties = schema.outProperties;
const inProperties = schema.inProperties;

exports.outProperties = outProperties;
exports.inProperties = inProperties;

exports.before = {
  all: [],
  find: [
    hooks.disable('external'),
  ],
  get: [
    auth.verifyToken(),
    auth.populateUser(),
    auth.restrictToAuthenticated(),
    auth.restrictToOwner({ ownerField: 'id' }),
  ],
  create: [
    hooks.pluck.apply(hooks, inProperties),
    customHooks.validateHook(jsonSchema),
    auth.hashPassword(),
    customHooks.overrideData((app) => ({
      superAdmin: false,
      money: app.get('businessSettings').startingMoney,
    })),
  ],
  update: [
    hooks.disable(() => false),
  ],
  patch: [
    hooks.pluck.apply(hooks, inProperties),
    auth.verifyToken(),
    customHooks.validateHook(jsonSchema),
    auth.hashPassword(),
    auth.populateUser(),
    auth.restrictToAuthenticated(),
    auth.restrictToOwner({ ownerField: 'id' }),
  ],
  remove: [
    hooks.disable(() => false),
  ],
};


exports.after = {
  all: [
    customHooks.toJson(),
    hooks.pluck.apply(hooks, outProperties),
  ],
  find: [],
  get: [],
  create: [],
  update: [],
  patch: [],
  remove: [],
};

