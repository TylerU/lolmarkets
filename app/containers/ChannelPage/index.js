// import { push } from 'react-router-redux';
// import { Link } from 'react-router';
import _ from 'lodash';
import React from 'react';
import { connect } from 'react-redux';
import MarketItem from '../../containers/MarketItem';
import styles from './styles.css';

import { loadChannelMarkets } from './actions';

class EmbeddedTwitchPlayer extends React.Component {
  render() {
    return (
      <iframe
        className={styles.frame}
        muted="true"
        autoPlay={0}
        frameBorder="0"
        src={`http://player.twitch.tv/?channel=${this.props.stream}&autoplay=false`}
        scrolling="no"
        allowFullScreen
      >
      </iframe>
    );
  }
}

class MarketsList extends React.Component {
  render() {
    const items = _.map(this.props.markets, (market) => (
      <MarketItem key={market.name} market={market} />
    ));

    return (
      <div>
        {items}
      </div>
    );
  }
}

export class StreamPage extends React.Component {
  componentWillMount() {
    console.log(this.props.channel);
    this.props.loadMarketsForChannel(this.props.params.streamName, this.props.channel);
  }

  render() {
    console.log(this.props.markets);

    const stream = {
      name: 'Politics',
      imageUrl: 'https://static-cdn.jtvnw.net/previews-ttv/live_user_scarra-320x180.jpg',
      betVolume: 50,
      markets: 2,
      title: 'Voyboy | im the best league player in my room',
    };

    const markets = [
      {
        name: 'Hillary Clinton will be elected president Hillary Clinton will be elected president',
        currentPrice: 74.3,
        yesPrice: 74.3,
        noPrice: 25.7,
        yesOwned: 0, // Math.round(Math.random() * 30),
        noOwned: 0, // Math.round(Math.random() * 30),
      },
      {
        name: 'Republicans will win the house',
        currentPrice: 55.9,
        yesPrice: 55.9,
        noPrice: 44.1,
        yesOwned: 0,
        noOwned: 0,
      },
      {
        name: 'Republicans will the senate',
        currentPrice: 16.5,
        yesPrice: 16.5,
        noPrice: 83.5,
        yesOwned: Math.round(Math.random() * 30),
        noOwned: Math.round(Math.random() * 30),
      },
    ];

    return (
      <div>
        <h2>{stream.name}</h2>
        <div className={styles.embedContainer}>
          <div className={styles.embedItem}>
            {/* <EmbeddedTwitchPlayer stream={stream.name} /> */}
          </div>
        </div>
        <div>
          <div className={styles.headerContainer}>
            <h3 className={styles.marketsHeader}>Open Markets</h3>
            <h3 className="pull-right">Price</h3>
          </div>
          <div>
            <MarketsList markets={markets} />
          </div>
        </div>
      </div>
    );
  }
}

StreamPage.propTypes = {
};

function mapDispatchToProps(dispatch) {
  return {
    loadMarketsForChannel: (channelName, channelObj) => dispatch(loadChannelMarkets(channelName, channelObj)),
  };
}

function mapStateToProps(state, props) {
  const channelName = props.params.streamName;
  const loadedChannels = state.get('channels');
  let channel = null;
  if (loadedChannels) {
    channel = loadedChannels.find((value) => value.get('displayName') === channelName);
    if (channel) {
      channel = channel.toJS();
    }
  }
  return {
    markets: state.get('markets').toJS(),
    channel,
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(StreamPage);