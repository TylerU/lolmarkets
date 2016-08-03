'use strict';

const request = require('request-promise');
const _ = require('lodash');
const moment = require('moment');
const Promise = require('bluebird');

const POLL_INTERVAL = moment.duration(5, 'minutes').asMilliseconds();

function log(res) {
  console.log(res);
  return res;
}

function TwitchMonitor(app) {
  function checkChannel(channelName) {
    return request({
      method: 'GET',
      uri: `https://api.twitch.tv/kraken/streams/${channelName}`,
      json: true,
    })
      .then((res) => ({
        isStreaming: res.stream !== null,
        twitchViewers: res.stream !== null ? res.stream.viewers : 0,
      }));
      // .then(log)
  }

  const ChannelService = app.service('channels');

  function checkAllChannels() {
    return ChannelService.find({ query: { $limit: 1000 } })
      .then((channels) => channels.data)
      // .then((channels) => _.map(channels, (chan) => _.assign({}, chan, { isStreaming: (Math.random() < 0.5) })))
      // .then((channels) => { console.log(_.map(channels, _.partialRight(_.pick, ['id', 'isStreaming']))); return channels; })
      .then((channels) =>
        Promise.all(
          _.chain(channels)
          .map('twitchName')
          .map(checkChannel)
          .value())
        // .then(log)
        .then((streams) =>
          _.chain(channels)
            .zip(streams)
            .filter(_.spread((channel, stream) => channel.isStreaming !== stream.isStreaming || channel.twitchViewers !== stream.twitchViewers))
            .map(_.spread((channel, stream) => _.assign({ id: channel.id }, stream)))
            .value()))
      // .then(log)
      .then((updates) => Promise.all(_.map(updates, (obj) => ChannelService.patch(obj.id, _.omit(obj, 'id')))))
      // .then(log)
      .then(() => app.logger.info('Successfully queried Twitch'), (err) => app.logger.error(`Twitch service failed with error ${err}`))
      .then(() => setTimeout(checkAllChannels, POLL_INTERVAL), () => setTimeout(checkAllChannels, POLL_INTERVAL));
  }
  return checkAllChannels();
}


module.exports = TwitchMonitor;
