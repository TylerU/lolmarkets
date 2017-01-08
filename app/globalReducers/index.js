import userSagas from 'globalReducers/user/sagas';
import marketsSagas from 'globalReducers/markets/sagas';
import channelsSagas from 'globalReducers/channels/sagas';
import transactionsSagas from 'globalReducers/transactions/sagas';
import portfolioSagas from 'globalReducers/portfolio/sagas';
import leaderboardSagas from 'globalReducers/leaderboards/sagas';
import userAnalytics from 'globalReducers/userAnalytics';

import user from 'globalReducers/user/reducer';
import markets from 'globalReducers/markets/reducer';
import channels from 'globalReducers/channels/reducer';
import transactions from 'globalReducers/transactions/reducer';
import portfolio from 'globalReducers/portfolio/reducer';
import leaderboards from 'globalReducers/leaderboards/reducer';

const globalSagas = [].concat(userSagas, marketsSagas, channelsSagas,
  transactionsSagas, portfolioSagas, leaderboardSagas, userAnalytics);

const globalReducers = {
  user,
  channels,
  markets,
  transactions,
  portfolio,
  leaderboards,
};

export {
  globalReducers,
  globalSagas,
};
