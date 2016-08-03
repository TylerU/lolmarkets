const users = require('../demodata/user');
const channels = require('../demodata/channel');
const markets = require('../demodata/market');
const transactions = require('../demodata/transaction');
const Promise = require('bluebird');

module.exports = function (app) {
  const UserService = app.service('users');
  const ChannelService = app.service('channels');
  const MarketService = app.service('markets');
  const TransactionService = app.service('transactions');
  function execElem(i, arr, service) {
    if (i < arr.length) {
      return service.create(arr[i]).then(execElem.bind(null, i + 1, arr, service));
    }
    return null;
  }
  const usersProm = execElem(0, users, UserService);
  const channelsProm = execElem(0, channels, ChannelService);
  return Promise.all([usersProm, channelsProm])
    .then(() => execElem(0, markets, MarketService))
    .then(() => execElem(0, transactions, TransactionService))
    .then(() => MarketService.patch(1, { active: false }))
    .then(
      () => app.logger.info('Successfully wiped and repopulated the database'),
      (err) => app.logger.error(`Failed to repopulate the database: ${err}`));
};
