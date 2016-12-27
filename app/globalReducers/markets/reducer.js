/*
 * AppReducer
 *
 * The reducer takes care of our data. Using actions, we can change our
 * application state.
 * To add a new action, add it to the switch statement in the reducer function
 *
 * Example:
 * case YOUR_ACTION_CONSTANT:
 *   return state.set('yourStateVariable', true);
 */

import {
  LOAD_CHANNEL_MARKETS,
  LOAD_CHANNEL_MARKETS_SUCCESS,
  LOAD_CHANNEL_MARKETS_ERROR,
  LOAD_MARKET_SUCCESS,
} from './constants';

import _ from 'lodash';

import { fromJS } from 'immutable';

// The initial state of the App
const initialState = fromJS({});

function appReducer(state = initialState, action) {
  switch (action.type) {
    case LOAD_MARKET_SUCCESS:
      return state.merge(_.keyBy([action.market], 'id'));
    case LOAD_CHANNEL_MARKETS_SUCCESS:
      return state.filterNot((val) => val.get('channel') === action.channel).merge(_.keyBy(action.markets, 'id'));
    default:
      return state;
  }
}

export default appReducer;
