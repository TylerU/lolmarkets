const Sequelize = require('sequelize');
const schema = require('./market-schema').sequelize;

module.exports = function (sequelize) {
  const Market = sequelize.define('Market', schema, {
    freezeTableName: true,
    classMethods: {
      associate() {
        sequelize.models.Market.belongsTo(sequelize.models.Channel, { foreignKey: 'channel' });
      },
    },
  });

  return Market;
};
