const Sequelize = require('sequelize');
const schema = require('./market-user-schema').sequelize;

module.exports = function (sequelize) {
  const Market = sequelize.define('Market', schema, {
    freezeTableName: true, // TODO - connect
    // classMethods: {
    //   associate() {},
    // },
  });

  return Market;
};
