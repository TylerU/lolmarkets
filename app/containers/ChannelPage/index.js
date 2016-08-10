// import { push } from 'react-router-redux';
// import { Link } from 'react-router';
import _ from 'lodash';
import React from 'react';
import { connect } from 'react-redux';
import MarketItem from '../../containers/MarketItem';
import styles from './styles.css';

import { loadChannelMarketsAndSubscribe, unsubscribeChannelMarkets } from 'globalReducers/markets/actions';
import { selectLoggedIn } from 'globalReducers/user/selectors';

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
      <MarketItem key={market.id} market={market} loggedIn={this.props.loggedIn} />
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
    this.props.loadMarketsForChannelAndSubscribe(this.props.params.streamName, this.props.channel);
  }

  componentWillUnmount() {
    this.props.unsubscribeChannelMarkets(this.props.params.streamName);
  }

  render() {
    // console.log(this.props.markets);

    const stream = this.props.channel;
    const markets = _.values(this.props.markets);
    // console.log(this.props.markets, stream);

    return (
      <div>
        <h2>{stream ? stream.get('displayName') : ''}</h2>
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
            {markets.length > 0 ? (<MarketsList markets={markets} loggedIn={this.props.loggedIn} />) : (<h4>There are currently no open markets.</h4>)}

          </div>
        </div>
      </div>
    );
  }
}

StreamPage.propTypes = {
  markets: React.PropTypes.array,
  channel: React.PropTypes.object,
  loggedIn: React.PropTypes.bool,
};

function mapDispatchToProps(dispatch) {
  return {
    loadMarketsForChannelAndSubscribe: (channelName, channelObj) => dispatch(loadChannelMarketsAndSubscribe(channelName, channelObj)),
    unsubscribeChannelMarkets: (channelId) => dispatch(unsubscribeChannelMarkets(channelId)),
  };
}

function mapStateToProps(state, props) {
  const channelName = props.params.streamName;
  const loadedChannels = state.get('channels');
  let channel = null;
  if (loadedChannels) {
    channel = loadedChannels.find((value) => value.get('displayName') === channelName);
  }

  let markets = null;
  if (channel) {
    markets = state.get('markets').valueSeq().filter((val) =>
       val.get('channel') === channel.get('id') && val.get('active'));
    if (markets) {
      markets = markets.toJS();
    }
  }
  return {
    markets,
    channel,
    loggedIn: selectLoggedIn()(state),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(StreamPage);
