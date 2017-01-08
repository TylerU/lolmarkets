const _ = require('lodash');
const Promise = require('bluebird');

exports.predictionTypes = {
  WILL_WIN: 0,
  MORE_THAN_X_KILLS: 1,
};

function log(res) {
  console.log(res);
  return res;
}

const predictionTypes = exports.predictionTypes;

// TODO - fix wonky app tossing
exports.handleNewGame = function handleNewGame(app, details) {
  if (!details.channel.isStreaming) return Promise.resolve(null); // Just in case they stopped streaming in the meantime.

  const MarketService = app.service('markets');
  const channelIn = details.channel;
  const channel = details.channel.id;
  const leagueGameId = details.extraDetails.leagueGameId;
  const leagueGameRegion = details.extraDetails.activeAccount.region;
  const activeAccount = details.extraDetails.activeAccount;
  const name = channelIn.displayName;
  const numKills = _.random(3, 9);

  const promises = [
    MarketService.create({
      name: `${name} will win this game`,
      predictionDetails: {
        type: predictionTypes.WILL_WIN,
        activeAccount,
      },
      channel,
      leagueGameId,
      leagueGameRegion,
    }),
    MarketService.create({
      name: `${name} will get ${numKills} or more kills`,
      predictionDetails: {
        type: predictionTypes.MORE_THAN_X_KILLS,
        activeAccount,
        kills: numKills,
      },
      channel,
      leagueGameId,
      leagueGameRegion,
    }),
  ];

  return Promise.all(promises).then(
    () => app.logger.info(`Successfully created markets for new game. Player: ${name}`),
    (err) => app.logger.error('Error creating markets for new game.', err));
};

function getResult(details, match) {
  if (!details || !details.activeAccount) throw new Error('Invalid market. Needs activeAccount set');
  const summonerId = details.activeAccount.id;
  const participantId = _.find(match.participantIdentities, (identity) => identity.player.summonerId === summonerId).participantId;
  if (!participantId) throw new Error('Unable to find participant id in match object');

  const participant = _.find(match.participants, { participantId });
  if (!participant || !participant.stats) throw new Error('Unable to find the participant stats object for the participantId');

  const resolve = {
    WILL_WIN: () =>
       participant.stats.winner,
    MORE_THAN_X_KILLS: () => {
      if (!details.kills) {
        throw new Error(`Markets of type ${predictionTypes.MORE_THAN_X_KILLS} must have 'kills' member`);
      }
      return participant.stats.kills > details.kills;
    },
  };

  if (!_.isEqual(_.keys(resolve), _.keys(predictionTypes))) {
    throw new Error('Prediction Types not equal');
  }
  const result = _.mapKeys(resolve, (value, key) => predictionTypes[key])[details.type]();
  return result;
}

function resolveMarkets(app) {
  function notifyAll(res) {
    const UserService = app.service('users');
    const MarketService = app.service('markets');
    const MarketUserService = app.service('marketUsers');

    const ServiceMap = {
      Market: MarketService,
      User: UserService,
      MarketUser: MarketUserService,
    };

    function toPromises(arr) {
      return _.map(arr, (obj) => ServiceMap[obj.type].patch(obj.id, {}));
    }

    // Udpate all Users, then all Markets so that the Markets will have updated user info
    return Promise.all(toPromises([].concat(
      _.filter(res, { type: 'User' }),
      _.filter(res, { type: 'Market' }),
      _.filter(res, { type: 'MarketUser' }))));
  }

  // Grab unresolved markets
  // Grab their market users
  // Give users money
  // Mark market as resolved
  const resolveQuery = `
    WITH 
    "markets" AS 
      (SELECT "id"  
        FROM public."Market"
        WHERE "active" = FALSE 
          AND "resolved" = FALSE
          AND "result" = <%= curResult %>
        FOR UPDATE
      ),
    "marketUsers" AS
        (SELECT "user", "yesShares", "noShares", "MarketUser"."id"
            FROM public."MarketUser" 
            WHERE "market" in (SELECT * from markets)
            --FOR UPDATE -- Apparently this causes other things to not be able to read this data
        ),
    "usersUpdated" AS 
        (UPDATE public."User"
            SET "money" = "money" + "marketUsers"."<%= curField %>"
            FROM "marketUsers"
            WHERE "marketUsers"."user" = "User"."id"
          RETURNING "User"."id" as "id"
        ),
    "marketsUpdated" AS 
        (UPDATE public."Market"
            SET "resolved" = TRUE
            WHERE "id" in (SELECT "id" FROM "markets")
          RETURNING "id"
        ),
    "marketUsersUpdated" AS 
        (UPDATE public."MarketUser"
            SET "inMoneyFinal" = "inMoney",
                "outMoneyFinal" = "outMoney" + "<%= curField %>",
                "marketResult" = <%= curResult %>
            WHERE "market" in (SELECT * from markets)
          RETURNING "id"
        )
    SELECT * 
    FROM 
      (SELECT DISTINCT "id", 'Market' AS "type" FROM "marketsUpdated"
         UNION 
         select DISTINCT "id" as "id", 'MarketUser' as "type" from "marketUsersUpdated"
         UNION
         select DISTINCT "id" as "id", 'User' as "type" from "usersUpdated") as "test2"`;

  const compiled = _.template(resolveQuery);
  const yesQuery = compiled({ curResult: 'TRUE', curField: 'yesShares' });
  const noQuery = compiled({ curResult: 'FALSE', curField: 'noShares' });
  const options = { type: app.get('sequelize').QueryTypes.SELECT };

  // Execute the query, then notify Markets and Users of the updates
  const yesUpdate = app.get('sequelize').query(yesQuery, options)
    .then(notifyAll);
  const noUpdate = app.get('sequelize').query(noQuery, options)
    .then(notifyAll);

  return Promise.all([yesUpdate, noUpdate]);
}

exports.handleGameOver = function handleGameOver(app, match) {
  // Mark markets as over
  // Resolve markets
  const MarketService = app.service('markets');

  MarketService.find({ query: { $limit: 1000, leagueGameId: match.matchId, leagueGameRegion: match.region } })
    .then((markets) => markets.data)
    // Mark as inactive
    .then((markets) => Promise.all(_.map(markets, (market) => MarketService.patch(market.id, {
      active: false,
      timeClosed: new Date(),
      result: getResult(market.predictionDetails, match),
    }))))
    .then((markets) => resolveMarkets(app, markets))
    .then(
      () => app.logger.info(`Successfully resolved markets for match: ${match.matchId}`),
      (err) => app.logger.error('Error resolving markets.', err));
};

exports.resolveMarkets = resolveMarkets;
