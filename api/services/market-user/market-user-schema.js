const Sequelize = require('sequelize');
const extractSchemaExports = require('../helpers').extractSchemaExports;

const schema = {
  id: {
    publicRead: true,
    // Created by Sequelize
  },
  maxYesShares: {
    publicRead: true,
  },
  maxNoShares: {
    publicRead: true,
  },
  yesShares: {
    publicRead: true,
    sequelize: {
      allowNull: false,
      type: Sequelize.INTEGER,
    },
  },
  noShares: {
    publicRead: true,
    sequelize: {
      allowNull: false,
      type: Sequelize.INTEGER,
    },
  },
  inMoney: {
    publicRead: true,
    sequelize: {
      allowNull: false,
      defaultValue: 0,
      type: Sequelize.DOUBLE,
    },
  },
  outMoney: {
    publicRead: true,
    sequelize: {
      allowNull: false,
      defaultValue: 0,
      type: Sequelize.DOUBLE,
    },
  },
  user: {
    publicRead: true,
    sequelize: {
      allowNull: false,
      type: Sequelize.INTEGER,
    },
  },
  market: {
    publicRead: true,
    sequelize: {
      allowNull: false,
      type: Sequelize.INTEGER,
    },
  },
};
// TODO - market, user associations
module.exports = extractSchemaExports(schema);
