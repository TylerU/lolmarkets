const Sequelize = require('sequelize');
const schema = require('./channel-schema').sequelize;

module.exports = function (sequelize) {
  const Channel = sequelize.define('Channel', schema, {
    freezeTableName: true,
    classMethods: {
      associate() {
        sequelize.models.Channel.hasMany(sequelize.models.Market, { as: 'markets', foreignKey: 'channel' });
      },
    },
  });

  return Channel;
};
