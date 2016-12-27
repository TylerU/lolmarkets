
import {
  TRANSACTION_AMOUNT_CHANGE,
  EXECUTE_HYPOTHETICAL_TRANSACTION,
  HYPOTHETICAL_TRANSACTION_ERROR,
  HYPOTHETICAL_TRANSACTION_SUCCESS,
  EXECUTE_TRANSACTION,
  EXECUTE_TRANSACTION_SUCCESS,
  EXECUTE_TRANSACTION_ERROR,
} from './constants';


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