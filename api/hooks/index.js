'use strict';
const errors = require('feathers-errors');
const validator = require('is-my-json-valid');
const auth = require('feathers-authentication').hooks;
const _ = require('lodash');
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

exports.superAdminOnlyHook = () =>
  (hook) => {
    if (!hook.params.provider) return; // It's internal, so we don't care

    if (hook.params.user && hook.params.user.superAdmin) {
      return;
    }

    throw new errors.Forbidden('Internal access only');
  };

exports.overrideData = (obj) =>
  (hook) => {
    const toOverride = _.isFunction(obj) ? obj(hook.app) : obj;

    hook.data = _.assign({}, hook.data, toOverride);
  };

exports.toJson = () =>
  (hook) => {
    if (hook.result.data) {
      hook.result.data = _.map(hook.result.data, (obj) => obj.toJSON());
    } else {
      hook.result = hook.result.toJSON();
    }
  };

exports.mapResultHook = (fn) =>
  (hook) => {
    if (hook.result.data) {
      hook.result.data = _.map(hook.result.data, fn);
    } else {
      hook.result = fn(hook.result);
    }
  };

exports.maybeVerifyToken = () =>
  (hook) => {
    if (hook.params.token) {
      return auth.verifyToken()(hook);
    }
    return null;
  };

