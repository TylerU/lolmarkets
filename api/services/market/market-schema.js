const Sequelize = require('sequelize');
const extractSchemaExports = require('../helpers').extractSchemaExports;

const schema = {
  id: {
    publicRead: true,
    // Created by Sequelize
  },
  yesSharesStart: {
    sequelize: {
      allowNull: false,
      type: Sequelize.INTEGER,
    },
  },
  noSharesStart: {
    sequelize: {
      allowNull: false,
      type: Sequelize.INTEGER,
    },
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
    publicWrite: true,
    publicRead: true,
    sequelize: {
      allowNull: false,
      type: Sequelize.BOOLEAN,
      defaultValue: true,
    },
  },
  resolved: {
    publicWrite: true,
    publicRead: true,
    sequelize: {
      allowNull: false,
      type: Sequelize.BOOLEAN,
      defaultValue: false,
    },
  },
  result: {
    publicWrite: true,
    publicRead: true,
    sequelize: {
      allowNull: true,
      type: Sequelize.BOOLEAN,
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
  channel: {
    publicRead: true,
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
