const errors = require('feathers-errors');
const validator = require('is-my-json-valid');
/* eslint no-param-reassign: "off" */

function errorsMap(error) {
  error.path = error.field.replace(/^data\./, '');
  delete error.field;
  return error;
}

exports.validateHook = function (schemaIn, optionsIn) {
  const schema = {
    required: true,
    type: 'object',
    properties: schemaIn,
  };

  const options = Object.assign({
    verbose: true,
    greedy: true,
  }, optionsIn);

  return (hook) => {
    const validate = validator(schema, options);
    const valid = validate(hook.data);

    if (!valid) {
      const data = hook.data;
      data.errors = validate.errors.map(errorsMap);
      throw new errors.BadRequest('Validation failed', data);
    }
  };
};
