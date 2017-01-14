/*
 * AppConstants
 * Each action has a corresponding type, which the reducer knows and picks up on.
 * To avoid weird typos between the reducer and the actions, we save them as
 * constants here. We prefix them with 'yourproject/YourComponent' so we avoid
 * reducers accidentally picking up actions they shouldn't.
 *
 * Follow this format:
 * export const YOUR_ACTION_CONSTANT = 'yourproject/YourContainer/YOUR_ACTION_CONSTANT';
 */

export const ATTEMPT_REAUTH = 'zilean/App/ATTEMPT_REAUTH';
export const REAUTH_SUCCESS = 'zilean/App/REAUTH_SUCCESS';
export const REAUTH_ERROR = 'zilean/App/REAUTH_ERROR';
export const USER_UPDATE = 'zilean/App/USER_UPDATE';
export const LOGOUT = 'zilean/App/LOGOUT';
export const LOGIN = 'zilean/App/LOGIN';
export const REGISTER = 'zilean/App/REGISTER';
export const REGISTER_SUCCESS = 'zilean/App/REGISTER_SUCCESS';
export const LOGIN_SUCCESS = 'zilean/App/LOGIN_SUCCESS';
export const LOGIN_ERROR = 'zilean/App/LOGIN_ERROR';
