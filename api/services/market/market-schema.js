const Sequelize = require('sequelize');
const extractSchemaExports = require('../helpers').extractSchemaExports;

const schema = {
  id: {
    publicRead: true,
    // Created by Sequelize
  },
  yesShares: {
    sequelize: {
      allowNull: false,
      type: Sequelize.INTEGER,
    },
  },
  noShares: {
    sequelize: {
      allowNull: false,
      type: Sequelize.INTEGER,
    },
  },
  alpha: {
    sequelize: {
      allowNull: false,
      type: Sequelize.DOUBLE,
    },
  },
  yesSharesCompute: {
    sequelize: {
      allowNull: false,
      type: Sequelize.INTEGER,
    },
  },
  noSharesCompute: {
    sequelize: {
      allowNull: false,
      type: Sequelize.INTEGER,
    },
  },
  name: {
    publicWrite: true,
    publicRead: true,
    sequelize: {
      allowNull: false,
      type: Sequelize.STRING,
    },
  },
  leagueGameId: {
    publicWrite: true,
    publicRead: true,
    sequelize: {
      allowNull: false,
      type: Sequelize.INTEGER,
    },
  },
  active: {
    publicRead: true,
    sequelize: {
      allowNull: false,
      type: Sequelize.BOOLEAN,
      defaultValue: true,
    },
  },
  timeOpened: {
    publicRead: true,
    sequelize: {
      allowNull: false,
      type: Sequelize.DATE,
    },
  },
  timeClosed: {
    publicRead: true,
    sequelize: {
      defaultValue: null,
      type: Sequelize.DATE,
    },
  },
  yesPrice: {
    publicRead: true,
  },
  noPrice: {
    publicRead: true,
  },
  percent: {
    publicRead: true,
  },
  marketUser: {
    publicRead: true,
  },
};

module.exports = extractSchemaExports(schema);
