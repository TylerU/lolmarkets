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


// TODO - fix design problem here where this value will actually change in response to user changes as well
function populateMaxCanBuy(hook, market) {
  if (hook.params.user) {
    const computer = new MarketComputer(market);
    const money = hook.params.user.money;
    const maxYes = computer.getMaxYesCanBuy(money);
    const maxNo = computer.getMaxNoCanBuy(money);
    if (market.marketUser) {
      market.marketUser.maxYes = maxYes;
      market.marketUser.maxNo = maxNo;
    } else {
      market.marketUser = {
        maxYes,
        maxNo,
      };
    }
    return market;
  }
  return market;
}

function populateMarketUser(hook, market) {
  if (hook.params.user) {
    return hook.app.service('/marketUsers').find({ query: { user: hook.params.user.id, market: market.id } })
      .then((res) => {
        if (res.data.length > 0) {
          market.marketUser = res.data[0];
        }
        return market;
      });
  }
  return market;
}


function populateProperties(hook, market) {
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
  find: [
    customHooks.maybeVerifyToken(),
    auth.populateUser(),
  ],
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
    customHooks.mapResultHook(populateMarketUser),
    customHooks.mapResultHook(populateProperties),
    customHooks.mapResultHook(populateMaxCanBuy),
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
