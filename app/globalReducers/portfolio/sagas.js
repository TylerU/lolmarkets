
import { take, call, put, select, fork, cancel, race, cancelled } from 'redux-saga/effects';
import { takeEvery } from 'redux-saga';
import { push } from 'react-router-redux';

import {
  LOAD_USER_MARKETS,
  NAVIGATE_TO_STREAM,
} from './constants';
import { loadChannel } from 'globalReducers/channels/actions';

import { LOAD_CHANNEL_SUCCESS, LOAD_CHANNEL_ERROR } from 'globalReducers/channels/constants';
import {
  loadUserMarketsError,
  loadUserMarketsSuccess,
} from './actions';
import _ from 'lodash';
import { MarketUserService } from 'globalReducers/feathers-app';
import { wrapWatcherWaitOnAuth } from 'globalReducers/util';

const matchesAction = (obj) => (action) => _.matches(obj)(action);

export function* loadUserMarkets(action) {
  const markets = yield MarketUserService.find({ query: { $includeMarket: true, $sort: { id: -1 } } })
      .then((res) => ({ res: res.data }), (err) => ({ err }));

  if (!markets.err) {
    yield put(loadUserMarketsSuccess(markets.res));
  } else {
    yield put(loadUserMarketsError(markets.err));
  }
}

export function* loadUserMarketsWatcher() {
  yield* wrapWatcherWaitOnAuth(LOAD_USER_MARKETS, loadUserMarkets);
}

export function* navigateToStream(action) {
  const c = yield select((state) => state.getIn(['channels', action.id]));
  let channelName = '';

  if (c) {
    channelName = c.get('displayName');
  } else {
    yield put(loadChannel(action.id));
    const { channel, error } = yield race({
      channel: take(matchesAction({
        type: LOAD_CHANNEL_SUCCESS,
        channel: {
          id: action.id,
        },
      })),
      error: take(matchesAction({
        type: LOAD_CHANNEL_ERROR,
      })),
    });
    channelName = channel.displayName;
  }
  if (channelName) {
    yield put(push(`/stream/${channelName}`));
  }
}

export function* navStreamWatcher() {
  yield* takeEvery(NAVIGATE_TO_STREAM, navigateToStream);
}

// Bootstrap sagas
export default [
  loadUserMarketsWatcher,
  navStreamWatcher,
];
