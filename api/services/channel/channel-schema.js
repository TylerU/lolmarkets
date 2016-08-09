const Sequelize = require('sequelize');
const extractSchemaExports = require('../helpers').extractSchemaExports;

const schema = {
  id: {
    publicRead: true,
    // Created by Sequelize
  },
  markets: {
    publicRead: true,
  },
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
  inGame: {
    publicRead: true,
    publicWrite: true,
    sequelize: {
      allowNull: false,
      defaultValue: false,
      type: Sequelize.BOOLEAN,
    },
  },
  leagueGameId: {
    publicWrite: true,
    publicRead: true,
    sequelize: {
      allowNull: true,
      defaultValue: null,
      type: Sequelize.BIGINT,
    },
  },
  leagueGameRegion: {
    publicWrite: true,
    publicRead: true,
    sequelize: {
      allowNull: true,
      defaultValue: null,
      type: Sequelize.STRING,
    },
  },
  twitchViewers: {
    publicRead: true,
    publicWrite: true,
    sequelize: {
      allowNull: false,
      defaultValue: 0,
      type: Sequelize.INTEGER,
    },
  },
  twitchImageUrl: {
    publicRead: true,
    publicWrite: true,
    sequelize: {
      allowNull: true,
      type: Sequelize.STRING(512),
    },
  },
  twitchStreamTitle: {
    publicRead: true,
    publicWrite: true,
    sequelize: {
      allowNull: true,
      type: Sequelize.STRING(512),
    },
  },
  leagueAccounts: {
    publicWrite: true,
    sequelize: {
      allowNull: false,
      type: Sequelize.JSONB,
    },
  },
};

module.exports = extractSchemaExports(schema);
