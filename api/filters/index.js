const _ = require('lodash');

exports.pluckFilter = (outProps) => (data) => _.pick(data, outProps);

exports.ensureAuthenticated = () => (data, connection) => {
  if (!connection.user) {
    return false;
  }
  return data;
};
