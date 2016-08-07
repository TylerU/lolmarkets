const pluckFilter = require('../../filters').pluckFilter;

const schema = require('./channel-schema');
const outProperties = schema.outProperties;

exports.filters = {
  all: [
    pluckFilter(outProperties),
  ],
  created: [],
  updated: [],
  patched: [],
  removed: [],
};
