/**
 * Gets the repositories of the user from Github
 */

import { take, call, put, select, fork, cancel } from 'redux-saga/effects';
import { takeEvery } from 'redux-saga';

import { ATTEMPT_REAUTH, LOGOUT } from 'globalReducers/user/constants';
import { reauthSuccess, reauthError, attemptReauth } from 'globalReducers/user/actions';

// import request from 'utils/request';
// import { selectUsername } from 'containers/HomePage/selectors';
import { app } from 'globalReducers/feathers-app';

/**
 * Github repos request/response handler
 */
export function* attemptReauthActual() {
  const auth = yield app.authenticate({
    // Uncomment if expired
    type: 'local',
    email: 'tyler@gmail.com',
    password: 'test123',
  })
    .then((result) => ({ result }), (error) => ({ error }));

  if (!auth.error) {
    yield put(reauthSuccess(app.get('user')));
  } else {
    yield put(reauthError(auth.error));
  }
}

/**
 * Watches for LOAD_REPOS action and calls handler
 */
export function* attemptAuthWatcher() {
  while (yield take(ATTEMPT_REAUTH)) {
    yield call(attemptReauthActual);
  }
}

/**
 * Root saga manages watcher lifecycle
 */
export function* attemptAuth() {
  // Fork watcher so we can continue execution
  yield fork(attemptAuthWatcher);
  yield put(attemptReauth()); // TODO - if this is slow the whole app is broken
}

export function* logout() {
  app.logout();
}

export function* logoutWatcher() {
  yield* takeEvery(LOGOUT, logout);
}
// Bootstrap sagas
export default [
  attemptAuth,
  logoutWatcher,
];
