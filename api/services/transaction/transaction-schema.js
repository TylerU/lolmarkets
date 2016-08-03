const Sequelize = require('sequelize');
const extractSchemaExports = require('../helpers').extractSchemaExports;

const schema = {
  id: {
    publicRead: true,
    // Created by Sequelize
  },
  yesSharesDelta: {
    publicWrite: true,
    publicRead: true,
    sequelize: {
      allowNull: false,
      type: Sequelize.INTEGER,
    },
    jsonSchema: {
      required: true,
      type: 'integer',
    },
  },
  noSharesDelta: {
    publicWrite: true,
    publicRead: true,
    sequelize: {
      allowNull: false,
      type: Sequelize.INTEGER,
    },
    jsonSchema: {
      required: true,
      type: 'integer',
    },
  },
  market: {
    publicWrite: true,
    publicRead: true,
    sequelize: {
      allowNull: false,
      type: Sequelize.INTEGER,
    },
    jsonSchema: {
      required: true,
      type: 'integer',
      minimum: 0,
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
  fake: {
    publicWrite: true,
    jsonSchema: {
      type: 'boolean',
    },
  },
  createdAt: {
    publicRead: true, // Let them get it out. Sequelize will create it for us
  },
  newYesPrice: {
    publicRead: true,
  },
  newNoPrice: {
    publicRead: true,
  },
  newPercent: {
    publicRead: true,
    sequelize: {
      allowNull: false,
      type: Sequelize.DOUBLE,
    },
  },
};

module.exports = extractSchemaExports(schema);
