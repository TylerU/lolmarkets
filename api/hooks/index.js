'use strict';
const errors = require('feathers-errors');
const validator = require('is-my-json-valid');
const auth = require('feathers-authentication').hooks;
const hooks = require('feathers-hooks');
const _ = require('lodash');
const Promise = require('bluebird');
/* eslint no-param-reassign: "off" */

function errorsMap(error) {
  error.path = error.field.replace(/^data\./, '');
  delete error.field;
  return error;
}

exports.ensureId = () => (hook) => {
  if (!hook.id) throw new errors.BadRequest('Must provide an ID with this request');
};

exports.validateHook = function (schemaIn, optionsIn) {
  const schemaNoReq = _.mapValues(schemaIn, _.partialRight(_.omit, 'required'));

  const options = Object.assign({
    verbose: true,
    greedy: true,
  }, optionsIn);

  return (hook) => {
    const schema = {
      required: true,
      type: 'object',
      properties: hook.method === 'patch' ? schemaNoReq : schemaIn,
    };

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
      hook.result.data = _.map(hook.result.data, (obj) => {
        if (obj.toJSON) {
          return obj.toJSON();
        }
        return obj;
      });
    } else {
      if (hook.result.toJSON) {
        hook.result = hook.result.toJSON();
      }
    }
  };

exports.mapResultHook = (fn) =>
  (hook) => {
    if (hook.result.data) {
      return Promise.all(_.map(hook.result.data, (dataElem) => {
        const result = fn(hook, dataElem);
        if (result.then) {
          return result;
        }
        return Promise.resolve(result);
      })).then((arr) => {
        hook.result.data = arr;
        return hook;
      });
    } else {
      const result = fn(hook, hook.result);
      if (result.then) {
        return result.then((res) => {
          hook.result = res;
          return hook;
        });
      }
      hook.result = result;
      return null;
    }
  };

// If there's a token present, attempt to verify it and populate the user data.
// If not, or if it's expired, pretend it doesn't exist
exports.maybeVerifyToken = () =>
  (hook) => {
    if (hook.params.token) {
      return auth.verifyToken()(hook).then((res) => res, (err) => {
        if (err.type === 'FeathersError' && err.message === 'jwt expired') {
          hook.params.token = null;
        } else {
          throw err;
        }
      });
    }
    return null;
  };

exports.pluckQuery = (outProperties) =>
       hooks.pluckQuery.apply(hooks, outProperties.concat(['$sort', '$skip', '$select']));

exports.ignoreNoProvider = () =>
  (hook) => { // TODO - Resolve this little problem
    if (!hook.params.provider) {
      hook.params.provider = 'rest';
    }
  };
