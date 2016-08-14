
import {
  TRANSACTION_AMOUNT_CHANGE,
  HYPOTHETICAL_TRANSACTION_RESULT,
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

export function hypotheticalTransactionResult(market, entity, operation, result) {
  return {
    type: HYPOTHETICAL_TRANSACTION_RESULT,
    market,
    entity,
    operation,
    result,
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