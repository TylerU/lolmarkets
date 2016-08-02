const hooks = require('./hooks/leaderboard-hooks');

module.exports = function () {
  const app = this;

  const options = {
    sequelize: app.get('sequelize'),
    paginate: {
      default: 1000,
      max: 1000,
    },
  };

  // Initialize our service with any options it requires
  app.use('/leaderboards', new LeaderboardService(options));

  // Get our initialized service to that we can bind hooks
  const leaderboardService = app.service('/leaderboards');

  // Set up our before hooks
  leaderboardService.before(hooks.before);

  // Set up our after hooks
  leaderboardService.after(hooks.after);
};

