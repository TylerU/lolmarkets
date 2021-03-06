/**
 * Gets the repositories of the user from Github
 */

import { take, call, put, select, fork, } from 'redux-saga/effects';
import { takeEvery, delay } from 'redux-saga';
import { push } from 'react-router-redux';
import _ from 'lodash';
import { ATTEMPT_REAUTH, LOGOUT, LOGIN, REGISTER } from 'globalReducers/user/constants';
import { reauthSuccess, reauthError, attemptReauth, login, registerSuccess, } from 'globalReducers/user/actions';
import { app, UserService } from 'globalReducers/feathers-app';

// import request from 'utils/request';
// import { selectUsername } from 'containers/HomePage/selectors';
import {
  getFormValues,
  startSubmit,
  stopSubmit,
} from 'redux-form/immutable';

export function* attemptReauthActual() {
  const authPromise = app.authenticate({});
  app.set('reauthPromise', authPromise);
  const auth = yield authPromise
    .then((result) => ({ result }), (error) => ({ error }));
  if (!auth.error) {
    yield put(reauthSuccess(app.get('user')));
    const curPath = yield select((state) => state.getIn(['route', 'locationBeforeTransitions', 'pathname']));
    if (curPath === '/login' || curPath === '/register') {
      yield put(push('/'));
    }
  } else {
    yield put(reauthError(auth.error));
  }
}

export function* attemptAuthWatcher() {
  yield* takeEvery(ATTEMPT_REAUTH, attemptReauthActual);
}

export function* attemptAuth() {
  // Fork watcher so we can continue execution
  yield fork(attemptAuthWatcher);
  yield delay(1);
  yield put(attemptReauth());
}

export function* logout() {
  app.logout();
  yield put(push('/'));
}

export function* logoutWatcher() {
  yield* takeEvery(LOGOUT, logout);
}

function extractErrors(err) {
  const res = {};
  _.each(err, (e) => {
    res[e.path] = _.capitalize(e.message);
  });
  return res;
}

const formName = 'loginForm';

export function* loginWorker() {
  const formData = yield select(getFormValues(formName));
  yield put(startSubmit(formName));

  const auth = yield app.authenticate({
    type: 'local',
    email: formData.get('email'),
    password: formData.get('password'),
  })
    .then((result) => ({ result }), (error) => ({ error }));

  if (!auth.error) {
    yield put(stopSubmit(formName, {}));
    yield put(reauthSuccess(app.get('user')));
    let newPath = yield select((state) => state.getIn(['route', 'locationBeforeTransitions', 'query', 'next']));
    newPath = newPath || 'streams';
    yield put(push(`/${newPath}`));
  } else {
    const errorObj = auth.error;
    const errors = extractErrors(errorObj.errors);
    errors['_error'] = errorObj.message;
    yield put(stopSubmit(formName, errors));
  }
}

export function* loginWatcher() {
  yield* takeEvery(LOGIN, loginWorker);
}

// TODO - make more general, abstract out what's common here for fuck's sake
export function* register() {
  const formData = yield select(getFormValues(formName));
  yield put(startSubmit(formName));

  const auth = yield UserService.create({
    email: formData.get('email'),
    password: formData.get('password'),
    username: formData.get('username'),
  })
    .then((result) => ({ result }), (error) => ({ error }));

  if (!auth.error) {
    yield put(registerSuccess(auth.result));
    yield put(stopSubmit(formName, {}));
    yield put(login());
  } else {
    const errorObj = auth.error;
    const errors = extractErrors(errorObj.errors);
    errors['_error'] = errorObj.message;
    yield put(stopSubmit(formName, errors));
  }
}

export function* registerWatcher() {
  yield* takeEvery(REGISTER, register);
}

// Bootstrap sagas
export default [
  attemptAuth,
  logoutWatcher,
  loginWatcher,
  registerWatcher,
];
