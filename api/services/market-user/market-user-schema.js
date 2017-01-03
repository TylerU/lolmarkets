const Sequelize = require('sequelize');
const extractSchemaExports = require('../helpers').extractSchemaExports;

const schema = {
  id: {
    publicRead: true,
    // Created by Sequelize
  },
  marketObj: {
    publicRead: true,
    // Created by us
  },
  maxYesShares: {
    publicRead: true,
  },
  maxNoShares: {
    publicRead: true,
  },
  marketResult: {
    publicRead: true,
    sequelize: {
      allowNull: true,
      defaultValue: null,
      type: Sequelize.BOOLEAN,
    },
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
  inMoneyFinal: {
    publicRead: true,
    sequelize: {
      allowNull: false,
      defaultValue: 0,
      type: Sequelize.DOUBLE,
    },
  },
  outMoneyFinal: {
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

module.exports = extractSchemaExports(schema);
