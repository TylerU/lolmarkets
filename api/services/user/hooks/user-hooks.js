/* eslint no-param-reassign: "off" */
const hooks = require('feathers-hooks');
const auth = require('feathers-authentication').hooks;
const _ = require('lodash');
const customHooks = require('../../../hooks');
const schema = require('../user-schema');
const moment = require('moment');
const jsonSchema = schema.jsonSchema;
const outProperties = schema.outProperties;
const inProperties = schema.inProperties;

exports.outProperties = outProperties;
exports.inProperties = inProperties;

exports.before = {
  all: [],
  find: [
    customHooks.pluckQuery(outProperties),
    hooks.disable('external'),
  ],
  get: [
    customHooks.ensureId(),
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
      lastLogin: moment().toDate(),
      lastLoginReward: moment().toDate(),
    })),
  ],
  update: [
    hooks.disable(() => false),
  ],
  patch: [
    customHooks.ensureId(),
    hooks.pluck.apply(hooks, inProperties),
    auth.verifyToken(),
    customHooks.validateHook(jsonSchema),
    (hook) => {
      if (hook.data.password) {
        auth.hashPassword()(hook);
      }
    },
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

