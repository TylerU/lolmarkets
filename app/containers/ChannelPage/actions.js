/*
 * App Actions
 *
 * Actions change things in your application
 * Since this boilerplate uses a uni-directional data flow, specifically redux,
 * we have these actions which are the only way your application interacts with
 * your appliction state. This guarantees that your state is up to date and nobody
 * messes it up weirdly somewhere.
 *
 * To add a new Action:
 * 1) Import your constant
 * 2) Add a function like this:
 *    export function yourAction(var) {
 *        return { type: YOUR_ACTION_CONSTANT, var: var }
 *    }
 */

import {
  LOAD_CHANNEL_MARKETS,
  LOAD_CHANNEL_MARKETS_SUCCESS,
  LOAD_CHANNEL_MARKETS_ERROR,
} from './constants';


export function loadChannelMarkets(channelName, channelObj) {
  return {
    type: LOAD_CHANNEL_MARKETS,
    channelName,
    channelObj,
  };
}

export function loadChannelMarketsSuccess(markets) {
  return {
    type: LOAD_CHANNEL_MARKETS_SUCCESS,
    markets,
  };
}

export function loadChannelMarketsError(err) {
  return {
    type: LOAD_CHANNEL_MARKETS_ERROR,
    err,
  };
}


