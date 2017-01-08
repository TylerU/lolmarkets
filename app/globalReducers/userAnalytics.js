import { take, call, put, select, fork } from 'redux-saga/effects';
import { takeEvery } from 'redux-saga';

import { ATTEMPT_REAUTH, REAUTH_SUCCESS, REAUTH_ERROR, LOGOUT, LOGIN, REGISTER, LOGIN_SUCCESS, LOGIN_ERROR } from 'globalReducers/user/constants';
import { LOAD_CHANNEL_MARKETS } from 'globalReducers/markets/constants';
import { LOAD_ALL_CHANNELS, LOAD_CHANNEL, LOAD_CHANNEL_BY_NAME } from 'globalReducers/channels/constants';
import { SHOW_MARKET_TRANSACTIONS, LOAD_MARKET_TRANSACTIONS, EXECUTE_HYPOTHETICAL_TRANSACTION, HYPOTHETICAL_TRANSACTION_SUCCESS, HYPOTHETICAL_TRANSACTION_ERROR, EXECUTE_TRANSACTION, EXECUTE_TRANSACTION_SUCCESS, EXECUTE_TRANSACTION_ERROR } from 'globalReducers/transactions/constants';
import { LOAD_USER_MARKETS, NAVIGATE_TO_STREAM } from 'globalReducers/portfolio/constants';
import { LOAD_LEADERBOARD } from 'globalReducers/leaderboards/constants';

const routerChange = '@@router/LOCATION_CHANGE';

function* trackNormal(action) {
  if (!window.mixpanel) return;
  // console.log(action.type);
  window.mixpanel.track(action.type);
}

export function* trackUser() {
  yield* takeEvery([
    ATTEMPT_REAUTH,
    REAUTH_SUCCESS,
    REAUTH_ERROR,
    LOGOUT,
    LOGIN,
    REGISTER,
    LOGIN_SUCCESS,
    LOGIN_ERROR,
    EXECUTE_HYPOTHETICAL_TRANSACTION,
    HYPOTHETICAL_TRANSACTION_SUCCESS,
    HYPOTHETICAL_TRANSACTION_ERROR,
    EXECUTE_TRANSACTION,
    EXECUTE_TRANSACTION_SUCCESS,
    EXECUTE_TRANSACTION_ERROR,
    SHOW_MARKET_TRANSACTIONS,
    LOAD_USER_MARKETS,
    NAVIGATE_TO_STREAM,
  ], trackNormal);
}

function* trackRoute(action) {
  const eventName = `NAVIGATE${action.payload.pathname[0] === '/' ? '' : '/'}${action.payload.pathname}`;
  if (!window.mixpanel) return;
  // console.log(eventName);

  window.mixpanel.track(eventName, action.payload);
}

export function* trackRouteWatcher() {
  yield* takeEvery([
    routerChange,
  ], trackRoute);
}


function* trackSignin(action) {
  if (!window.mixpanel) return;
  // console.log('IDENTIFY');

  window.mixpanel.identify(`${action.user.id}`);
}

export function* trackSigninWatcher() {
  yield* takeEvery([
    REAUTH_SUCCESS,
  ], trackSignin);
}

export default [trackUser, trackRouteWatcher, trackSigninWatcher];
