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

const selectHypotheticalTransaction = (market, entity, operation) =>
  (store) =>
    store.getIn(['transactions', `${market}`, entity, operation, 'hypothetical']);

const selectTransactionAmount = (market, entity, operation) =>
  (store) =>
    store.getIn(['transactions', `${market}`, entity, operation, 'amount']);

export {
  selectHypotheticalTransaction,
  selectTransactionAmount,
};
