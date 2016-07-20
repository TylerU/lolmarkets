const hooks = require('feathers-hooks');
const auth = require('feathers-authentication').hooks;
const validateHook = require('../../../hooks/index.js').validateHook;
const errors = require('feathers-errors');
/* eslint no-param-reassign: "off" */

// This is mostly for testing purposes and prettier errors. Doesn't ensure truly unique users. Must be enforced in database
function checkDuplicateUser(hook) {
  const email = hook.data.email;
  if (!email) throw new errors.BadRequest('No email found');

  return hook.app.service('/users').find({
    query: {
      email,
    },
  }).then((obj) => {
    if (obj.data.length > 0) {
      hook.data.errors = [{
        message: 'already in use',
        path: 'email',
      }];
      throw new errors.BadRequest('Email already in use', hook.data);
    }
  });
}

const schema = {
  email: {
    required: true,
    type: 'string',
    format: 'email',
  },
  password: {
    required: true,
    type: 'string',
    maxLength: 512,
    minLength: 5,
  },
};

const outProperties = ['email', '_id'];
const inProperties = ['email', 'password'];

exports.outProperties = outProperties;
exports.inProperties = inProperties;

exports.before = {
  all: [],
  find: [
    hooks.disable('external'),
  ],
  get: [
    auth.verifyToken(),
    auth.populateUser(),
    auth.restrictToAuthenticated(),
    auth.restrictToOwner({ ownerField: '_id' }),
  ],
  create: [ // TODO - database ensures email uniqueness to prevent race cases!
    validateHook(schema),
    checkDuplicateUser,
    auth.hashPassword(),
    hooks.pluck.apply(hooks, inProperties),
  ],
  update: [
    auth.verifyToken(),
    validateHook(schema),
    checkDuplicateUser,
    auth.hashPassword(),
    auth.populateUser(),
    auth.restrictToAuthenticated(),
    auth.restrictToOwner({ ownerField: '_id' }),
    hooks.pluck.apply(hooks, inProperties), // TODO - should email be settable?
  ],
  patch: [
    hooks.disable(() => true),
  ],
  remove: [
    hooks.disable(() => true),
  ],
};

exports.after = {
  all: [hooks.pluck.apply(hooks, outProperties)],
  find: [],
  get: [],
  create: [],
  update: [],
  patch: [],
  remove: [],
};
