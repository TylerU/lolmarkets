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
  HYPOTHETICAL_TRANSACTION_RESULT,
  EXECUTE_TRANSACTION,
  EXECUTE_TRANSACTION_SUCCESS,
  EXECUTE_TRANSACTION_ERROR,
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
        hypothetical: {
          loading: true,
        },
      };
      return state
        .mergeDeep(fromJS(obj));
    case HYPOTHETICAL_TRANSACTION_RESULT:
      obj = getObj(action);
      obj[action.market][action.entity][action.operation] = {
        hypothetical: {
          loading: false,
          result: action.result,
        },
      };
      return state
        .mergeDeep(fromJS(obj));
    default:
      return state;
  }
}

export default appReducer;
