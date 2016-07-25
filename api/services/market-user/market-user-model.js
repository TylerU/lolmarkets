const Sequelize = require('sequelize');
const schema = require('./market-user-schema').sequelize;

module.exports = function (sequelize) {
  const MarketUser = sequelize.define('MarketUser', schema, {
    freezeTableName: true, // TODO - connect
    // classMethods: {
    //   associate() {},
    // },
  });

  return MarketUser;
};
