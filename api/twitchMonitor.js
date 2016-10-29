'use strict';

const request = require('request-promise');
const _ = require('lodash');
const moment = require('moment');
const Promise = require('bluebird');

const POLL_INTERVAL = moment.duration(1, 'minutes').asMilliseconds();

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
      headers: {
        'Client-ID': 's221rt4dh5vprqoidlsrs00pv3sdq7j',
      },
    })
      .then((res) => ({
        isStreaming: res.stream !== null && res.stream.game === 'League of Legends',
        twitchViewers: res.stream !== null ? res.stream.viewers : 0,
        twitchImageUrl: res.stream !== null ? res.stream.preview.large : null,
        twitchStreamTitle: res.stream !== null ? res.stream.channel.status : null,
      }));
      // .then(log)
  }

  const ChannelService = app.service('channels');

  // TODO - may be swallowing errors
  function checkAllChannels() {
    return ChannelService.find({ query: { $limit: 1000, twitchName: { $not: '' } } }) // Grab all the channels
      .then((channels) => channels.data)
      .then((channels) =>
        Promise.all(
          _.chain(channels)
          .map('twitchName')
          .map(checkChannel) // Map to promises that check to see if the channel is streaming
          .value())
        .then((streams) =>
          _.chain(channels)
            .zip(streams)
            .filter(_.spread((channel, stream) => channel.isStreaming !== stream.isStreaming || channel.twitchViewers !== stream.twitchViewers))
            .map(_.spread((channel, stream) => _.assign({ id: channel.id }, stream)))
            .value()))
      .then((updates) =>
        Promise.all(
          _.map(updates, (obj) => ChannelService.patch(obj.id, _.omit(obj, 'id')))))
      .then(() => app.logger.info('Successfully queried Twitch'), (err) => app.logger.error('Twitch service failed', err))
      // No matter what, set us up to check again in a few minutes
      .then(() => setTimeout(checkAllChannels, POLL_INTERVAL), () => setTimeout(checkAllChannels, POLL_INTERVAL));
  }
  return checkAllChannels();
}


module.exports = TwitchMonitor;
