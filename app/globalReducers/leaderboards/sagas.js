
import { take, call, put, select, fork, cancel, race, cancelled } from 'redux-saga/effects';
import { takeEvery } from 'redux-saga';
import { push } from 'react-router-redux';

import {
  LOAD_LEADERBOARD,
} from './constants';
import { loadChannel } from 'globalReducers/channels/actions';

import {
  loadLeaderboardSuccess,
  loadLeaderboardError,
} from './actions';

import _ from 'lodash';
import { LeaderboardService } from 'globalReducers/feathers-app';

export function* loadLeaderboard(action) {
  const { key, username, channel, limit, skip } = action;
  const leaderboard = yield LeaderboardService.find({ query: {
    username,
    channel,
    $limit: limit,
    $skip: skip,
  } })
      .then((res) => ({ res: res.data }), (err) => ({ err }));

  if (!leaderboard.err) {
    yield put(loadLeaderboardSuccess(key, leaderboard.res));
  } else {
    yield put(loadLeaderboardError(key, leaderboard.err));
  }
}

export function* loadLeaderboardWatcher() {
  yield* takeEvery(LOAD_LEADERBOARD, loadLeaderboard);
}


// Bootstrap sagas
export default [
  loadLeaderboardWatcher,
];
