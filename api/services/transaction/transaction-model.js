const Sequelize = require('sequelize');
const schema = require('./transaction-schema').sequelize;

module.exports = function (sequelize) {
  const Transaction = sequelize.define('Transaction', schema, {
    freezeTableName: true,
    classMethods: {
      associate() {
        sequelize.models.Transaction.belongsTo(sequelize.models.User, { foreignKey: 'user' });
        sequelize.models.Transaction.belongsTo(sequelize.models.Market, { foreignKey: 'market' });
      },
    },
  });

  return Transaction;
};
