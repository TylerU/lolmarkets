/*
 * AppReducer
 *
 * The reducer takes care of our data. Using actions, we can change our
 * application state.
 * To add a new action, add it to the switch statement in the reducer function
 *
 * Example:
 * case YOUR_ACTION_CONSTANT:
 *   return state.set('yourStateVariable', true);
 */

import {
  TRANSACTION_AMOUNT_CHANGE,
  EXECUTE_HYPOTHETICAL_TRANSACTION,
  HYPOTHETICAL_TRANSACTION_SUCCESS,
  HYPOTHETICAL_TRANSACTION_ERROR,
  EXECUTE_TRANSACTION,
  EXECUTE_TRANSACTION_SUCCESS,
  EXECUTE_TRANSACTION_ERROR,
  LOAD_MARKET_TRANSACTIONS,
  LOAD_MARKET_TRANSACTIONS_SUCCESS,
} from './constants';

import { fromJS } from 'immutable';

// The initial state of the App
// Plan:
// Object organized as follows:
// transactions[MARKET][ENTITY][OPERATION] = { hypothetical: { loading: true, result: {} }, transaction: { loading: true, result: {} } }
const initialState = fromJS({});

function getObj(action) {
  const obj = {};
  obj[action.market] = {};
  obj[action.market][action.entity] = {};
  obj[action.market][action.entity][action.operation] = {};
  return obj;
}

function appReducer(state = initialState, action) {
  let obj = {};

  switch (action.type) {
    case TRANSACTION_AMOUNT_CHANGE:
      obj = getObj(action);
      obj[action.market][action.entity][action.operation] = {
        amount: action.amount,
      };
      return state
        .mergeDeep(fromJS(obj));
    case LOAD_MARKET_TRANSACTIONS:
      obj = {};
      obj[action.marketId] = {};
      obj[action.marketId].transactions = {
        loading: true,
        result: [],
      };
      return state
        .mergeDeep(fromJS(obj));
    case LOAD_MARKET_TRANSACTIONS_SUCCESS:
      obj = {};
      obj[action.marketId] = {};
      obj[action.marketId].transactions = {
        loading: false,
        result: action.transactions,
      };
      return state
        .mergeDeep(fromJS(obj));
    case EXECUTE_HYPOTHETICAL_TRANSACTION:
      obj = getObj(action);
      obj[action.market][action.entity][action.operation] = {
        hypothetical: {
          loading: true,
          result: null,
          error: null,
        },
        actual: {
          loading: false,
          result: null,
          error: null,
        },
      };
      return state
        .mergeDeep(fromJS(obj));
    case HYPOTHETICAL_TRANSACTION_SUCCESS:
      obj = getObj(action);
      obj[action.market][action.entity][action.operation] = {
        hypothetical: {
          loading: false,
          result: action.result,
        },
      };
      return state
        .mergeDeep(fromJS(obj));
    case HYPOTHETICAL_TRANSACTION_ERROR:
      obj = getObj(action);
      obj[action.market][action.entity][action.operation] = {
        hypothetical: {
          loading: false,
          error: action.error,
        },
      };
      return state
        .mergeDeep(fromJS(obj));
    case EXECUTE_TRANSACTION:
      obj = getObj(action);
      obj[action.market][action.entity][action.operation] = {
        actual: {
          loading: true,
          error: null,
          result: null,
        },
      };
      return state
        .mergeDeep(fromJS(obj));
    case EXECUTE_TRANSACTION_SUCCESS:
      obj = getObj(action);
      obj[action.market][action.entity][action.operation] = {
        actual: {
          loading: false,
          result: action.result,
        },
      };
      return state
        .mergeDeep(fromJS(obj));
    case EXECUTE_TRANSACTION_ERROR:
      obj = getObj(action);
      obj[action.market][action.entity][action.operation] = {
        actual: {
          loading: false,
          error: action.error,
        },
      };
      return state
        .mergeDeep(fromJS(obj));
    default:
      return state;
  }
}

export default appReducer;
