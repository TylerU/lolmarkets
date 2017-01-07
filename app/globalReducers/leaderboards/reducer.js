import {
  LOAD_LEADERBOARD,
  LOAD_LEADERBOARD_SUCCESS,
} from './constants';

import _ from 'lodash';

import { fromJS } from 'immutable';

// The initial state of the App
const initialState = fromJS({});

function appReducer(state = initialState, action) {
  let obj;
  switch (action.type) {
    case LOAD_LEADERBOARD:
      obj = {};
      obj[action.key] = { loading: true };
      return state.merge(obj);
    case LOAD_LEADERBOARD_SUCCESS:
      obj = {};
      obj[action.key] = { loading: false, result: action.result };
      return state.merge(obj);
    default:
      return state;
  }
}

export default appReducer;
