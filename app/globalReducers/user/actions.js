/*
 * App Actions
 *
 * Actions change things in your application
 * Since this boilerplate uses a uni-directional data flow, specifically redux,
 * we have these actions which are the only way your application interacts with
 * your appliction state. This guarantees that your state is up to date and nobody
 * messes it up weirdly somewhere.
 *
 * To add a new Action:
 * 1) Import your constant
 * 2) Add a function like this:
 *    export function yourAction(var) {
 *        return { type: YOUR_ACTION_CONSTANT, var: var }
 *    }
 */

import {
  ATTEMPT_REAUTH,
  REAUTH_SUCCESS,
  REAUTH_ERROR,
  USER_UPDATE,
  LOGOUT,
  LOGIN,
  LOGIN_ERROR,
  LOGIN_SUCCESS,
  REGISTER,
  REGISTER_SUCCESS,
} from './constants';

export function login(user) {
  return {
    type: LOGIN,
  };
}

export function register(user) {
  return {
    type: REGISTER,
  };
}

export function registerSuccess(user) {
  return {
    type: REGISTER_SUCCESS,
    user,
  };
}

export function loginSuccess() {
  return {
    type: LOGIN_SUCCESS,
  };
}

export function loginError(err) {
  return {
    type: LOGIN_ERROR,
    error: err,
  };
}

export function userUpdate(user) {
  return {
    type: USER_UPDATE,
    user,
  };
}


export function attemptReauth() {
  return {
    type: ATTEMPT_REAUTH,
  };
}

/**
 * Dispatched when the repositories are loaded by the request saga
 *
 * @param  {array} repos The repository data
 * @param  {string} username The current username
 *
 * @return {object}      An action object with a type of LOAD_REPOS_SUCCESS passing the repos
 */
export function reauthSuccess(user) {
  return {
    type: REAUTH_SUCCESS,
    user,
  };
}

/**
 * Dispatched when loading the repositories fails
 *
 * @param  {object} error The error
 *
 * @return {object}       An action object with a type of LOAD_REPOS_ERROR passing the error
 */
export function reauthError(error) {
  return {
    type: REAUTH_ERROR,
    error,
  };
}

export function logout() {
  return {
    type: LOGOUT,
  };
}
