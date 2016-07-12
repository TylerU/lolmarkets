import React from 'react';
// import { connect } from 'react-redux';
// import { push } from 'react-router-redux';
import _ from 'lodash';
// import { Link } from 'react-router';
import MarketItem from '../../components/MarketItem';

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
    return (
      <div>
        <h2>Your Portfolio</h2>
        <h3>Active Market Investments</h3>
        {activeMarkets}
        <h3>Resolved Markets</h3>
      </div>
    );
  }
}

export default PortfolioPage;
