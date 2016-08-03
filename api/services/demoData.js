const users = require('./demodata/user');
const channels = require('./demodata/channel');
const markets = require('./demodata/market');
const transactions = require('./demodata/transaction');
const _ = require('lodash');
const Promise = require('bluebird');

module.exports = function (app) {
  const UserService = app.service('users');
  const ChannelService = app.service('channels');
  const MarketService = app.service('markets');
  const TransactionService = app.service('transactions');

  const usersProm = _.map(users, (user) => UserService.create(user));
  const channelsProm = _.map(channels, (channel) => ChannelService.create(channel));
  return Promise.all(usersProm.concat(channelsProm))
    .then(() => Promise.all(_.map(markets, (market) => MarketService.create(market))))
    .then(() => {
      function execElem(i) {
        if (i < transactions.length) {
          return TransactionService.create(transactions[i]).then(execElem.bind(null, i + 1));
        }
        return null;
      }
      return execElem(0);
    })
    .then(() => MarketService.patch(1, { active: false }))
    .then(/*(res) => console.dir(res, { depth: null })*/() => console.log('done'), console.log.bind(console, 'failure'));
};

