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

function notifyChannel(hook) {
  if (hook.result.channel) {
    if (hook.method === 'patch' && (hook.data.active !== undefined || hook.data.channel !== undefined) ||
      hook.method === 'update' ||
      hook.method === 'create' ||
      hook.method === 'remove') {
      hook.app.service('channels').patch(hook.result.channel, {});
    }
  }
}

// Fix design problem here where this value will actually change in response to user changes as well
// Resolution: assume meaningful changes to user only occur in tandem with market changes we'll already be notified about
// through transaction
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

// If MarketUser ever changes without market also changing, we'll need to manually emit events
function populateMarketUser(hook, market) {
  market.marketUser = {};
  if (hook.params.user) {
    return hook.app.service('/marketUsers').find({ query: { user: hook.params.user.id, market: market.id, $beNormal: true, } })
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
    yesSharesStart: market.startingYes,
    noSharesStart: market.startingNo,
    alpha: market.alpha,
    yesShares: 0,
    noShares: 0,
    timeOpened: new Date(),
  };
}

function processData(hook) {
  if (hook.data && hook.data.leagueGameRegion) {
    hook.data.leagueGameRegion = hook.data.leagueGameRegion.toLowerCase();
  } else if (hook.params && hook.params.query && hook.params.query.leagueGameRegion) {
    hook.params.query.leagueGameRegion = hook.params.query.leagueGameRegion.toLowerCase();
  }
}

exports.before = {
  all: [
    customHooks.saveNormal(),
  ],
  find: [
    customHooks.pluckQuery(outProperties),
    processData,
    customHooks.maybeVerifyToken(),
    auth.populateUser(),
  ],
  get: [
    customHooks.ensureId(),
    customHooks.maybeVerifyToken(),
    auth.populateUser(),
  ],
  create: [
    hooks.pluck.apply(hooks, inProperties),
    processData,
    auth.verifyToken(),
    auth.populateUser(),
    auth.restrictToAuthenticated(),
    customHooks.superAdminOnlyHook(),
    customHooks.validateHook(jsonSchema),
    customHooks.overrideData(getDefaults),
  ],
  update: [
    hooks.disable(() => false),
  ],
  patch: [
    customHooks.ensureId(),
    hooks.pluck.apply(hooks, inProperties),
    processData,
    auth.verifyToken(),
    auth.populateUser(),
    auth.restrictToAuthenticated(),
    customHooks.superAdminOnlyHook(),
    customHooks.validateHook(jsonSchema),
  ],
  remove: [
    customHooks.ensureId(),
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
  create: [
    notifyChannel,
  ],
  update: [
    notifyChannel,
  ],
  patch: [
    notifyChannel,
  ],
  remove: [],
};
