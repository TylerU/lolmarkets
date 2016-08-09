/**
 * The global state selectors
 */

import { createSelector } from 'reselect';

const selectGlobal = () => (state) => state.get('global');

const selectCurrentUser = () => createSelector(
  selectGlobal(),
  (globalState) => globalState.get('user')
);

const selectAuthLoading = () => createSelector(
  selectCurrentUser(),
  (user) => user.get('loading')
);

const selectAuthError = () => createSelector(
  selectCurrentUser(),
  (user) => user.get('error')
);

const selectLoggedIn = () => createSelector(
  selectCurrentUser(),
  (user) => user.get('loggedIn')
);

const selectUserObj = () => createSelector(
  selectCurrentUser(),
  (user) => user.get('userObj')
);

const selectLocationState = () => {
  let prevRoutingState;
  let prevRoutingStateJS;

  return (state) => {
    const routingState = state.get('route'); // or state.route

    if (!routingState.equals(prevRoutingState)) {
      prevRoutingState = routingState;
      prevRoutingStateJS = routingState.toJS();
    }

    return prevRoutingStateJS;
  };
};

export {
  selectGlobal,
  selectCurrentUser,
  selectAuthLoading,
  selectAuthError,
  selectLocationState,
  selectLoggedIn,
  selectUserObj,
};
