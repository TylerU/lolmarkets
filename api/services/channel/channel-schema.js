const Sequelize = require('sequelize');
const extractSchemaExports = require('../helpers').extractSchemaExports;

const schema = {
  displayName: {
    publicRead: true,
    publicWrite: true,
    sequelize: {
      allowNull: false,
      type: Sequelize.STRING(512),
      unique: true,
    },
  },
  twitchName: {
    publicRead: true,
    publicWrite: true,
    sequelize: {
      allowNull: false,
      type: Sequelize.STRING(512),
      unique: true,
    },
  },
  isStreaming: {
    publicRead: true,
    publicWrite: true,
    sequelize: {
      allowNull: false,
      defaultValue: false,
      type: Sequelize.BOOLEAN,
    },
  },
  // activity: {
  //   publicRead: true,
  //   publicWrite: true,
  //   sequelize: {
  //     allowNull: false,
  //     defaultValue: 0,
  //     type: Sequelize.BIGINT,
  //   },
  // },
  leagueAccounts: {
    publicWrite: true,
    sequelize: {
      allowNull: false,
      type: Sequelize.JSONB,
    },
  },
};

module.exports = extractSchemaExports(schema);
