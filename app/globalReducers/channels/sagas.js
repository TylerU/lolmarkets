/**
 * Gets the repositories of the user from Github
 */

import { take, call, put, select, fork, cancel } from 'redux-saga/effects';
import { takeEvery } from 'redux-saga';

import {
  LOAD_CHANNEL,
  LOAD_ALL_CHANNELS,
  LOAD_CHANNEL_BY_NAME,
} from 'globalReducers/channels/constants';

import {
  loadAllChannelsSuccess,
  loadAllChannelsError,
  loadChannelSuccess,
  loadChannelError,
} from 'globalReducers/channels/actions';

// import request from 'utils/request';
// import { selectUsername } from 'containers/HomePage/selectors';
import { ChannelService } from 'globalReducers/feathers-app';

export function* loadChannelActual(action) {
  const channel = yield ChannelService.get(action.id)
    .then((result) => ({ result }), (error) => ({ error }));

  if (!channel.error) {
    yield put(loadChannelSuccess(channel.result));
  } else {
    yield put(loadChannelError(channel.error));
  }
}

function getChannelByName(displayName) {
  return ChannelService.find({ query: { $limit: 1, displayName } })
    .then((result) => ({ result: result.data }), (error) => ({ error }));
}

export function* loadChannelByNameActual(action) {
  const { result, error } = yield call(getChannelByName, action.displayName);

  if (!error) {
    if (result.length > 0) {
      yield put(loadChannelSuccess(result[0]));
    } else {
      yield put(loadChannelError({
        displayName: action.displayName,
        message: 'No channel found for given displayName',
      }));
    }
  } else {
    yield put(loadChannelError(error));
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

export function* onLoadChannelByName() {
  yield* takeEvery(LOAD_CHANNEL_BY_NAME, loadChannelByNameActual);
}
// Bootstrap sagas
export default [
  onLoadAllChannels,
  onLoadChannel,
  onLoadChannelByName,
];
