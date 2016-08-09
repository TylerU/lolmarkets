/**
 * Gets the repositories of the user from Github
 */

import { take, call, put, select, fork, cancel } from 'redux-saga/effects';
import { takeEvery } from 'redux-saga';

import { LOAD_CHANNEL, LOAD_ALL_CHANNELS } from './constants';
import { loadAllChannelsSuccess, loadAllChannelsError, loadChannelSuccess, loadChannelError } from 'containers/ChannelsPage/actions';

// import request from 'utils/request';
// import { selectUsername } from 'containers/HomePage/selectors';
import { ChannelService } from 'containers/App/feathers-app';

export function* loadChannelActual(id) {
  const channel = yield ChannelService.get(id)
    .then((result) => ({ result }), (error) => ({ error }));

  if (!channel.error) {
    yield put(loadChannelSuccess(channel));
  } else {
    yield put(loadChannelError(channel.error));
  }
}


export function* loadAllChannelsActual() {
  const channels = yield ChannelService.find({ query: {
    isStreaming: true,
    $sort: {
      twitchViewers: 1,
    },
  } })
    .then((result) => ({ result }), (error) => ({ error }));

  if (!channels.error) {
    yield put(loadAllChannelsSuccess(channels.result.data));
  } else {
    yield put(loadAllChannelsError(channels.error));
  }
}

/**
 * Root saga manages watcher lifecycle
 */
export function* onLoadAllChannels() {
  yield* takeEvery(LOAD_ALL_CHANNELS, loadAllChannelsActual);
}

export function* onLoadChannel() {
  yield* takeEvery(LOAD_CHANNEL, loadChannelActual);
}

// Bootstrap sagas
export default [
  onLoadAllChannels,
  onLoadChannel,
];
