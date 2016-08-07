const filters = require('../../filters');
const schema = require('./user-schema');
const outProperties = schema.outProperties;

function ensureBelongsToUser(data, connection, hook) {
  if (connection.user && `${connection.user.id}` === hook.id) {
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
  created: [() => false],
  updated: [],
  patched: [],
  removed: [() => false],
};
