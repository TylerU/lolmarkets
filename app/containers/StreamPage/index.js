import React from 'react';
import { connect } from 'react-redux';
// import { push } from 'react-router-redux';
import _ from 'lodash';
// import { Link } from 'react-router';
import Collapse from 'react-collapse';
import Slider from 'rc-slider';

import styles from './styles.css';

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

class MarketActions extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      expanded: null,
    };
  }

  toggleExpand(val) {
    this.setState({ expanded: val });
  }

  render() {
    const expanded = this.state.expanded;

    const inner = expanded == null ?
      (<div>
        <button
          className={`${styles.marketBtn} btn btn-success`}
          onClick={() => this.toggleExpand('buy')}
        >
          Buy Yes Shares
        </button>

        <button
          disabled={false}
          className={`${styles.marketBtn} btn btn-danger`}
          onClick={() => this.toggleExpand('sell')}
        >
          Sell Yes Shares
        </button>
      </div>) :
      (expanded === 'sell' ?
        (<div>
          <p>Selling</p>
          <button
            className={`${styles.marketBtn} btn btn-primary`}
            onClick={() => this.toggleExpand(null)}
          >
            Cancel
          </button>
        </div>) :
        (<div>
          <div>
            <p className={styles.marketInfoDesc}>Buying Yes Shares</p>
            <button
              className={`${styles.marketBtn} btn btn-primary`}
              onClick={() => this.toggleExpand(null)}
            >
              Cancel
            </button>
          </div>
          <div className={styles.buySellArea}>
            <input className="form-control" type="number" />
            <div>
              <Slider min={0} max={100} defaultValue={50} />
            </div>
          </div>
        </div>)
      );

    return (
      <div className={`col-md-6 ${styles.buyColumn}`}>
        <h4>Yes Shares: {this.props.market.yesPrice}</h4>
        {inner}
      </div>
    );
  }
}


class MarketItem extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      open: false,
    };
  }

  toggle() {
    this.setState({ open: !this.state.open });
  }

  render() {
    return (
      <div>
        <div className={`${styles.collapseHeader} well`}>
          <div className={styles.openMarketContainer} onClick={() => this.toggle()}>
            <div className={styles.openMarketName}>{this.props.market.name}</div>
            <div className={styles.openMarketPriceContainer}>
              <span
                className={`${styles.chevronIcon} pull-right glyphicon
                    glyphicon-chevron-${(this.state.open ? 'up' : 'down')}`}
              >
              </span>
              <span className={`${styles.openMarketPrice} pull-right`}>
                {this.props.market.currentPrice}
              </span>
            </div>
          </div>
          <Collapse isOpened={this.state.open}>
            <div className={`${styles.expandedMarketContent} row`}>
              <MarketActions market={this.props.market} />
              <MarketActions market={this.props.market} />
            </div>
          </Collapse>
        </div>
      </div>
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
  render() {
    const stream = {
      name: 'Voyboy',
      imageUrl: 'https://static-cdn.jtvnw.net/previews-ttv/live_user_scarra-320x180.jpg',
      betVolume: 50,
      markets: 2,
      title: 'Voyboy | im the best league player in my room',
    };

    const markets = [
      {
        name: 'Voyboy will win this game',
        currentPrice: 74.3,
        yesPrice: 74.3,
        noPrice: 25.7,
      },
      {
        name: 'Voyboy will end the game with K/D >= 1',
        currentPrice: 55.9,
        yesPrice: 55.9,
        noPrice: 44.1,
      },
      {
        name: 'Voyboy\'s team will will get first blood',
        currentPrice: 16.5,
        yesPrice: 16.5,
        noPrice: 83.5,
      },
    ];

    return (
      <div>
        <h3>{stream.name}</h3>
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
    // changeRoute: (url) => dispatch(push(url)),
  };
}

export default connect(null, mapDispatchToProps)(StreamPage);
