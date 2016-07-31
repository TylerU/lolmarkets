/* eslint no-param-reassign: "off" */
const hooks = require('feathers-hooks');
const auth = require('feathers-authentication').hooks;
const customHooks = require('../../../hooks/index.js');
const schema = require('../market-schema');
const _ = require('lodash');

const jsonSchema = schema.jsonSchema;
const outProperties = schema.outProperties;
const inProperties = schema.inProperties;
const MarketComputer = require('../computation').MarketComputer;


function populateProperties(market) {
  const computer = new MarketComputer(market);

  return _.assign({}, market, {
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
  get: [
    customHooks.maybeVerifyToken(),
    auth.populateUser(),
  ],
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
    customHooks.mapResultHook(populateProperties),
    hooks.pluck.apply(hooks, outProperties),
  ],
  find: [],
  get: [
    (hook) => {
      if (hook.params.user) {
        return hook.app.service('/marketUsers').find({ user: hook.params.user.id, market: hook.result.id })
          .then((res) => {
            if (res.data.length === 1) {
              hook.result.marketUser = res.data[0];
            }
          });
      }
      return null;
    },
  ],
  create: [],
  update: [],
  patch: [],
  remove: [],
};
