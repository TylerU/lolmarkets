import React from 'react';
import { connect } from 'react-redux';
// import { push } from 'react-router-redux';
import _ from 'lodash';
// import { Link } from 'react-router';
import Collapse from 'react-collapse';
import Slider from 'react-rangeslider';
import { OverlayTrigger, Tooltip, Glyphicon } from 'react-bootstrap';
import MoneyIcon from '../../components/MoneyIcon';

import styles from './styles.css';

class YesShareIcon extends React.Component {
  render() {
    return (
      <Glyphicon className={styles.shareIcon} glyph="ok-sign" style={{ color: '#00bc8c' }} />
    );
  }
}

class NoShareIcon extends React.Component {
  render() {
    return (
      <Glyphicon className={styles.shareIcon} glyph="remove-sign" style={{ color: '#e74c3c' }} />
    );
  }
}



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

class SliderInputButton extends React.Component {
  onChangePre(val) {
    this.props.onChange(parseInt(val.target.value, 10));
  }

  render() {
    return (
      <div>
        <div className={`row ${styles.buySellArea}`}>
          <div className="col-sm-8">
            <Slider
              min={0}
              max={100}
              step={1}
              value={this.props.value}
              onChange={(val) => this.props.onChange(val)}
            />
          </div>
          <div className={`${styles.numSharesContainer} col-sm-4`}>
            <input className="form-control" type="number" value={this.props.value} onChange={(val) => this.onChangePre(val)} />
          </div>
        </div>
        <div className="row">
          <div className="col-sm-8">
            <InfoContainer label="Transaction Cost:" data={123.4} />
            <InfoContainer label="Predicted New Market Price:" data={'94.3%'} />
          </div>
          <div className="col-sm-4">
            <button
              style={{ width: '100%' }}
              className={`btn btn-${this.props.buttonType} ${styles.buySellButton}`}
            >
              <div className={`${styles.buySellButtonChildren} ${styles.buySellLeftChild}`}>
                <MoneyIcon />
                {this.props.value * 10}
              </div>
              <div className={styles.buySellButtonChildren}>
                {this.props.buttonText}
              </div>
            </button>
            <button
              className={`${styles.marketBtnCancel} btn btn-primary`}
              onClick={() => this.props.cancel()}
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    );
  }
}

class InfoContainer extends React.Component {
  render() {
    return (
      <div className="row">
        <label className="col-sm-9">
          {this.props.label}
        </label>

        <div className="col-sm-3">
          <div className="">
            {this.props.data}
          </div>
        </div>
      </div>
    );
  }
}


class BuySellView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      x: 50,
    };
  }

  numChange(val) {
    this.setState({ x: val });
  }

  render() {
    return (
      <div>
        <SliderInputButton
          value={this.state.x}
          onChange={(val) => this.numChange(val)}
          buttonText={this.props.op}
          buttonType={this.props.op === 'Sell' ? 'success' : 'danger'}
          cancel={this.props.cancel}
        />
      </div>
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
    const primaryView =
      (<div>
        <button
          className={`${styles.marketBtn} btn btn-success`}
          onClick={() => this.toggleExpand('buy')}
        >
          Buy {this.props.asset} Shares
        </button>

        <button
          disabled={false}
          className={`${styles.marketBtn} btn btn-danger`}
          onClick={() => this.toggleExpand('sell')}
        >
          Sell {this.props.asset} Shares
        </button>
      </div>);

    const sellView =
      (<BuySellView op="Sell" asset={this.props.asset} cancel={() => this.toggleExpand(null)} />);

    const buyView =
      (<BuySellView op="Buy" asset={this.props.asset} cancel={() => this.toggleExpand(null)} />);

    return (
      <div className={`col-md-6 ${styles.marketCol}`}>
        <div className="clearfix">
          <h4 className="pull-left">
            {this.props.icon}
            {this.props.asset} Shares
          </h4>
          <h5 className="pull-right">
            Current Price: <MoneyIcon />{this.props.market.yesPrice}
            <OverlayTrigger
              overlay={(<Tooltip id={`tooltip-${this.props.asset}`}>{this.props.helpText}</Tooltip>)} placement="top"
              delayShow={50} delayHide={150}
            >
              <span className={`${styles.helpIcon} glyphicon glyphicon-question-sign`}></span>
            </OverlayTrigger>
          </h5>
        </div>
        <Collapse isOpened={this.state.expanded === null}>
          {primaryView}
        </Collapse>
        <Collapse isOpened={this.state.expanded === 'sell'}>
          {sellView}
        </Collapse>
        <Collapse isOpened={this.state.expanded === 'buy'}>
          {buyView}
        </Collapse>
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
    const tooltipYes = 'At the end of the game, if this prediction is true, all yes shares are redeemed for $1. If the prediction is false, they are worth nothing';
    const tooltipNo = 'At the end of the game, if this prediction is false, all no shares are redeemed for $1. If the prediction is true, they are worth nothing';
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
                {this.props.market.currentPrice} %
              </span>
            </div>
          </div>
          <Collapse isOpened={this.state.open}>
            <div className={`${styles.expandedMarketContent} row`}>
              <MarketActions
                market={this.props.market}
                asset="Yes"
                helpText={tooltipYes}
                icon={<YesShareIcon/>}
              />
              <MarketActions
                market={this.props.market}
                asset="No"
                helpText={tooltipNo}
                icon={<NoShareIcon/>}
              />
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
      name: 'Politics',
      imageUrl: 'https://static-cdn.jtvnw.net/previews-ttv/live_user_scarra-320x180.jpg',
      betVolume: 50,
      markets: 2,
      title: 'Voyboy | im the best league player in my room',
    };

    const markets = [
      {
        name: 'Hillary Clinton will be elected president',
        currentPrice: 74.3,
        yesPrice: 74.3,
        noPrice: 25.7,
      },
      {
        name: 'Republicans will win the house',
        currentPrice: 55.9,
        yesPrice: 55.9,
        noPrice: 44.1,
      },
      {
        name: 'Republicans will the senate',
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
