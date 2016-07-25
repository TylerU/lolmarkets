// import { connect } from 'react-redux';
// import { push } from 'react-router-redux';
// import { Link } from 'react-router';
import React from 'react';
import _ from 'lodash';
import MarketItem from '../../containers/MarketItem';

import styles from './styles.css';

class PortfolioPage extends React.Component {
  render() {
    const markets = [
      {
        name: 'Hillary Clinton will be elected president Hillary Clinton will be elected president',
        currentPrice: 74.3,
        yesPrice: 74.3,
        noPrice: 25.7,
        yesOwned: Math.round(Math.random() * 30),
        noOwned: Math.round(Math.random() * 30),
        channel: 1,
      },
      {
        name: 'Republicans will win the house',
        currentPrice: 55.9,
        yesPrice: 55.9,
        noPrice: 44.1,
        yesOwned: Math.round(Math.random() * 30),
        noOwned: Math.round(Math.random() * 30),
        channel: 1,
      },
      {
        name: 'Republicans will the senate',
        currentPrice: 16.5,
        yesPrice: 16.5,
        noPrice: 83.5,
        yesOwned: Math.round(Math.random() * 30),
        noOwned: Math.round(Math.random() * 30),
        channel: 2,
      },
      {
        name: 'Voyboy will in this game',
        currentPrice: 16.5,
        yesPrice: 16.5,
        noPrice: 83.5,
        yesOwned: Math.round(Math.random() * 30),
        noOwned: Math.round(Math.random() * 30),
        channel: 2,
      },
      {
        name: 'The square root of five is sqrt(5)',
        currentPrice: 16.5,
        yesPrice: 16.5,
        noPrice: 83.5,
        yesOwned: Math.round(Math.random() * 30),
        noOwned: Math.round(Math.random() * 30),
        channel: 3,
      },
    ];

    const oldMarkets = [
      {
        name: 'The square root of five is sqrt(5)',
        marketClose: '7/2/2016',
        resultYes: Math.random() < 0.5,
        yesOwned: Math.round(Math.random() * 30),
        noOwned: Math.round(Math.random() * 30),
        preTrading: Math.round(Math.random() * 200 - 100),
      },
      {
        name: 'I know nothing about anything',
        marketClose: '7/10/2016',
        resultYes: Math.random() < 0.5,
        yesOwned: Math.round(Math.random() * 30),
        noOwned: Math.round(Math.random() * 30),
        preTrading: Math.round(Math.random() * 200 - 100),
      },
      {
        name: 'Imaqtpie will win this game or something',
        marketClose: '7/12/2016',
        resultYes: Math.random() < 0.5,
        yesOwned: Math.round(Math.random() * 30),
        noOwned: Math.round(Math.random() * 30),
        preTrading: Math.round(Math.random() * 200 - 100),
      },
    ];

    const groupedMarkets = _.groupBy(markets, 'channel');
    const activeMarkets = _.map(groupedMarkets, (curMarkets, channelId) => {
      const marketObjs = _.map(curMarkets, (market) => {
        return (<MarketItem key={market.name} market={market} />);
      });

      return (
        <div key={channelId}>
          <h4>{channelId}</h4>
          <div>
            {marketObjs}
          </div>
        </div>
      );
    });

    const closedMarkets = _.map(oldMarkets, (market) =>
       (<tr key={market.name}>
         <td data-title="Name">{market.name}</td>
         <td data-title="Date">{market.marketClose}</td>
         <td data-title="Pre-close Gains" className={market.preTrading > 0 ? 'success' : 'danger'}>{market.preTrading}</td>
         <td data-title="Yes Shares Owned" className={market.resultYes ? 'success' : 'danger'}>{market.yesOwned}</td>
         <td data-title="No Shares Owned" className={market.resultYes ? 'danger' : 'success'}>{market.noOwned}</td>
       </tr>)
    );

    return (
      <div>
        <h2>Your Portfolio</h2>
        <h3>Active Market Investments</h3>
        {activeMarkets}
        <h3>Resolved Markets</h3>
        <div className={`${styles.tableContainer} well`}>
          <table className="table table-responsive table-striped">
            <thead>
              <tr>
                <th>Name</th>
                <th>Date</th>
                <th>Pre-close Gains</th>
                <th>Yes Shares Owned</th>
                <th>No Shares Owned</th>
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

export default PortfolioPage;
