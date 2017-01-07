import { push } from 'react-router-redux';
import { Tabs, Tab } from 'react-bootstrap';
import _ from 'lodash';
import React from 'react';
import { connect } from 'react-redux';
import MarketItem from '../../containers/MarketItem';
import styles from './styles.css';
import Leaderboard from 'components/Leaderboard';

import { loadChannelMarketsAndSubscribe, unsubscribeChannelMarkets } from 'globalReducers/markets/actions';
import { selectLoggedIn, selectUserObj } from 'globalReducers/user/selectors';
import { loadChannelLeaderboard } from 'globalReducers/leaderboards/actions';
import { selectChannelLeaderboard, selectChannelLeaderboardUser } from 'globalReducers/leaderboards/selectors';

import { transactionAmountChange } from 'globalReducers/transactions/actions';


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
  constructor(props) {
    super(props);
    this.state = {
      key: props.location.hash === '#leaderboard' ? 2 : 1,
    };
  }
  componentWillMount() {
    this.props.loadMarketsForChannelAndSubscribe(this.props.params.streamName, this.props.channel);
  }

  componentWillUnmount() {
    this.props.unsubscribeChannelMarkets(this.props.params.streamName);
  }

  handleSelect(key) {
    let path = `${this.props.location.pathname}#${key === 1 ? 'markets' : 'leaderboard'}`;
    if (path[0] !== '/') {
      path = `/${path}`;
    }

    this.props.navigate(path);
    this.setState({ key });
  }

  render() {
    const stream = this.props.channel;
    const markets = _.values(this.props.markets);
    // console.log(this.props.markets, stream);

    const allMarkets = (<div>
      <div className={styles.headerContainer}>

      </div>

      <div>
        {markets.length > 0 ?
          (<MarketsList
            markets={markets}
            loggedIn={this.props.loggedIn}
          />) : (<h4>There are currently no open markets.</h4>)}
      </div>
    </div>);

    const leaderboard = (<div>
      <div className={styles.headerContainer}>
      </div>
      {this.props.channel ?
        <Leaderboard
          loadAll={_.partial(this.props.loadLeaderboard, this.props.channel.get('id'))}
          leaderboard={this.props.leaderboard}
          loadUser={_.partial(this.props.loadLeaderboardUser, this.props.channel.get('id'), this.props.user ? this.props.user.get('username') : '')}
          loggedIn={this.props.loggedIn}
          userRanking={this.props.leaderboardUser}
        /> : null}
    </div>);
    return (
      <div>
        <h2>{stream ? stream.get('displayName') : ''}</h2>
        <div className={styles.embedContainer}>
          <div className={styles.embedItem}>
            {/* <EmbeddedTwitchPlayer stream={stream.name} /> */}
          </div>
        </div>
        <Tabs activeKey={this.state.key} onSelect={(key) => this.handleSelect(key)} className={`${styles.marketTabsContainer}`} id="market-or-leaderboard-tabs">
          <Tab eventKey={1} title="Markets">{allMarkets}</Tab>
          <Tab eventKey={2} title="Leaderboard">{leaderboard}</Tab>
        </Tabs>

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
    transactionAmountChange: (market, entity, operation, amount) => dispatch(transactionAmountChange(market, entity, operation, amount)),
    navigate: (path) => dispatch(push(path)),
    loadLeaderboard: (channelId, skip, limit) => dispatch(loadChannelLeaderboard(channelId, null, skip, limit)),
    loadLeaderboardUser: (channelId, username, skip, limit) => dispatch(loadChannelLeaderboard(channelId, username, skip, limit)),

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
    leaderboard: channel ? selectChannelLeaderboard(channel.get('id'))(state) : {},
    leaderboardUser: channel ? selectChannelLeaderboardUser(channel.get('id'))(state) : {},
    user: selectUserObj()(state),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(StreamPage);
