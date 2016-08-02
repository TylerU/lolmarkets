/* eslint no-param-reassign: "off" */
const hooks = require('feathers-hooks');
const customHooks = require('../../../hooks/index.js');

exports.before = {
  all: [],
  find: [],
  get: [
    hooks.disable('external'),
  ],
  create: [
    hooks.disable('external'),
  ],
  update: [
    hooks.disable('external'),
  ],
  patch: [
    hooks.disable(() => true),
  ],
  remove: [
    hooks.disable(() => true),
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
