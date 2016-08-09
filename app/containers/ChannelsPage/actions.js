/*
 * App Actions
 *
 * Actions change things in your application
 * Since this boilerplate uses a uni-directional data flow, specifically redux,
 * we have these actions which are the only way your application interacts with
 * your appliction state. This guarantees that your state is up to date and nobody
 * messes it up weirdly somewhere.
 *
 * To add a new Action:
 * 1) Import your constant
 * 2) Add a function like this:
 *    export function yourAction(var) {
 *        return { type: YOUR_ACTION_CONSTANT, var: var }
 *    }
 */

import {
  LOAD_ALL_CHANNELS,
  LOAD_ALL_CHANNELS_SUCCESS,
  LOAD_ALL_CHANNELS_ERROR,
  LOAD_CHANNEL,
  LOAD_CHANNEL_SUCCESS,
  LOAD_CHANNEL_ERROR,
} from './constants';


export function loadChannel(id) {
  return {
    type: LOAD_CHANNEL,
    id,
  };
}

export function loadChannelSuccess(channel) {
  return {
    type: LOAD_CHANNEL_SUCCESS,
    channel,
  };
}

export function loadChannelError(err) {
  return {
    type: LOAD_CHANNEL_ERROR,
    err,
  };
}

export function loadAllChannels() {
  return {
    type: LOAD_ALL_CHANNELS,
  };
}

export function loadAllChannelsSuccess(channels) {
  return {
    type: LOAD_ALL_CHANNELS_SUCCESS,
    channels,
  };
}

export function loadAllChannelsError(err) {
  return {
    type: LOAD_ALL_CHANNELS_ERROR,
    err,
  };
}

