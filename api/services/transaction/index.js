'use strict';

const hooks = require('./hooks/transaction-hooks');
const model = require('./transaction-model');
const Sequelize = require('sequelize');

const Service = require('feathers-sequelize').Service;
const Promise = require('bluebird');

const MarketComputer = require('../market/computation').MarketComputer;

class TransactionsService extends Service {
  constructor(options) {
    super(options);
    if (!options.sequelize) throw new Error('Sequelize has to be provide');
    this.sequelize = options.sequelize;
  }

  create(data, params) {
    console.log(data);
    const sequelize = this.sequelize;
    const User = sequelize.models.User;
    const Market = sequelize.models.Market;
    const MarketUser = sequelize.models.MarketUser;
    const Transaction = this.Model;

    const yesSharesDelta = data.yesSharesDelta;
    const noSharesDelta = data.noSharesDelta;

    const transactionPromise = sequelize.transaction({
      isolationLevel: Sequelize.Transaction.ISOLATION_LEVELS.SERIALIZABLE,
    }, (t) => {
      const findUser = User.findById(params.user.id, { transaction: t });
      const findMarket = Market.findById(data.market, { transaction: t });
      return Promise.all([findUser, findMarket]).then((res) => {
        const user = res[0];
        const market = res[1];
        const computer = new MarketComputer(market.toJSON());
        const cost = computer.getTransactionCost(yesSharesDelta, noSharesDelta);

        const updateMarket = market.increment({
          yesSharesCompute: yesSharesDelta,
          yesShares: yesSharesDelta,
          noSharesCompute: noSharesDelta,
          noShares: noSharesDelta,
        }, { transaction: t });

        const updateUser = user.decrement({
          money: cost,
        }, { transaction: t });

        // const updateMarketUser = MarketUser.find();
      });
    }).then(() => {
      return {
        toJSON: () => true,
      };
    });
    return transactionPromise;
  }
}

module.exports = function () {
  const app = this;

  const options = {
    Model: model(app.get('sequelize')),
    sequelize: app.get('sequelize'),
    paginate: {
      default: 25,
      max: 25,
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
};

