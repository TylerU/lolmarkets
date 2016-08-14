import userSagas from 'globalReducers/user/sagas';
import marketsSagas from 'globalReducers/markets/sagas';
import channelsSagas from 'globalReducers/channels/sagas';
import transactionsSagas from 'globalReducers/transactions/sagas';

import user from 'globalReducers/user/reducer';
import markets from 'globalReducers/markets/reducer';
import channels from 'globalReducers/channels/reducer';
import transactions from 'globalReducers/transactions/reducer';


const globalSagas = [].concat(userSagas, marketsSagas, channelsSagas, transactionsSagas);
const globalReducers = {
  user,
  channels,
  markets,
  transactions,
};

export {
  globalReducers,
  globalSagas,
};
