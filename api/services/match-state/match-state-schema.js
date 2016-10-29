const extractSchemaExports = require('../helpers').extractSchemaExports;

const schema = {
  type: {
    publicWrite: true,
    jsonSchema: {
      required: true,
      type: 'string',
    },
  },
  match: {
    publicWrite: true,
    jsonSchema: {
      required: false,
      type: 'object',
    },
  },
  channelId: {
    publicWrite: true,
    jsonSchema: {
      required: false,
      type: 'integer',
    },
  },
  leagueGameRegion: {
    publicWrite: true,
    jsonSchema: {
      required: false,
      type: 'string',
    },
  },
  leagueGameId: {
    publicWrite: true,
    jsonSchema: {
      required: false,
      type: 'integer',
    },
  },
  activeAccount: {
    publicWrite: true,
    jsonSchema: {
      required: false,
      type: 'object',
    },
  },
};


module.exports = extractSchemaExports(schema);
