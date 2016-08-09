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
  user: fromJS({
    loading: false,
    loggedIn: false,
    userObj: null,
    error: null,
  }),
});

function appReducer(state = initialState, action) {
  switch (action.type) {
    case LOGOUT:
      return state
        .setIn(['user', 'loggedIn'], false)
        .setIn(['user', 'userObj'], null);
    case USER_UPDATE:
      return state
        .setIn(['user', 'userObj'], fromJS(action.user));
    case ATTEMPT_REAUTH:
      return state
        .setIn(['user', 'loading'], true)
        .setIn(['user', 'error'], null);
    case REAUTH_SUCCESS:
      return state
        .setIn(['user', 'userObj'], fromJS(action.user))
        .setIn(['user', 'loading'], false)
        .setIn(['user', 'loggedIn'], true);
    case REAUTH_ERROR:
      return state
        .setIn(['user', 'error'], action.error)
        .setIn(['user', 'userObj'], null)
        .setIn(['user', 'loggedIn'], false)
        .setIn(['user', 'loading'], false);
    default:
      return state;
  }
}

export default appReducer;
