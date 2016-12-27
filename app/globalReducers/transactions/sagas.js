import { take, call, put, select, fork, cancel } from 'redux-saga/effects';
import { takeEvery, takeLatest, delay } from 'redux-saga';

import { TRANSACTION_AMOUNT_CHANGE, EXECUTE_TRANSACTION, EXECUTE_HYPOTHETICAL_TRANSACTION } from './constants';
import { hypotheticalTransactionSuccess, hypotheticalTransactionError, executeTransactionError, executeTransactionSuccess } from './actions';
import { selectHypotheticalTransaction, selectTransactionAmount } from './selectors';

// import request from 'utils/request';
// import { selectUsername } from 'containers/HomePage/selectors';
import { app } from 'globalReducers/feathers-app';
const TransactionService = app.service('transactions');

function getTransaction(market, yesSharesDelta, noSharesDelta) {
  return TransactionService.create({
    market,
    yesSharesDelta,
    noSharesDelta,
    fake: false,
  })
    .then((result) => ({ result }), (error) => ({ error }));
}

function getHypotheticalTransaction(market, yesSharesDelta, noSharesDelta) {
  return TransactionService.create({
    market,
    yesSharesDelta,
    noSharesDelta,
    fake: true,
  })
    .then((result) => ({ result }), (error) => ({ error }));
}

export function* executeHypothetical(action) {
  let yes = 0;
  let no = 0;

  const quantity = yield select((store) => {
    return selectTransactionAmount(action.market, action.entity, action.operation)(store);
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
    yield put(hypotheticalTransactionSuccess(action.market, action.entity, action.operation, result));
  } else {
    yield put(hypotheticalTransactionError(action.market, action.entity, action.operation, error));
  }
}

export function* hypotheticalTransactionWatcher() {
  yield* takeLatest(EXECUTE_HYPOTHETICAL_TRANSACTION, executeHypothetical);
}

function* executeTransaction(action) {
  let yes = 0;
  let no = 0;

  const quantity = yield select((store) =>
    selectTransactionAmount(action.market, action.entity, action.operation)(store)
  );


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

  const { result, error } = yield call(getTransaction, action.market, yes, no);
  if (result) {
    yield put(executeTransactionSuccess(action.market, action.entity, action.operation, result));
  } else {
    console.log('Error executing transaction: ', error);
  }
}

export function* transactionWatcher() {
  yield* takeLatest(EXECUTE_TRANSACTION, executeTransaction);
}
// Bootstrap sagas
export default [
  hypotheticalTransactionWatcher,
  transactionWatcher,
];
