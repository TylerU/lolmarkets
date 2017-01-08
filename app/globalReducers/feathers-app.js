const feathers = require('feathers/client');
const authentication = require('feathers-authentication/client');
const socketio = require('feathers-socketio/client');
const hooks = require('feathers-hooks');
const io = require('socket.io-client');

const host = window.location.hostname + ':3030';

const socket = io(host, {
  transport: ['websockets'],
});

const app = feathers()
  .configure(hooks())
  .configure(authentication({ storage: window.localStorage }))
  .configure(socketio(socket));

const UserService = app.service('users');
const ChannelService = app.service('channels');
const MarketService = app.service('markets');
const MarketUserService = app.service('marketUsers');
const TransactionService = app.service('transactions');
const LeaderboardService = app.service('leaderboards');

export {
  app,
  socket,
  UserService,
  ChannelService,
  MarketService,
  TransactionService,
  MarketUserService,
  LeaderboardService,
};
