const Sequelize = require('sequelize');
const schema = require('./transaction-schema').sequelize;

module.exports = function (sequelize) {
  const Transaction = sequelize.define('Transaction', schema, {
    freezeTableName: true,
    // classMethods: {
    //   associate() {},
    // },
  });

  return Transaction;
};
