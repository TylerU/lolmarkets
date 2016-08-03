'use strict';
/* eslint no-underscore-dangle: "off" */
const search = require('./binarySearch').search;
const _ = require('lodash');

function fb(alpha, main, opposite) {
  return alpha * (main + opposite);
}

// derivative of the cost function
function getCurrentPrice(alpha, main, opposite) {
  const b = fb(alpha, main, opposite);
  const firstTerm = alpha * Math.log(Math.exp(main / b) + Math.exp(opposite / b));

  const secondTermTop = ((main * Math.exp(main / b)) + (opposite * Math.exp(main / b))) - ((main * Math.exp(main / b)) + (opposite * Math.exp(opposite / b)));

  const secondTermBottom = (main * (Math.exp(main / b) + Math.exp(opposite / b))) + (opposite * (Math.exp(main / b) + Math.exp(opposite / b)));

  return firstTerm + secondTermTop / secondTermBottom;
}

// the cost function where main is the instrument we're getting the "cost" of and opposite is its opposite
function getCost(alpha, main, opposite) {
  const b = fb(alpha, main, opposite);
  return b * Math.log(
      Math.exp(main / b) + Math.exp(opposite / b)
    );
}

class MarketComputer {
  constructor(settings) {
    if (!settings.alpha || !settings.yesSharesCompute || !settings.noSharesCompute) throw { message: 'Invalid parameters for MarketComputer' };
    this.alpha = settings.alpha;
    this.yes = settings.yesSharesCompute;
    this.no = settings.noSharesCompute;

    this._getCost = getCost;
    this._getCurrentPrice = getCurrentPrice;
  }

  getOtherCost(yes, no) {
    return this._getCost(this.alpha, yes, no);
  }

  getCurrentCost() {
    return this._getCost(this.alpha, this.yes, this.no);
  }

  getYesPrice() {
    return this._getCurrentPrice(this.alpha, this.yes, this.no);
  }

  getNoPrice() {
    return this._getCurrentPrice(this.alpha, this.no, this.yes);
  }

  getPercent() {
    return this.getYesPrice() / (this.getYesPrice() + this.getNoPrice());
  }

  getTransactionCost(deltaYes, deltaNo) {
    return this.getOtherCost(this.yes + deltaYes, this.no + deltaNo) - this.getCurrentCost();
  }

  getMaxYesCanBuy(money) {
    return search(_.partialRight(this.getTransactionCost.bind(this), 0), money);
  }

  getMaxNoCanBuy(money) {
    return search(_.partial(this.getTransactionCost.bind(this), 0), money);
  }
}

module.exports.MarketComputer = MarketComputer;
