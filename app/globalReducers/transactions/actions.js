
import {
  TRANSACTION_AMOUNT_CHANGE,
  EXECUTE_HYPOTHETICAL_TRANSACTION,
  HYPOTHETICAL_TRANSACTION_ERROR,
  HYPOTHETICAL_TRANSACTION_SUCCESS,
  EXECUTE_TRANSACTION,
  EXECUTE_TRANSACTION_SUCCESS,
  EXECUTE_TRANSACTION_ERROR,
  LOAD_MARKET_TRANSACTIONS,
  LOAD_MARKET_TRANSACTIONS_SUCCESS,
} from './constants';

// Load the current user's transactions in the given market
export function loadMarketTransactions(marketId) {
  return {
    type: LOAD_MARKET_TRANSACTIONS,
    marketId,
  };
}

// Load the current user's transactions in the given market
export function loadMarketTransactionsSuccess(marketId, result) {
  return {
    type: LOAD_MARKET_TRANSACTIONS_SUCCESS,
    marketId,
    transactions: result,
  };
}

export function transactionAmountChange(market, entity, operation, amount) {
  return {
    type: TRANSACTION_AMOUNT_CHANGE,
    market,
    entity,
    operation,
    amount,
  };
}

export function executeHypotheticalTransaction(market, entity, operation) {
  return {
    type: EXECUTE_HYPOTHETICAL_TRANSACTION,
    market,
    entity,
    operation,
  };
}

export function hypotheticalTransactionSuccess(market, entity, operation, result) {
  return {
    type: HYPOTHETICAL_TRANSACTION_SUCCESS,
    market,
    entity,
    operation,
    result,
  };
}

export function hypotheticalTransactionError(market, entity, operation, error) {
  return {
    type: HYPOTHETICAL_TRANSACTION_ERROR,
    market,
    entity,
    operation,
    error,
  };
}

export function executeTransaction(market, entity, operation) {
  return {
    type: EXECUTE_TRANSACTION,
    market,
    entity,
    operation,
  };
}

export function executeTransactionSuccess(market, entity, operation, result) {
  return {
    type: EXECUTE_TRANSACTION_SUCCESS,
    market,
    entity,
    operation,
    result,
  };
}

export function executeTransactionError(market, entity, operation, error) {
  return {
    type: EXECUTE_TRANSACTION_ERROR,
    market,
    entity,
    operation,
    error,
  };
}
