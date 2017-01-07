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

export {
  selectGlobalLeaderboard,
  selectChannelLeaderboard,
};
