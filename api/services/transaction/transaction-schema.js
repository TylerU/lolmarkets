const Sequelize = require('sequelize');
const extractSchemaExports = require('../helpers').extractSchemaExports;

const schema = {
  yesSharesDelta: {
    publicWrite: true,
    publicRead: true,
    sequelize: {
      allowNull: false,
      type: Sequelize.BIGINT,
    },
  },
  noSharesDelta: {
    publicWrite: true,
    publicRead: true,
    sequelize: {
      allowNull: false,
      type: Sequelize.BIGINT,
    },
  },
  market: {
    publicWrite: true,
    publicRead: true,
    sequelize: {
      allowNull: false,
      type: Sequelize.INTEGER,
    },
  },
  user: {
    publicRead: true,
    sequelize: {
      allowNull: false,
      type: Sequelize.INTEGER,
    },
  },
  totalPrice: {
    publicRead: true,
    sequelize: {
      allowNull: false,
      type: Sequelize.DOUBLE,
    },
  },
  createAt: {
    publicRead: true, // Let them get it out. Sequelize will create it for us
  },
};

module.exports = extractSchemaExports(schema);
