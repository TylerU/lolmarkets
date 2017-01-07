import {
  LOAD_LEADERBOARD_SUCCESS,
  LOAD_LEADERBOARD,
  LOAD_LEADERBOARD_ERROR,
} from './constants';


export function loadLeaderboard(key, channel, username, skip, limit) {
  return {
    type: LOAD_LEADERBOARD,
    key,
    channel,
    username,
    skip,
    limit,
  };
}


export function loadGlobalLeaderboard(username, skip, limit) {
  return {
    type: LOAD_LEADERBOARD,
    key: `_global${username ? '|user' : ''}`,
    username,
    skip,
    limit,
  };
}

export function loadChannelLeaderboard(channel, username, skip, limit) {
  return {
    type: LOAD_LEADERBOARD,
    key: `${channel}${username ? '|user' : ''}`,
    channel,
    username,
    skip,
    limit,
  };
}


export function loadLeaderboardSuccess(key, result) {
  return {
    type: LOAD_LEADERBOARD_SUCCESS,
    result,
    key,
  };
}

export function loadLeaderboardError(key, error) {
  return {
    type: LOAD_LEADERBOARD_ERROR,
    error,
    key,
  };
}
