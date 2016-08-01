const assert = require('chai').assert;
const chai = require('chai');
const _ = require('lodash');

chai.should();

const binarySearch = require('../services/market/binarySearch').search;
const MarketComputer = require('../services/market/computation').MarketComputer;

function divide2(val) {
  return val / 2;
}

beforeEach(function() {
});

describe('Binary Search', function() {
  it('Performs correctly', function() {
    binarySearch(divide2, 6.5).should.equal(13);
  });
  it('Performs correctly', function() {
    binarySearch(divide2, 1).should.equal(2);
  });
  it('Performs correctly', function() {
    binarySearch(divide2, 2).should.equal(4);
  });
  it('Deals with 0', function() {
    binarySearch(divide2, 0).should.equal(0);
  });
  it('Deals with 0', function() {
    binarySearch(divide2, 0.5).should.equal(1);
  });
  it('Basic test with marketcomputer', function() {
    const computer = new MarketComputer({
      yesSharesCompute: 1000,
      noSharesCompute: 1000,
      alpha: 0.04,
    });
    binarySearch(_.partial(computer.getTransactionCost.bind(computer), 0), 1000).should.equal(1055);
  });
  it('Basic test with marketcomputer right', function() {
    const computer = new MarketComputer({
      yesSharesCompute: 1000,
      noSharesCompute: 1000,
      alpha: 0.04,
    });
    binarySearch(_.partialRight(computer.getTransactionCost.bind(computer), 0), 1000).should.equal(1055);
  });
  it('Off test with marketcomputer', function() {
    const computer = new MarketComputer({
      yesSharesCompute: 500,
      noSharesCompute: 1000,
      alpha: 0.04,
    });
    binarySearch(_.partial(computer.getTransactionCost.bind(computer), 0), 1000).should.equal(1000);
  });
  it('Off test with marketcomputer right', function() {
    const computer = new MarketComputer({
      yesSharesCompute: 500,
      noSharesCompute: 1000,
      alpha: 0.04,
    });

    binarySearch(_.partialRight(computer.getTransactionCost.bind(computer), 0), 1000).should.equal(1499);
  });
});
