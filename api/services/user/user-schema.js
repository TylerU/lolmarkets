const Sequelize = require('sequelize');
const extractSchemaExports = require('../helpers').extractSchemaExports;

const schema = {
  id: {
    publicRead: true,
    // Created by Sequelize
  },
  email: {
    publicRead: true,
    publicWrite: true,
    sequelize: {
      allowNull: false,
      type: Sequelize.STRING(512),
      validate: {
        isEmail: true,
      },
      unique: true,
    },
  },
  username: {
    publicRead: true,
    publicWrite: true,
    sequelize: {
      allowNull: false,
      unique: true,
      type: Sequelize.STRING(512),
      validate: {
        isAlphanumeric: { msg: 'Only letters and numbers are allowed in usernames' },
        len: [1, 512],
      },
    },
  },
  password: {
    publicWrite: true,
    sequelize: {
      allowNull: false,
      type: Sequelize.STRING(512),
    },
    jsonSchema: {
      required: true,
      type: 'string',
      maxLength: 512,
      minLength: 5,
    },
  },
  superAdmin: {
    publicRead: true,
    sequelize: {
      defaultValue: false,
      allowNull: false,
      type: Sequelize.BOOLEAN,
    },
  },
  money: {
    publicRead: true,
    sequelize: {
      allowNull: false,
      type: Sequelize.DOUBLE,
    },
  },
};

module.exports = extractSchemaExports(schema);
