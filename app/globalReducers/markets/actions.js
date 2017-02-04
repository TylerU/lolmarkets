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
  LOAD_MARKET_SUCCESS,
  LOAD_CHANNEL_MARKETS,
  LOAD_CHANNEL_MARKETS_SUCCESS,
  LOAD_CHANNEL_MARKETS_ERROR,
  UNSUBSCRIBE_CHANNEL_MARKETS,
  SUBSCRIBE_CHANNEL_MARKETS,
} from './constants';


export function subscribeChannelMarkets(channelId, channelName) {
  return {
    type: SUBSCRIBE_CHANNEL_MARKETS,
    channelId,
    channelName,
  };
}

export function unsubscribeChannelMarkets(channelName) {
  return {
    type: UNSUBSCRIBE_CHANNEL_MARKETS,
    channelName,
  };
}

export function loadChannelMarketsAndSubscribe(channelName, channelObj) {
  return {
    type: LOAD_CHANNEL_MARKETS,
    channelName,
    channelObj,
    subscribe: true,
  };
}

export function loadChannelMarkets(channelName, channelObj) {
  return {
    type: LOAD_CHANNEL_MARKETS,
    channelName,
    channelObj,
  };
}

export function loadMarketSuccess(market) {
  return {
    type: LOAD_MARKET_SUCCESS,
    market,
  };
}

export function loadChannelMarketsSuccess(markets, channel) {
  return {
    type: LOAD_CHANNEL_MARKETS_SUCCESS,
    channel,
    markets,
  };
}

export function loadChannelMarketsError(error, channel) {
  return {
    type: LOAD_CHANNEL_MARKETS_ERROR,
    channel,
    error,
  };
}


