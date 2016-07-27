/* eslint no-param-reassign: "off" */
const hooks = require('feathers-hooks');
const auth = require('feathers-authentication').hooks;
const customHooks = require('../../../hooks/index.js');
const schema = require('../market-schema');
const _ = require('lodash');

const jsonSchema = schema.jsonSchema;
const outProperties = schema.outProperties;
const MarketComputer = require('../computation').MarketComputer;

const inProperties = schema.inProperties;
const debugSettings = false;
if (debugSettings) {
  console.log('out', outProperties);
  console.log('in', inProperties);
}

function populateProperties(hook) {
  if (!hook.result) return;
  const computer = new MarketComputer(hook.result);
  const result = hook.result;

  hook.result = _.assign({}, result, {
    yesPrice: computer.getYesPrice(),
    noPrice: computer.getNoPrice(),
    percent: computer.getPercent(),
  });
}

function getDefaults(app) {
  const market = app.get('market');
  return {
    yesSharesCompute: market.startingYes,
    noSharesCompute: market.startingNo,
    alpha: market.alpha,
    yesShares: 0,
    noShares: 0,
    timeOpened: new Date(),
  };
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
    customHooks.overrideData(getDefaults),
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
    populateProperties,
    customHooks.pluckAfter(outProperties),
  ],
  find: [],
  get: [],
  create: [],
  update: [],
  patch: [],
  remove: [],
};
