const pluckFilter = require('../../filters').pluckFilter;
const schema = require('./market-schema');
const outProperties = schema.outProperties;

function ensureUserSubscribed(data, connection, hook) {
  if (connection.channels[data.channel]) {
    return data;
  }
  return false;
}

exports.filters = {
  all: [
    ensureUserSubscribed,
    pluckFilter(outProperties),
  ],
  created: [],
  updated: [],
  patched: [],
  removed: [],
};

