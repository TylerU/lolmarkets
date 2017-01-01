import {
  // LOAD_USER_MARKETS,
  LOAD_USER_MARKETS_SUCCESS,
  // LOAD_USER_MARKETS_ERROR,
} from './constants';

import _ from 'lodash';

import { fromJS } from 'immutable';

// The initial state of the App
const initialState = fromJS({});

function appReducer(state = initialState, action) {
  switch (action.type) {
    case LOAD_USER_MARKETS_SUCCESS:
      return fromJS(action.markets);
    default:
      return state;
  }
}

export default appReducer;
