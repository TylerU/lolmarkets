const assert = require('chai').assert;
const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
chai.use(chaiAsPromised);
chai.should();

const feathers = require('feathers');
const hooks = require('feathers-hooks');
const auth = require('feathers-authentication/client');
const superagent = require('superagent');
const client = require('feathers-rest/client');
const rest = client('http://localhost:3030');
const _ = require('lodash');
const Promise = require('bluebird');

const app = feathers()
  .configure(hooks())
  .configure(rest.superagent(superagent))
  .configure(auth());

const Transactions = app.service('transactions');
const Users = app.service('users');

beforeEach(function() {
  return app.authenticate({
    type: 'local',
    email: 'tyler@gmail.com',
    password: 'test123',
  });
});

describe('Transactions', function() {
  it('should always ensure user balance > 0', function() {
    const lots = _.times(20, () => Transactions.create({
      market: 1,
      yesSharesDelta: 1,
      noSharesDelta: 0,
    }));

    return Promise.all(lots)
      .then(() => {
        return Users.get(1);
      }, () => {
        return Users.get(1);
      })
      .then((user) => {
        user.money.should.be.above(0);
      });
  });
});
