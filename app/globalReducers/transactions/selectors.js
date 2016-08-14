/**
 * The global state selectors
 */

import { createSelector } from 'reselect';


const selectCurrentUser = () =>
  (globalState) => globalState.get('user');

const selectAuthLoading = () => createSelector(
  selectCurrentUser(),
  (user) => user.get('loading')
);


export {
  selectAuthLoading,
};
