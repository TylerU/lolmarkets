const feathers = require('feathers/client');
const authentication = require('feathers-authentication/client');
const socketio = require('feathers-socketio/client');
const hooks = require('feathers-hooks');
const io = require('socket.io-client');

const usePrefix = false;
const host = window.location.hostname + ':3030';
const socket = usePrefix ? io() : io(host);

const app = feathers()
  .configure(hooks())
  .configure(authentication({ storage: window.localStorage }))
  .configure(socketio(socket));

const getPath = (path) => `${usePrefix ? '/api' : ''}${path}`;

const UserService = app.service(getPath('/users'));
const ChannelService = app.service(getPath('/channels'));
const MarketService = app.service(getPath('/markets'));
const MarketUserService = app.service(getPath('/marketUsers'));
const TransactionService = app.service(getPath('/transactions'));
const LeaderboardService = app.service(getPath('/leaderboards'));

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
