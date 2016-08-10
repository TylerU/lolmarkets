import { createSelector } from 'reselect';

const selectChannels = () => (state) => state.get('channels');

const selectChannelsJs = () => createSelector(
  selectChannels(),
  (channels) => channels.toJS()
);

export {
  selectChannels,
  selectChannelsJs,
};
