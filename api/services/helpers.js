const _ = require('lodash');

module.exports.extractSchemaExports = (schema) => ({
  sequelize: _.chain(schema)
    .mapValues('sequelize')
    .omitBy(_.isUndefined)
    .value(),
  jsonSchema: _.chain(schema)
    .mapValues('jsonSchema')
    .omitBy(_.isUndefined)
    .value(),
  outProperties: _.chain(schema)
    .pickBy((value) => value.publicRead)
    .keys()
    .value(),
  inProperties: _.chain(schema)
    .pickBy((value) => value.publicWrite)
    .keys()
    .value(),
});
