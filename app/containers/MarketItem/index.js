import React from 'react';
import Collapse from 'react-collapse';
import Slider from 'react-rangeslider';
import { OverlayTrigger, Tooltip, Glyphicon, Popover } from 'react-bootstrap';
import MoneyIcon from '../../components/MoneyIcon';
import _ from 'lodash';
import numeral from 'numeral';
import styles from './styles.css';
import { connect } from 'react-redux';
import { Link } from 'react-router';


import { transactionAmountChange, executeTransaction, executeHypotheticalTransaction } from 'globalReducers/transactions/actions';
import { selectHypotheticalTransaction, selectTransactionAmount, selectActualTransaction } from 'globalReducers/transactions/selectors';

function formatNumber(x) {
  return numeral(x).format('0.00');
}

function formatPrice(x) {
  return numeral(x).format('0.00');
}

function formatPercent(x) {
  return numeral(x).format('0.0 %');
}

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
  constructor(props) {
    super(props);
    this.state = {
      stage: 0,
    };
  }

  onChangePre(val) {
    this.props.onChange(parseInt(val.target.value, 10));
  }

  setStage(val) {
    this.setState({ stage: val });
  }

  buySellClick() {
    if (this.state.stage === 0) {
      this.props.executeHypotheticalTransaction();
      this.setStage(1);
    } else if (this.state.stage === 1) {
      this.props.executeTransaction();
      this.setStage(2);
    }
  }

  render() {
    const hypoResult = _.get(this.props, ['hypotheticalResult', 'result']);
    const hypoError = _.get(this.props, ['hypotheticalResult', 'error']);
    const isLoadingHypoResult = _.get(this.props, ['hypotheticalResult', 'loading']);
    const totalCost = formatPrice(Math.abs(_.get(hypoResult, ['totalPrice'], 0.0)));
    const newPercent = formatPercent(_.get(hypoResult, ['newPercent'], 0.0));

    const actualResult = _.get(this.props, ['actualResult', 'result']);
    const actualError = _.get(this.props, ['actualResult', 'error']);
    const isLoadingActualResult = _.get(this.props, ['actualResult', 'loading']);

    const stageZeroView = (
      <div>
        <div className="col-sm-8">
          <Slider
            min={1}
            max={this.props.max}
            step={1}
            value={this.props.value}
            onChange={(val) => this.props.onChange(val)}
          />
        </div>
        <div className={`${styles.numSharesContainer} col-sm-4`}>
          <input className="form-control" type="number" value={this.props.value} onChange={(val) => this.onChangePre(val)} />
        </div>
      </div>
    );

    const stageOneLoadingView = (<div style={{ marginBottom: '10px' }} className="col-sm-12">Loading...</div>);
    const stageOneLoadedView = (<div style={{ marginBottom: '10px' }} className="col-sm-12">
      {!hypoError ?
        (<div><div>Please Confirm:</div><div>{this.props.buttonText} <span className={`${styles.transactionHighlight}`}>{this.props.value}</span> share{this.props.value == 1 ? '' : 's'} for a total of <MoneyIcon /><span className={`${styles.transactionHighlight}`}>{totalCost}</span>, moving the market belief to ~{newPercent}?</div></div>) :
        (<div>Error: {hypoError.message}. Please try again.</div>)
      }
    </div>);

    const stageTwoLoadedView = (<div style={{ marginBottom: '10px' }} className="col-sm-12">
      {!actualError ?
        (<div>Transaction Completed Successfully</div>) :
        (<div>Error: {actualError.message}. Please try again.</div>)
      }
    </div>);

    const normalButtons = (<div className="row">
      <div className="col-sm-6">
        <button
          onClick={() => this.buySellClick()}
          style={{ width: '100%' }}
          disabled={this.props.value === 0 || this.state.stage === 1 && isLoadingHypoResult || this.state.stage === 1 && !!hypoError}
          className={`btn btn-${this.props.buttonType} ${styles.marketBtnGo}`}
        >
          {this.stage === 0 ? 'Preview and' : ''}{this.props.buttonText}
        </button>
      </div>
      <div className="col-sm-6">
        <button
          className={`${styles.marketBtnCancel} btn btn-primary`}
          onClick={() => this.props.cancel()}
        >
          Cancel
        </button>
      </div>
    </div>);

    const finalButtons = (
      <div className="row">
        <div className="col-sm-12">
          <button
            className={`${styles.marketBtnCancel} btn btn-primary`}
            onClick={() => this.props.cancel()}
          >
            Okay
          </button>
        </div>
      </div>);
    return (
      <div>
        <div className={`row ${styles.buySellArea}`}>
          {this.state.stage === 0 ? stageZeroView :
            (this.state.stage === 1 && isLoadingHypoResult ? stageOneLoadingView :
              (this.state.stage === 1 && !isLoadingHypoResult ? stageOneLoadedView :
                (this.state.stage === 2 && isLoadingActualResult ? stageOneLoadingView : stageTwoLoadedView)))}
        </div>
        {this.state.stage !== 2 ? normalButtons : finalButtons}
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
      x: Math.floor(this.props.max / 2),
    };
    if (this.state.x > 0) {
      this.props.onChange(this.state.x);
    }
  }

  numChange(val) {
    this.setState({ x: val });
    this.props.onChange(val);
  }

  render() {
    return (
      <div>
        <SliderInputButton
          hypotheticalResult={this.props.hypothetical}
          actualResult={this.props.actual}
          value={this.state.x}
          max={this.props.max}
          onChange={(val) => this.numChange(val)}
          buttonText={this.props.op}
          buttonType={this.props.op === 'Sell' ? 'success' : 'danger'}
          cancel={this.props.cancel}
          executeTransaction={this.props.executeTransaction}
          executeHypotheticalTransaction={this.props.executeHypotheticalTransaction}
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
    if (this.props.loggedIn) {
      this.setState({ expanded: val });
    }
  }

  render() {
    let loginPrompt = (<Popover id="login-prompt" className={`${styles.popoverInWell}`} title="">
      Please <Link to={`/login?next=${this.props.path}`}>Log In</Link> or <Link to={`/register?next=${this.props.path}`}>Register</Link> to buy / sell shares.
    </Popover>);

    let buyBtn = (<button
      style={{ width: '100%' }}
      className={`${styles.marketBtn} btn btn-success`}
      onClick={() => this.toggleExpand('buy')}
    >
      Buy {this.props.asset} Shares
    </button>);

    let sellBtn = (<button
      style={{ width: '100%' }}
      disabled={false}
      className={`${styles.marketBtn} btn btn-danger`}
      onClick={() => this.toggleExpand('sell')}
    >
      Sell {this.props.asset} Shares
    </button>);

    const primaryView =
      (<div>
        <div className="col-md-6">
          {this.props.loggedIn ? buyBtn :
            <OverlayTrigger trigger="click" rootClose placement="top" overlay={loginPrompt}>
              {buyBtn}
            </OverlayTrigger>
          }
        </div>
        <div className="col-md-6">
          {this.props.loggedIn ? sellBtn :
            <OverlayTrigger trigger="click" rootClose placement="top" overlay={loginPrompt}>
              {sellBtn}
            </OverlayTrigger>}
        </div>
      </div>);

    const sellView =
      (<BuySellView
        op="Sell"
        hypothetical={this.props.sellHypo}
        actual={this.props.sellActual}
        asset={this.props.asset}
        max={this.props.numOwned}
        cancel={() => this.toggleExpand(null)}
        onChange={_.partial(this.props.onChange, 'SELL')}
        executeTransaction={_.partial(this.props.executeTransaction, 'SELL')}
        executeHypotheticalTransaction={_.partial(this.props.executeHypotheticalTransaction, 'SELL')}
      />);

    const buyView =
      (<BuySellView
        op="Buy"
        hypothetical={this.props.buyHypo}
        actual={this.props.buyActual}
        asset={this.props.asset}
        max={this.props.max}
        cancel={() => this.toggleExpand(null)}
        onChange={_.partial(this.props.onChange, 'BUY')}
        executeTransaction={_.partial(this.props.executeTransaction, 'BUY')}
        executeHypotheticalTransaction={_.partial(this.props.executeHypotheticalTransaction, 'BUY')}
      />);

    return (
      <div className={`col-md-6 ${styles.marketCol}`}>
        <div className="clearfix">
          <h4 className="pull-left">

            {this.props.icon}
            {this.props.asset} Shares
            ({this.props.numOwned || 0})
            <OverlayTrigger
              overlay={(<Tooltip id={`tooltip-${this.props.asset}`}>{this.props.helpText}</Tooltip>)} placement="top"
              delayShow={50} delayHide={150}
            >
              <a href="#" tabIndex="30"><span className={`${styles.helpIcon} glyphicon glyphicon-question-sign`}></span></a>
            </OverlayTrigger>
          </h4>
          <h4 className="pull-right">
            Current Price: <MoneyIcon size="24px" />{formatPrice(this.props.price)}
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
    const showOwned = this.props.market.marketUser && (this.props.market.marketUser.yesShares > 0 || this.props.market.marketUser.noShares > 0);
    const ownedUI = showOwned ? (
      <div className={`${styles.currentInvestment}`}>
        <YesShareIcon style={{ marginLeft: '1px', marginRight: '3px' }} />
        {this.props.market.marketUser.yesShares}
        <NoShareIcon style={{ marginLeft: '15px', marginRight: '3px' }} />
        {this.props.market.marketUser.noShares}
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
                  {formatPercent(this.props.market.percent)}
                </span>
                {ownedUI}
              </div>
            </div>
          </div>
          <Collapse isOpened={this.state.open}>
            <div className={`${styles.expandedMarketContent} row`}>
              <MarketActions
                loggedIn={this.props.loggedIn}
                market={this.props.market}
                asset="Yes"
                sellHypo={this.props.yesSellHypo}
                buyHypo={this.props.yesBuyHypo}
                sellActual={this.props.yesSellActual}
                buyActual={this.props.yesBuyActual}
                price={this.props.market.yesPrice}
                max={this.props.market.marketUser.maxYes}
                helpText={tooltipYes}
                path={this.props.path}
                numOwned={_.get(this.props, 'market.marketUser.yesShares', 0)}
                onChange={_.partial(this.props.transactionAmountChange, this.props.market.id, 'YES')}
                executeTransaction={_.partial(this.props.executeTransaction, this.props.market.id, 'YES')}
                executeHypotheticalTransaction={_.partial(this.props.executeHypotheticalTransaction, this.props.market.id, 'YES')}
                icon={<YesShareIcon />}
              />
              <MarketActions
                loggedIn={this.props.loggedIn}
                market={this.props.market}
                path={this.props.path}
                asset="No"
                sellHypo={this.props.noSellHypo}
                buyHypo={this.props.noBuyHypo}
                sellActual={this.props.noSellActual}
                buyActual={this.props.noBuyActual}
                max={this.props.market.marketUser.maxNo}
                price={this.props.market.noPrice}
                helpText={tooltipNo}
                numOwned={_.get(this.props, 'market.marketUser.noShares', 0)}
                onChange={_.partial(this.props.transactionAmountChange, this.props.market.id, 'NO')}
                executeTransaction={_.partial(this.props.executeTransaction, this.props.market.id, 'NO')}
                executeHypotheticalTransaction={_.partial(this.props.executeHypotheticalTransaction, this.props.market.id, 'NO')}
                icon={<NoShareIcon />}
              />
            </div>
          </Collapse>
        </div>
      </div>
    );
  }
}

MarketItem.propTypes = {
  transactionAmountChange: React.PropTypes.func,
  executeTransaction: React.PropTypes.func,
  executeHypotheticalTransaction: React.PropTypes.func,
};

function mapDispatchToProps(dispatch) {
  return {
    transactionAmountChange:
      _.debounce((market, entity, operation, amount) =>
        dispatch(transactionAmountChange(market, entity, operation, amount)), 50),
    executeTransaction: (market, entity, operation, amount) => dispatch(executeTransaction(market, entity, operation, amount)),
    executeHypotheticalTransaction: (market, entity, operation, amount) => dispatch(executeHypotheticalTransaction(market, entity, operation, amount)),
  };
}

function toJSON(obj) {
  if (obj) return obj.toJSON();
  return obj;
}
function mapStateToProps(state, props) {
  const market = props.market.id;

  const yesBuyHypo = toJSON(selectHypotheticalTransaction(market, 'YES', 'BUY')(state));
  const yesSellHypo = toJSON(selectHypotheticalTransaction(market, 'YES', 'SELL')(state));
  const noBuyHypo = toJSON(selectHypotheticalTransaction(market, 'NO', 'BUY')(state));
  const noSellHypo = toJSON(selectHypotheticalTransaction(market, 'NO', 'SELL')(state));

  const yesBuyActual = toJSON(selectActualTransaction(market, 'YES', 'BUY')(state));
  const yesSellActual = toJSON(selectActualTransaction(market, 'YES', 'SELL')(state));
  const noBuyActual = toJSON(selectActualTransaction(market, 'NO', 'BUY')(state));
  const noSellActual = toJSON(selectActualTransaction(market, 'NO', 'SELL')(state));

  const path = state.getIn(['route', 'locationBeforeTransitions', 'pathname']);
  return {
    path,
    yesBuyHypo,
    yesSellHypo,
    noBuyHypo,
    noSellHypo,
    yesBuyActual,
    yesSellActual,
    noBuyActual,
    noSellActual,
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(MarketItem);

// export default MarketItem;
