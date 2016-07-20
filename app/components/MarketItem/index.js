/**
*
* MarketItem
*
*/

import React from 'react';

import Collapse from 'react-collapse';
import Slider from 'react-rangeslider';
import { OverlayTrigger, Tooltip, Glyphicon } from 'react-bootstrap';
import MoneyIcon from '../../components/MoneyIcon';
import _ from 'lodash';

import styles from './styles.css';


class YesShareIcon extends React.Component {
  render() {
    const curStyle = _.defaults(this.props.style || {}, { color: '#00bc8c' });

    return (
      <Glyphicon className={styles.shareIcon} glyph="ok-sign" style={curStyle} />
    );
  }
}

class NoShareIcon extends React.Component {
  render() {
    const curStyle = _.defaults(this.props.style || {}, { color: '#e74c3c' });

    return (
      <Glyphicon className={styles.shareIcon} glyph="remove-sign" style={curStyle} />
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
            <InfoContainer label="Shares You Currently Own:" data={'12'} />
            <InfoContainer label="Shares You Will Own:" data={12 + this.props.value} />
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
        <label className="col-xs-9">
          {this.props.label}
        </label>

        <div className="col-xs-3">
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
          disabled={true}
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
            ({this.props.numOwned})
            <OverlayTrigger
              overlay={(<Tooltip id={`tooltip-${this.props.asset}`}>{this.props.helpText}</Tooltip>)} placement="top"
              delayShow={50} delayHide={150}
            >
              <span className={`${styles.helpIcon} glyphicon glyphicon-question-sign`}></span>
            </OverlayTrigger>
          </h4>
          <h4 className="pull-right">
            Current Price: <MoneyIcon size="24px"/>{this.props.market.yesPrice}
          </h4>
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
    const showOwned = this.props.market.yesOwned > 0 && this.props.market.noOwned > 0;
    const ownedUI = showOwned ? (
      <div className={`${styles.currentInvestment}`}>
        <YesShareIcon style={{ marginLeft: '1px', marginRight: '3px' }} />
        {this.props.market.yesOwned}
        <NoShareIcon style={{ marginLeft: '15px', marginRight: '3px' }} />
        {this.props.market.noOwned}
      </div>) : (null);

    return (
      <div>
        <div className={`${styles.collapseHeader} well`}>
          <div className={styles.openMarketContainer} onClick={() => this.toggle()}>
            <div className={styles.openMarketName}>
              <h5>{this.props.market.name}</h5>
            </div>
            <div className={styles.openMarketPriceContainer}>
              <span
                className={`${showOwned ? styles.chevronIcon : styles.chevronIconSmall} pull-right glyphicon
                    glyphicon-chevron-${(this.state.open ? 'up' : 'down')}`}
              >
              </span>
              <div className={`${styles.marketHeaderStats} pull-right`}>
                <span className={`${styles.openMarketPrice}`}>
                  {this.props.market.currentPrice} %
                </span>
                {ownedUI}
              </div>
            </div>
          </div>
          <Collapse isOpened={this.state.open}>
            <div className={`${styles.expandedMarketContent} row`}>
              <MarketActions
                market={this.props.market}
                asset="Yes"
                helpText={tooltipYes}
                numOwned={this.props.market.yesOwned}
                icon={<YesShareIcon />}
              />
              <MarketActions
                market={this.props.market}
                asset="No"
                helpText={tooltipNo}
                numOwned={Math.round(Math.random() * 30)}
                numOwned={this.props.market.noOwned}
                icon={<NoShareIcon />}
              />
            </div>
          </Collapse>
        </div>
      </div>
    );
  }
}


export default MarketItem;