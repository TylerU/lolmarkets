'use strict';

const request = require('request-promise');
const _ = require('lodash');
const moment = require('moment');

const POLL_INTERVAL = moment.duration(5, 'minutes').asMilliseconds();

class StreamListener {
  constructor(channel) {
    this.channel = channel;
    this.listeners = {};
    this.streaming = false;
    this.idx = 0; // Unique index generator for our listeners
  }

  registerListener(fn) {
    this.listeners[this.idx] = fn;
    if (this.streaming) {
      _.defer(fn, {isStreaming: true});
    }
    return this.idx++;
  }

  unregisterListener(id) {
    delete this.listeners[id];
  }

  getListenerCount() {
    return _.keys(this.listeners).length;
  }

  executeUpdate() {
    if (this.getListenerCount() > 0) {
      request({
        method: 'GET',
        uri: 'https://api.twitch.tv/kraken/streams/' + this.channel,
        json: true
      }).then(function(res) {
        const isStreaming = res.stream !== null;
        if (isStreaming !== this.streaming) {
          this.streaming = isStreaming;

          _.each(this.listeners, function(fn) {
            fn({
              isStreaming: isStreaming
            });
          });
        }
      }.bind(this)).catch(function(err) {
        console.log('Error fetching stream status from twitch API: ', err);
        // TODO handle error
      }.bind(this));
    }
  }
}


const TwitchMonitor = {
  currentStreams: {},
  polling: false,

  pollAll: function() {
    _.each(this.currentStreams, function(streamListener) {
      streamListener.executeUpdate();
    });
    setTimeout(this.pollAll.bind(this), POLL_INTERVAL)
  },

  registerListener: function(channel, fn) {
    if (!this.currentStreams[channel]) {
      this.currentStreams[channel] = new StreamListener(channel);
    }
    const id = this.currentStreams[channel].registerListener(fn);

    if (!this.polling) {
      this.pollAll();
    }

    return id;
  },

  unregisterListener: function(channel, id) {
    if (!this.currentStreams[channel]) {
      // TODO Handle error
    } else {
      this.currentStreams[channel].unregisterListener(id);
      if (this.currentStreams[channel].getListenerCount() == 0) {
        delete this.currentStreams[channel];
        if (_.keys(this.currentStreams).length == 0) {
          this.polling = false;
        }
      }
    }
  }
};


module.exports =  TwitchMonitor;