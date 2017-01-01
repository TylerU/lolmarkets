import {
  LOAD_USER_MARKETS,
  LOAD_USER_MARKETS_SUCCESS,
  LOAD_USER_MARKETS_ERROR,
  NAVIGATE_TO_STREAM,
} from './constants';

export function navigateToStreamById(id) {
  return {
    type: NAVIGATE_TO_STREAM,
    id,
  };
}

export function loadUserMarkets() {
  return {
    type: LOAD_USER_MARKETS,
  };
}

export function loadUserMarketsSuccess(markets) {
  return {
    type: LOAD_USER_MARKETS_SUCCESS,
    markets,
  };
}

export function loadUserMarketsError(error) {
  return {
    type: LOAD_USER_MARKETS_ERROR,
    error,
  };
}
