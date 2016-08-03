const hooks = require('feathers-hooks');

exports.before = {
  all: [],
  find: [],
  get: [
    hooks.disable(() => false),
  ],
  create: [
    hooks.disable(() => false),
  ],
  update: [
    hooks.disable(() => false),
  ],
  patch: [
    hooks.disable(() => false),
  ],
  remove: [
    hooks.disable(() => false),
  ],
};

exports.after = {
  all: [],
  find: [],
  get: [],
  create: [],
  update: [],
  patch: [],
  remove: [],
};
