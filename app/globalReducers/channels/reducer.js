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
  LOAD_ALL_CHANNELS_SUCCESS,
  LOAD_CHANNEL_SUCCESS,
} from './constants';

import _ from 'lodash';

import { fromJS } from 'immutable';

// The initial state of the App
const initialState = fromJS({});

function appReducer(state = initialState, action) {
  switch (action.type) {
    case LOAD_ALL_CHANNELS_SUCCESS:
      return fromJS(_.keyBy(action.channels, 'id'));
    case LOAD_CHANNEL_SUCCESS:
      return state
        .set(action.channel.id, fromJS(action.channel));
    default:
      return state;
  }
}

export default appReducer;
