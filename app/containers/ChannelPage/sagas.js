
import { take, call, put, select, fork, cancel } from 'redux-saga/effects';
import { takeEvery } from 'redux-saga';

import { LOAD_CHANNEL_MARKETS } from './constants';
import { loadChannel } from 'containers/ChannelsPage/actions';
import { loadChannelMarketsError, loadChannelMarketsSuccess } from './actions';

// import request from 'utils/request';
// import { selectUsername } from 'containers/HomePage/selectors';
import { MarketService } from 'containers/App/feathers-app';

export function* loadChannelMarkets(action) {
  let markets;
  if (action.channelObj) {
    markets = yield MarketService.find({ query: { channel: action.channelObj.id, active: true } })
      .then((res) => ({ res }), (err) => ({ err }));
  } else {
    // Load the channel and put it in the store, then load our markets
  }

  if (!markets.err) {
    yield put(loadChannelMarketsSuccess(markets.res));
  } else {
    yield put(loadChannelMarketsError(markets.err));
  }
}

export function* loadChannelMarketsWatcher() {
  yield* takeEvery(LOAD_CHANNEL_MARKETS, loadChannelMarkets);
}

// Bootstrap sagas
export default [
  loadChannelMarketsWatcher,
];
