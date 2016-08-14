/**
 * Gets the repositories of the user from Github
 */

import { take, call, put, select, fork, cancel } from 'redux-saga/effects';
import { takeEvery, takeLatest, delay } from 'redux-saga';

import { TRANSACTION_AMOUNT_CHANGE } from './constants';
import { hypotheticalTransactionResult } from './actions';

// import request from 'utils/request';
// import { selectUsername } from 'containers/HomePage/selectors';
import { app } from 'globalReducers/feathers-app';
const TransactionService = app.service('transactions');

function getHypotheticalTransaction(market, yesSharesDelta, noSharesDelta) {
  return TransactionService.create({
    market,
    yesSharesDelta,
    noSharesDelta,
    fake: true,
  })
    .then((result) => ({ result }), (error) => ({ error }));
}

export function* amountChange(action) {
  yield call(delay, 700);
  let yes = 0;
  let no = 0;
  const quantity = yield select((store) => {
    return 100;
  });

  if (action.entity === 'YES') {
    if (action.operation === 'BUY') {
      yes = quantity;
    } else {
      yes = -quantity;
    }
  } else {
    if (action.operation === 'BUY') {
      no = quantity;
    } else {
      no = -quantity;
    }
  }

  const { result, error } = yield call(getHypotheticalTransaction, action.market, yes, no);
  if (result) {
    yield put(hypotheticalTransactionResult(action.market, action.entity, action.operation, result));
  }
}

export function* amountChangeWatcher() {
  yield* takeLatest(TRANSACTION_AMOUNT_CHANGE, amountChange);
}
// Bootstrap sagas
export default [
  amountChangeWatcher,
];
