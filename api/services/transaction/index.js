'use strict';
/* eslint no-else-return: "off" */
const hooks = require('./hooks/transaction-hooks');
const filters = require('./transaction-filters').filters;
const model = require('./transaction-model');
const Sequelize = require('sequelize');

const Service = require('feathers-sequelize').Service;
const Promise = require('bluebird');
const errors = require('feathers-errors');

const MarketComputer = require('../market/computation').MarketComputer;

class TransactionsService extends Service {
  constructor(options) {
    super(options);
    if (!options.sequelize) throw new Error('Sequelize has to be provided');
    if (!options.app) throw new Error('App has to be provided');
    this.sequelize = options.sequelize;
    this.app = options.app;
  }

  create(data /* , params*/) {
    const real = !data.fake;
    const sequelize = this.sequelize;
    const User = sequelize.models.User;
    const Market = sequelize.models.Market;
    const MarketUser = sequelize.models.MarketUser;
    const app = this.app;

    const Transaction = this.Model;
    const yesSharesDelta = data.yesSharesDelta;
    const noSharesDelta = data.noSharesDelta;

    const user = data.user;
    const market = data.market;
    if (yesSharesDelta === 0 && noSharesDelta === 0) throw new errors.BadRequest('That\'s not a valid transaction');
    if (yesSharesDelta !== 0 && noSharesDelta !== 0) throw new errors.BadRequest('Only one of the two shares can be non-zero');

    function executeTransaction(t) {
      const findUser = User.findById(user, real ? { transaction: t, lock: t.LOCK.UPDATE } : {});
      const findMarket = Market.findById(market, real ? { transaction: t, lock: t.LOCK.UPDATE } : {});
      const findOrCreateOptions = {
        where: {
          user,
          market,
        },
        defaults: {
          yesShares: 0,
          noShares: 0,
          inMoney: 0,
          outMoney: 0,
        },
      };
      if (real) {
        findOrCreateOptions.transaction = t;
        findOrCreateOptions.lock = t.LOCK.UPDATE;
      }
      const findOrCreateMarketUser = MarketUser.findOrCreate(findOrCreateOptions).spread((obj) => obj);

      return Promise.all([findUser, findMarket, findOrCreateMarketUser]).spread((userSql, marketSql, marketUserSql) => {
        const computer = new MarketComputer(marketSql.toJSON());
        const cost = computer.getTransactionCost(yesSharesDelta, noSharesDelta);

        if (userSql.get('money') < cost) {
          throw new errors.BadRequest('Not enough money');
        }
        if (yesSharesDelta < 0 && marketUserSql.get('yesShares') < -yesSharesDelta) {
          throw new errors.BadRequest('User doesn\'t have enough yes shares to execute operation');
        }
        if (noSharesDelta < 0 && marketUserSql.get('noShares') < -noSharesDelta) {
          throw new errors.BadRequest('User doesn\'t have enough no shares to execute operation');
        }
        if (!marketSql.get('active')) {
          throw new errors.BadRequest('Market is closed');
        }
        const futureComputer = new MarketComputer({
          yesSharesCompute: marketSql.get('yesSharesCompute') + yesSharesDelta,
          noSharesCompute: marketSql.get('noSharesCompute') + noSharesDelta,
          alpha: marketSql.get('alpha'),
        });

        if (real) {
          const updateMarket = marketSql.increment({
            yesSharesCompute: yesSharesDelta,
            yesShares: yesSharesDelta,
            noSharesCompute: noSharesDelta,
            noShares: noSharesDelta,
          }, { transaction: t });

          const updateUser = userSql.decrement({
            money: cost,
          }, { transaction: t });

          const updateMarketUser = marketUserSql.increment({
            yesShares: yesSharesDelta,
            noShares: noSharesDelta,
            inMoney: cost > 0 ? cost : 0,
            outMoney: cost > 0 ? 0 : -cost,
          }, { transaction: t });

          const createTransaction = Transaction.create({
            yesSharesDelta,
            noSharesDelta,
            market,
            user,
            totalPrice: cost,
            newPercent: futureComputer.getPercent(),
          }, { transaction: t });
          return Promise.all([updateMarket, updateUser, updateMarketUser, createTransaction])
            .then((allArr) => {
              // TODO - find better way to notify that doesn't hit the database.
              // This updates timestamp then SELECT's all fields to return.
              app.service('markets').patch(market, {});
              app.service('users').patch(user, {});
              app.service('marketUsers').patch(marketUserSql.get('id'), {});
              return allArr;
            });
        } else {
          return [null, null, null, {
            yesSharesDelta,
            noSharesDelta,
            market,
            user,
            totalPrice: cost,
            newYesPrice: futureComputer.getYesPrice(),
            newNoPrice: futureComputer.getNoPrice(),
            newPercent: futureComputer.getPercent(),
          }];
        }
      });
    }

    let prom = null;
    if (real) {
      prom = sequelize.transaction({
        isolationLevel: Sequelize.Transaction.ISOLATION_LEVELS.READ_COMMITTED,
      }, executeTransaction);
    } else {
      prom = executeTransaction(null);
    }
    return prom.spread((m, u, mu, transaction) => transaction);
  }
}

module.exports = function () {
  const app = this;

  const options = {
    Model: model(app.get('sequelize')),
    sequelize: app.get('sequelize'),
    app,
    paginate: {
      default: 1000,
      max: 1000,
    },
  };

  // Initialize our service with any options it requires
  app.use('/transactions', new TransactionsService(options));

  // Get our initialized service to that we can bind hooks
  const transactionService = app.service('/transactions');

  // Set up our before hooks
  transactionService.before(hooks.before);

  // Set up our after hooks
  transactionService.after(hooks.after);

  transactionService.filter(filters);
};

