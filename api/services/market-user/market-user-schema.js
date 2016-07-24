const Sequelize = require('sequelize');
const extractSchemaExports = require('../helpers').extractSchemaExports;

// Maybe move this to its own service.

const schema = {
  yesShares: {
    publicRead: true,
    sequelize: {
      allowNull: false,
      type: Sequelize.BIGINT,
    },
  },
  noShares: {
    publicRead: true,
    sequelize: {
      allowNull: false,
      type: Sequelize.BIGINT,
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
};
// TODO - market, user associations
module.exports = extractSchemaExports(schema);
