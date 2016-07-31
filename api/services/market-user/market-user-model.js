const Sequelize = require('sequelize');
const schema = require('./market-user-schema').sequelize;

module.exports = function (sequelize) {
  const MarketUser = sequelize.define('MarketUser', schema, {
    indexes: [{
      unique: true,
      fields: ['user', 'market'],
    }],
    freezeTableName: true,
    classMethods: {
      associate() {
        sequelize.models.MarketUser.belongsTo(sequelize.models.User, { foreignKey: 'user' });
        sequelize.models.MarketUser.belongsTo(sequelize.models.Market, { foreignKey: 'market' });
      },
    },
  });

  return MarketUser;
};
