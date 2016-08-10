/*
 * AppConstants
 * Each action has a corresponding type, which the reducer knows and picks up on.
 * To avoid weird typos between the reducer and the actions, we save them as
 * constants here. We prefix them with 'yourproject/YourComponent' so we avoid
 * reducers accidentally picking up actions they shouldn't.
 *
 * Follow this format:
 * export const YOUR_ACTION_CONSTANT = 'yourproject/YourContainer/YOUR_ACTION_CONSTANT';
 */

export const LOAD_CHANNEL_MARKETS = 'zilean/Markets/LOAD_CHANNEL_MARKETS';
export const LOAD_CHANNEL_MARKETS_SUCCESS = 'zilean/Markets/LOAD_CHANNEL_MARKETS_SUCCESS';
export const LOAD_CHANNEL_MARKETS_ERROR = 'zilean/Markets/LOAD_CHANNEL_MARKETS_ERROR';
export const LOAD_MARKET_SUCCESS = 'zilean/Markets/LOAD_MARKET_SUCCESS';
export const SUBSCRIBE_CHANNEL_MARKETS = 'zilean/Markets/SUBSCRIBE_CHANNEL_MARKETS';
export const UNSUBSCRIBE_CHANNEL_MARKETS = 'zilean/Markets/UNSUBSCRIBE_CHANNEL_MARKETS';
export const MARKET_UPDATED = 'zilean/Markets/MARKET_UPDATED';
