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

export const LOAD_ALL_CHANNELS = 'zilean/Channels/LOAD_ALL_CHANNELS';
export const LOAD_ALL_CHANNELS_SUCCESS = 'zilean/Channels/LOAD_ALL_CHANNELS_SUCCESS';
export const LOAD_ALL_CHANNELS_ERROR = 'zilean/Channels/LOAD_ALL_CHANNELS_ERROR';
export const LOAD_CHANNEL = 'zilean/Channels/LOAD_CHANNEL';
export const LOAD_CHANNEL_SUCCESS = 'zilean/Channels/LOAD_CHANNEL_SUCCESS';
export const LOAD_CHANNEL_ERROR = 'zilean/Channels/LOAD_CHANNEL_ERROR';
export const LOAD_CHANNEL_BY_NAME = 'zilean/Channels/LOAD_CHANNEL_BY_NAME';
