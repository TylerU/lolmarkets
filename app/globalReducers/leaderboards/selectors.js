import { createSelector } from 'reselect';

const selectGlobalLeaderboard = () => (state) => {
  const r = state.get('leaderboards').get('_global');
  if (r) return r.toJS();
  return {};
};

const selectChannelLeaderboard = (channelId) => (state) => {
  const r = state.get('leaderboards').get(`${channelId}`);
  if (r) return r.toJS();
  return {};
};

const selectGlobalLeaderboardUser = () => (state) => {
  const r = state.getIn(['leaderboards', '_global|user', 'result']);
  if (r) return r.toJS()[0];
  return null;
};

const selectChannelLeaderboardUser = (channelId) => (state) => {
  const r = state.getIn(['leaderboards', `${channelId}|user`, 'result']);
  if (r) return r.toJS()[0];
  return null
};
export {
  selectGlobalLeaderboard,
  selectChannelLeaderboard,
  selectGlobalLeaderboardUser,
  selectChannelLeaderboardUser,
};
