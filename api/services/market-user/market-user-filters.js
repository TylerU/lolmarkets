const filters = require('../../filters');
const schema = require('./market-user-schema');
const outProperties = schema.outProperties;

function ensureBelongsToUser(data, connection, hook) {
  if (connection.user && `${connection.user.id}` === `${data.user}`) {
    return data;
  }
  return false;
}

exports.filters = {
  all: [
    filters.ensureAuthenticated(),
    ensureBelongsToUser,
    filters.pluckFilter(outProperties),
  ],
  created: [],
  updated: [],
  patched: [],
  removed: [() => false],
};
