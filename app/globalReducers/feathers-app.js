const feathers = require('feathers/client');
const authentication = require('feathers-authentication/client');
const socketio = require('feathers-socketio/client');
const hooks = require('feathers-hooks');
const io = require('socket.io-client');

const host = window.location.hostname + ':3030';

// TODO - fix url
const socket = io(host, {
  transport: ['websockets'],
});

const app = feathers()
  .configure(hooks())
  .configure(authentication({ storage: window.localStorage }))
  .configure(socketio(socket));

/*
This is shameful, indeed, but here I stand.

Problem: methods need to wait until the socket is authenticated to make their calls.
It's difficult to do this well, so I'm just wrapping the services.
The proper thing to do would to write a proper api wrapper rather than doing it transparently,
but we're shooting for release here.
 */
function wrapService(service) {
  const methods = ['find', 'get', 'create', 'update', 'patch', 'remove'];
  methods.forEach((method) => {
    const originalMethod = service[method];
    service[method] = function() {
      const prom = app.get('reauthPromise');
      const myThis = this;
      if (prom) {
        return prom.then(() => originalMethod.apply(myThis, arguments));
      } else {
        return originalMethod.apply(this, arguments);
      }
    };
  });
  return service;
}

const UserService = wrapService(app.service('users'));
const ChannelService = wrapService(app.service('channels'));
const MarketService = wrapService(app.service('markets'));
const MarketUserService = wrapService(app.service('marketUsers'));
const TransactionService = wrapService(app.service('transactions'));
const LeaderboardService = wrapService(app.service('leaderboards'));

export {
  app,
  socket,
  UserService,
  ChannelService,
  MarketService,
  TransactionService,
  MarketUserService,
  LeaderboardService
};
