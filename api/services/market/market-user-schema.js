const Sequelize = require('sequelize');
const extractSchemaExports = require('../helpers').extractSchemaExports;

const schema = {
  yesShares: {
    publicRead: true,
    publicWrite: true,
    sequelize: {
      allowNull: false,
      type: Sequelize.BIGINT,
    },
  },
  noShares: {
    publicRead: true,
    publicWrite: true,
    sequelize: {
      allowNull: false,
      type: Sequelize.BIGINT,
    },
  },
  inMoney: {
    publicRead: true,
    publicWrite: true,
    sequelize: {
      allowNull: false,
      defaultValue: 0,
      type: Sequelize.DOUBLE,
    },
  },
  outMoney: {
    publicRead: true,
    publicWrite: true,
    sequelize: {
      allowNull: false,
      defaultValue: 0,
      type: Sequelize.DOUBLE,
    },
  },
};

module.exports = extractSchemaExports(schema);
