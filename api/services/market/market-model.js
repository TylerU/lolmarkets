const Sequelize = require('sequelize');
const schema = require('./market-schema').sequelize;

module.exports = function (sequelize) {
  const Market = sequelize.define('Market', schema, {
    freezeTableName: true, // TODO - connect to channel
    // classMethods: {
    //   associate() {},
    // },
  });

  return Market;
};
