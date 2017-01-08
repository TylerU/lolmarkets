/**
 * The global state selectors
 */


const selectHypotheticalTransaction = (market, entity, operation) =>
  (store) =>
    store.getIn(['transactions', `${market}`, entity, operation, 'hypothetical']);

const selectActualTransaction = (market, entity, operation) =>
  (store) =>
    store.getIn(['transactions', `${market}`, entity, operation, 'actual']);

const selectTransactionAmount = (market, entity, operation) =>
  (store) =>
    store.getIn(['transactions', `${market}`, entity, operation, 'amount']);

const selectMarketTransactions = (market) =>
  (store) =>
    store.getIn(['transactions', `${market}`, 'transactions']);

export {
  selectActualTransaction,
  selectHypotheticalTransaction,
  selectTransactionAmount,
  selectMarketTransactions,
};
