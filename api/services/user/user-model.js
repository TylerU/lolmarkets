const Sequelize = require('sequelize');
const UserSchema = require('./user-schema').sequelize;

module.exports = function (sequelize) {
  const User = sequelize.define('User', UserSchema, {
    freezeTableName: true,
    // classMethods: {
    //   associate() {},
    // },
  });

  return User;
};
