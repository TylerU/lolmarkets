const pluckFilter = require('../../filters').pluckFilter;
const schema = require('./market-schema');
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

