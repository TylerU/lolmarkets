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
      type: Sequelize.BIGINT,
    },
  },
  noShares: {
    sequelize: {
      allowNull: false,
      type: Sequelize.BIGINT,
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
      type: Sequelize.BIGINT,
    },
  },
  noSharesCompute: {
    sequelize: {
      allowNull: false,
      type: Sequelize.BIGINT,
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
      type: Sequelize.BIGINT,
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
};

module.exports = extractSchemaExports(schema);
