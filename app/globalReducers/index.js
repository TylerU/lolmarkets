import userSagas from 'globalReducers/user/sagas';
import marketsSagas from 'globalReducers/markets/sagas';
import channelsSagas from 'globalReducers/channels/sagas';
import user from 'globalReducers/user/reducer';
import markets from 'globalReducers/markets/reducer';
import channels from 'globalReducers/channels/reducer';

const globalSagas = [].concat(userSagas, marketsSagas, channelsSagas);
const globalReducers = {
  user,
  channels,
  markets,
};

export {
  globalReducers,
  globalSagas,
};
