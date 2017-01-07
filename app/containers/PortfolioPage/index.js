// import { connect } from 'react-redux';
// import { push } from 'react-router-redux';
// import { Link } from 'react-router';
import React from 'react';
import _ from 'lodash';
import MarketItem from '../../containers/MarketItem';
import { loadUserMarkets, navigateToStreamById } from 'globalReducers/portfolio/actions';
import { selectPortfolio } from 'globalReducers/portfolio/selectors';
import { connect } from 'react-redux';
import { selectLoggedIn } from 'globalReducers/user/selectors';
import numeral from 'numeral';
import MoneyIcon from '../../components/MoneyIcon';
import styles from './styles.css';
import moment from 'moment';

function formatPrice(x) {
  return numeral(x).format('0.00');
}

class PortfolioPage extends React.Component {
  componentWillMount() {
    // The poor man's live update
    const interval = 60000;
    const refresh = () => {
      this.props.loadUserMarkets();
      this.to = setTimeout(refresh, interval);
    };
    this.to = setTimeout(refresh, 0);
  }

  componentWillUnmount() {
    clearTimeout(this.to);
  }

  navigate(id) {
    this.props.navigateToStreamById(id);
  }

  render() {
    const marketsPre = _.map(this.props.markets, (market) => {
      const marketObj = _.clone(market.marketObj);
      const marketUser = _.omit(market, 'marketObj');
      marketObj.marketUser = marketUser;
      return marketObj;
    });
    const markets = _.filter(marketsPre, (market) => market.active);
    const oldMarkets = _.filter(marketsPre, { active: false });

    // const groupedMarkets = _.groupBy(markets, 'channel');
    const activeMarkets = _.map(markets, (market) => {
      return (<MarketItem key={market.id} market={market} handleExpand={() => this.navigate(market.channel)} />);
    });

    // const activeMarkets = _.map(groupedMarkets, (curMarkets, channelId) => {
    //   const marketObjs = _.map(curMarkets, (market) => {
    //     return (<MarketItem key={market.name} market={market} />);
    //   });
    //
    //   return (
    //     <div key={channelId}>
    //       <h4>{channelId}</h4>
    //       <div>
    //         {marketObjs}
    //       </div>
    //     </div>
    //   );
    // });

    const closedMarkets = _.map(oldMarkets, (market) => {
      const preTrading = market.marketUser.outMoney - market.marketUser.inMoney;
      const profit = market.marketUser.outMoneyFinal - market.marketUser.inMoneyFinal;

      return (
        <tr key={market.id}>
          <td
            data-title="Name"
          >{market.name}</td>
          <td
            data-title="Date"
          >{moment(market.timeClosed).format('L')}</td>
          <td
            data-title="Pre-close Gains"
            className={preTrading > 0 ? 'success' : 'danger'}
          ><MoneyIcon />{formatPrice(preTrading)}</td>
          <td
            data-title="Yes Shares Owned"
            className={market.result ? 'success' : 'danger'}
          >{market.marketUser.yesShares}</td>
          <td
            data-title="No Shares Owned"
            className={market.result ? 'danger' : 'success'}
          >{market.marketUser.noShares}</td>
          <td
            data-title="Market Result"
            className={market.result ? 'success' : 'danger'}
          ><strong>{market.result ? 'YES' : 'NO'}</strong></td>
          <td
            data-title="Net Profit"
            className={profit > 0 ? 'success' : 'danger'}
          ><MoneyIcon />{formatPrice(profit)}</td>
        </tr>);
    });

    return (
      <div>
        <h2>Your Portfolio</h2>
        <h3>Active Markets</h3>
        {activeMarkets}
        <h3>Resolved Markets</h3>
        <div className={`${styles.tableContainer} well`}>
          <table className="table table-responsive table-striped">
            <thead>
              <tr>
                <th>Name</th>
                <th>Date</th>
                <th>Pre-close Net Profit</th>
                <th>Yes Shares Owned</th>
                <th>No Shares Owned</th>
                <th>Market Result</th>
                <th>Net Profit</th>
              </tr>
            </thead>
            <tbody>
            {closedMarkets}
            </tbody>
          </table>
        </div>
      </div>
    );
  }
}

function mapDispatchToProps(dispatch) {
  return {
    loadUserMarkets: () => dispatch(loadUserMarkets()),
    navigateToStreamById: (id) => dispatch(navigateToStreamById(id)),
  };
}

function mapStateToProps(state, props) {
  return {
    markets: selectPortfolio()(state),
    loggedIn: selectLoggedIn()(state),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(PortfolioPage);
