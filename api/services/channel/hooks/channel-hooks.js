/* eslint no-param-reassign: "off" */
const hooks = require('feathers-hooks');
const auth = require('feathers-authentication').hooks;
const customHooks = require('../../../hooks/index.js');
const _ = require('lodash');
const schema = require('../channel-schema');


const jsonSchema = schema.jsonSchema;
const outProperties = schema.outProperties;
const inProperties = schema.inProperties;

const debugSettings = false;
if (debugSettings) {
  console.log('out', outProperties);
  console.log('in', inProperties);
}

exports.before = {
  all: [],
  find: [(hook) => {
    hook.params.sequelize = {
      include: [{
        model: hook.app.get('sequelize').models.Market,
        as: 'markets',
      }],
    };
  }],
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
    hooks.pluck.apply(hooks, outProperties),
  ],
  find: [],
  get: [],
  create: [],
  update: [],
  patch: [],
  remove: [],
};
