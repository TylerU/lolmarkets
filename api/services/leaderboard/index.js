'use strict';
const hooks = require('./hooks/leaderboard-hooks');
const _ = require('lodash');
const Promise = require('bluebird');

class LeaderboardService {
  constructor(options) {
    this.sequelize = options.sequelize;
    this.paginate = options.paginate;
  }

  find(params) {
    const baseQuery =
      `SELECT "username", "channel", "profit", "user" AS "userId" FROM 
        (SELECT
          "user",
          "channel",
          SUM("outMoney")-SUM("inMoney") AS "profit"
        FROM public."MarketUser"
        INNER JOIN public."Market"
          ON "MarketUser"."market" = "Market"."id"
          WHERE "Market"."active" = false
        GROUP BY "user", "channel") AS withoutusernames
      INNER JOIN public."User"
        ON "User"."id" = "withoutusernames"."user"`;

    const limit = _.min([this.paginate.max, params.query.$limit ? params.query.$limit : this.paginate.default]);
    const skip = params.query.$skip ? params.query.$skip : 0;
    const sort = 'ORDER BY "profit" desc';
    const limitSkip = `LIMIT ${limit} OFFSET ${skip}`;

    const thisChannelQuery =
      `SELECT * 
      from (${baseQuery}) AS subquery 
      WHERE "channel"=:channel`;

    const baseGlobal =
      `SELECT 
        "username", 
        "userId", 
        SUM("profit") as "profit"
      from (${baseQuery}) as subquery 
      GROUP BY "userId", "username"`;

    let query = baseGlobal;
    if (params.query.channel) query = thisChannelQuery;

    const finalQuery =
      `SELECT 
        "username", 
        "userId", 
        "profit", 
        row_number() over (order by "profit" desc) as "ranking" 
      from (${query}) as "sub" 
      ${sort}
      ${limitSkip}`;

    const finalCountQuery = `SELECT COUNT("userId") from (${query}) as sub`;
    const options = {
      type: this.sequelize.QueryTypes.SELECT,
      replacements: {
        channel: params.query.channel,
      },
    };
    return Promise.all([this.sequelize.query(finalQuery, options), this.sequelize.query(finalCountQuery, options)])
      .spread((data, count) => ({
        total: count[0].count,
        limit,
        skip,
        data,
      }));
  }
}

module.exports = function initLeaderboard() {
  const app = this;

  const options = {
    sequelize: app.get('sequelize'),
    paginate: {
      default: 25,
      max: 100,
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

