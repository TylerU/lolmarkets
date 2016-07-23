const hooks = require('feathers-hooks');
const auth = require('feathers-authentication').hooks;
const validateHook = require('../../../hooks/index.js').validateHook;
/* eslint no-param-reassign: "off" */


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
  superAdmin: {
    required: false,
    type: 'boolean',
  },
};

function setSuperAdmin(hook) {
  hook.data.superAdmin = false;
}
const outProperties = ['email', '_id', 'superAdmin'];
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
  create: [
    validateHook(schema),
    auth.hashPassword(),
    hooks.pluck.apply(hooks, inProperties),
    setSuperAdmin,
  ],
  update: [
    auth.verifyToken(),
    validateHook(schema),
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
