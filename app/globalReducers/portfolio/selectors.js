import { createSelector } from 'reselect';

const selectPortfolio = () => (state) => state.get('portfolio').toJS();

export {
  selectPortfolio,
};
