/* eslint no-param-reassign: "off" */
const authentication = require('feathers-authentication');
const _ = require('lodash');
const userOutProps = require('../user/hooks/user-hooks').outProperties;
const Sequelize = require('sequelize');
const moment = require('moment');
const Promise = require('bluebird');

module.exports = function () {
  const app = this;
  const config = app.get('auth');
  config.token.secret = process.env.AUTH_SECRET || '+GJwhl9/93z1LNvxJ7xyIkEFFeqeErUYoub/Eeh4FIqLqr3j5nZoSt8UJkqogOP8iHUbJxo74R4L0OpRkZSFgw==';

  app.configure(authentication(config));

  const sequelize = app.get('sequelize');
  const LoginRewards = sequelize.define('LoginRewards', {
    user: {
      allowNull: false,
      type: Sequelize.INTEGER,
    },
    time: {
      allowNull: false,
      type: Sequelize.DATE,
    },
    amount: {
      allowNull: false,
      type: Sequelize.INTEGER,
    },
  }, {
    freezeTableName: true,
    classMethods: {
      associate() {
        sequelize.models.LoginRewards.belongsTo(sequelize.models.User, { foreignKey: 'user' });
      },
    },
  });

  function updateLastLogin(hook) {
    const user = hook.result.data.id;
    const amount = app.get('businessSettings').loginReward;

    function executeTransaction(t) {
      const User = sequelize.models.User;
      const now = moment();
      const findUser = User.findById(user, { transaction: t, lock: t.LOCK.UPDATE });
      return findUser.then((userSql) => {
        const lastLogin = userSql.get('lastLoginReward');
        if (lastLogin !== null) {
          const duration = moment.duration(now.diff(moment(lastLogin)));
          const hours = duration.asHours();
          if (hours < 24.0) {
            return null;
          }
        }

        const updateMoney = userSql.increment({
          money: amount,
        }, { transaction: t });

        const updateLogin = userSql.update({
          lastLoginReward: now.toDate(),
        }, { transaction: t });

        const createLog = LoginRewards.create({
          user,
          time: now,
          amount,
        }, { transaction: t });

        return Promise.all([updateMoney, updateLogin, createLog]).then(() => {
          app.logger.info(`Rewarded user ${user} with ${amount} for logging in 24h after last reward given`);
          app.service('users').patch(user, {});
        }, (err) => app.logger.error('Error rewarding user.', err));
      });
    }

    // returns a promise, but we're ignoring it to speed up logins
    sequelize.transaction({
      isolationLevel: Sequelize.Transaction.ISOLATION_LEVELS.READ_COMMITTED,
    }, executeTransaction);

    app.logger.info(`User ${user} logged in (token or local)`);
    hook.app.service('users').patch(hook.result.data.id, { lastLogin: new Date() });
  }

  // Remove properties of user object so as not to leak data.
  app.service('auth/token').after({
    create: [
      function (hook) {
        hook.result.data = _.pick(hook.result.data, userOutProps);
      },
      updateLastLogin,
    ],
  });
};
