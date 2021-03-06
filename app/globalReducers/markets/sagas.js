
import { take, call, put, select, fork, cancel, race, cancelled } from 'redux-saga/effects';
import { takeEvery, eventChannel } from 'redux-saga';

import { USER_UPDATE } from 'globalReducers/user/constants';

import {
  LOAD_CHANNEL_MARKETS,
  SUBSCRIBE_CHANNEL_MARKETS,
  UNSUBSCRIBE_CHANNEL_MARKETS,
  MARKET_UPDATED,
} from './constants';

import { loadChannelByName } from 'globalReducers/channels/actions';
import { LOAD_CHANNEL_SUCCESS, LOAD_CHANNEL_ERROR } from 'globalReducers/channels/constants';
import {
  loadChannelMarketsError,
  loadChannelMarketsSuccess,
  loadMarketSuccess,
  subscribeChannelMarkets,
  loadChannelMarkets,
} from './actions';
import _ from 'lodash';

// import request from 'utils/request';
// import { selectUsername } from 'containers/HomePage/selectors';
import { MarketService, socket } from 'globalReducers/feathers-app';
import { wrapWatcherWaitOnAuth } from 'globalReducers/util';

const matchesAction = (obj) => (action) => _.matches(obj)(action);

export function channelMarketChangeEmitter(channelId) {
  return eventChannel(emitter => {
    socket.emit('watchChannelMarkets', [channelId]);

    const handleChange = (newMarket) => {
      emitter(newMarket);
    };

    MarketService.on('created', handleChange);
    MarketService.on('patched', handleChange);
    MarketService.on('updated', handleChange);

    return () => {
      socket.emit('watchChannelMarkets', []);
      MarketService.removeListener('created', handleChange);
      MarketService.removeListener('patched', handleChange);
      MarketService.removeListener('updated', handleChange);
    };
  });
}

export function* loadChannelMarketsWorker(action) {
  let channelId = null;
  if (action.channelObj) {
    channelId = action.channelObj.get('id');
  } else {
    yield put(loadChannelByName(action.channelName));
    const { channel, error } = yield race({
      channel: take(matchesAction({
        type: LOAD_CHANNEL_SUCCESS,
        channel: {
          displayName: action.channelName,
        },
      })),
      error: take(matchesAction({
        type: LOAD_CHANNEL_ERROR,
        error: {
          displayName: action.channelName,
        },
      })),
    });

    if (error) {
      yield put(loadChannelMarketsError(error.error));
      return;
    }
    channelId = channel.channel.id;
  }

  if (action.subscribe) {
    yield put(subscribeChannelMarkets(channelId, action.channelName));
  }

  const markets = yield MarketService.find({ query: { channel: channelId, active: true } })
      .then((res) => ({ res: res.data }), (err) => ({ err }));

  if (!markets.err) {
    yield put(loadChannelMarketsSuccess(markets.res, channelId));
  } else {
    yield put(loadChannelMarketsError(markets.err, channelId));
  }
}

export function* loadChannelMarketsWatcher() {
  yield* wrapWatcherWaitOnAuth(LOAD_CHANNEL_MARKETS, loadChannelMarketsWorker);
}

function* watchChannelMarketChanges(channelId) {
  const chan = yield call(channelMarketChangeEmitter, channelId);
  try {
    while (true) {
      const market = yield take(chan);
      yield put({
        type: MARKET_UPDATED,
        market,
      });
    }
  } finally {
    if (yield cancelled()) {
      chan.close();
    }
  }
}

function* startWatchingChannelMarkets(action) {
  const listenTask = yield fork(watchChannelMarketChanges, action.channelId);
  const unsubscribed = yield take(UNSUBSCRIBE_CHANNEL_MARKETS);
  if (action.channelName === unsubscribed.channelName) {
    yield cancel(listenTask);
  }
}

function* channelMarketsChanges() {
  yield* wrapWatcherWaitOnAuth(SUBSCRIBE_CHANNEL_MARKETS, startWatchingChannelMarkets);
}

function* fetchUpdatedMarket(action) {
  const markets = yield MarketService.get(action.market.id)
    .then((res) => ({ res }), (err) => ({ err }));

  if (!markets.err) {
    yield put(loadMarketSuccess(markets.res));
  } else {
    console.log('Error updating market', markets.err);
  }
}

function* fetchNewMarketOnChange() {
  yield* wrapWatcherWaitOnAuth(MARKET_UPDATED, fetchUpdatedMarket);
}

function* updateMarketsOnUserChange() {
  const markets = yield select((state) => state.get('markets').keySeq().toArray());
  for (let i = 0; i < markets.length; i++) {
    yield put({
      type: MARKET_UPDATED,
      market: {
        id: markets[i],
      },
    });
  }
}

function* userChangeWatcher() {
  yield* wrapWatcherWaitOnAuth(USER_UPDATE, updateMarketsOnUserChange);
}

// Bootstrap sagas
export default [
  loadChannelMarketsWatcher,
  channelMarketsChanges,
  fetchNewMarketOnChange,
  userChangeWatcher,
];
