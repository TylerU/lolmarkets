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
  ATTEMPT_REAUTH,
  REAUTH_SUCCESS,
  USER_UPDATE,
  REAUTH_ERROR,
  LOGOUT,
} from './constants';

import { fromJS } from 'immutable';

// The initial state of the App
const initialState = fromJS({
  loading: false,
  loggedIn: false,
  userObj: null,
  error: null,
});

function appReducer(state = initialState, action) {
  switch (action.type) {
    case LOGOUT:
      return state
        .set('loggedIn', false)
        .set('userObj', null);
    case USER_UPDATE:
      return state
        .set('userObj', fromJS(action.user));
    case ATTEMPT_REAUTH:
      return state
        .set('loading', true)
        .set('error', null);
    case REAUTH_SUCCESS:
      return state
        .set('userObj', fromJS(action.user))
        .set('loading', false)
        .set('loggedIn', true);
    case REAUTH_ERROR:
      return state
        .set('error', action.error)
        .set('userObj', null)
        .set('loggedIn', false)
        .set('loading', false);
    default:
      return state;
  }
}

export default appReducer;
