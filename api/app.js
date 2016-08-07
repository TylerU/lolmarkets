// app.js
const feathers = require('feathers');
const rest = require('feathers-rest');
const socketio = require('feathers-socketio');
const bodyParser = require('body-parser');
const configuration = require('feathers-configuration');
const hooks = require('feathers-hooks');
const middleware = require('./middleware');
const services = require('./services');
const path = require('path');
const _ = require('lodash');

// A Feathers app is the same as an Express app
const app = feathers();
app.configure(configuration(path.join(__dirname, '.')));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.configure(hooks());
app.configure(rest());
app.configure(socketio((io) => {
  io.on('connection', (socket) => {
    socket.feathers.channels = {};
    socket.on('watchChannelMarkets', function(channels) {
      socket.feathers.channels = _.chain(channels).map((chan) => [chan, true]).fromPairs().value(); // eslint-disable-line no-param-reassign
    });
  });
}));
app.configure(services);
app.configure(middleware);


module.exports = app;
