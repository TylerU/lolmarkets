const _ = require('lodash');
const Promise = require('bluebird');

exports.predictionTypes = {
  WILL_WIN: 0,
  MORE_THAN_X_KILLS: 1,
  MORE_THAN_X_DEATHS: 2,
  MORE_THAN_X_CS: 3,
  GET_FIRST_BLOOD: 4,
  GET_DOUBLEKILL: 5,
  GET_TRIPLEKILL: 6,
  GET_QUADRA: 7,
  GET_PENTA: 8,
  MORE_THAN_X_ASSISTS: 9,
  END_GAME_LEVEL_18: 10,
};

const predictionTypes = exports.predictionTypes;
const predictionGenerators = [
  function willWin(activeAccount, name) {
    return {
      name: `${name} will win this game`,
      predictionDetails: {
        type: predictionTypes.WILL_WIN,
        activeAccount,
      },
    };
  },
  function level18(activeAccount, name) {
    return {
      name: `${name} will hit level 18 this game`,
      predictionDetails: {
        type: predictionTypes.END_GAME_LEVEL_18,
        activeAccount,
      },
    };
  },
  function killCount(activeAccount, name) {
    const numKills = _.random(3, 9);
    return {
      name: `${name} will get ${numKills} or more kills`,
      predictionDetails: {
        type: predictionTypes.MORE_THAN_X_KILLS,
        activeAccount,
        kills: numKills,
      },
    };
  },
  function assistCount(activeAccount, name) {
    const num = _.random(2, 12);
    return {
      name: `${name} will get ${num} or more assists`,
      predictionDetails: {
        type: predictionTypes.MORE_THAN_X_ASSISTS,
        activeAccount,
        assists: num,
      },
    };
  },
  function deathCount(activeAccount, name) {
    const num = _.random(2, 10);
    return {
      name: `${name} will die ${num} or more times`,
      predictionDetails: {
        type: predictionTypes.MORE_THAN_X_DEATHS,
        activeAccount,
        deaths: num,
      },
    };
  },
  function csCount(activeAccount, name) {
    const num = _.random(4, 28) * 10;
    return {
      name: `${name} will get ${num} or more cs`,
      predictionDetails: {
        type: predictionTypes.MORE_THAN_X_CS,
        activeAccount,
        cs: num,
      },
    };
  },
  // function firstBlood(activeAccount, name) {
  //   return {
  //     name: `${name} will get or assist first blood`,
  //     predictionDetails: {
  //       type: predictionTypes.GET_FIRST_BLOOD,
  //       activeAccount,
  //     },
  //   };
  // },
  function doubleKill(activeAccount, name) {
    return {
      name: `${name} will get a double kill`,
      predictionDetails: {
        type: predictionTypes.GET_DOUBLEKILL,
        activeAccount,
      },
    };
  },
  function tripleKill(activeAccount, name) {
    return {
      name: `${name} will get a triple kill`,
      predictionDetails: {
        type: predictionTypes.GET_TRIPLEKILL,
        activeAccount,
      },
    };
  },
  function quadraKill(activeAccount, name) {
    return {
      name: `${name} will get a quadra kill`,
      predictionDetails: {
        type: predictionTypes.GET_QUADRA,
        activeAccount,
      },
    };
  },
  function pentaKill(activeAccount, name) {
    return {
      name: `${name} will get a penta kill`,
      predictionDetails: {
        type: predictionTypes.GET_PENTA,
        activeAccount,
      },
    };
  },

];

function log(res) {
  console.log(res);
  return res;
}


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

  const NUM_MARKETS = 2;
  const generators = _.sampleSize(_.tail(predictionGenerators), NUM_MARKETS);
  generators.push(predictionGenerators[0]);
  const promises = _.map(generators, (gen) => {
    const pred = gen(activeAccount, name);

    return MarketService.create({
      name: pred.name,
      predictionDetails: pred.predictionDetails,
      channel,
      leagueGameId,
      leagueGameRegion,
    });
  });

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

  const stats = participant.stats;


  function ensureHas(val, props) {
    if (_.intersection(_.keys(val), props).length === props.length) return true;
    throw new Error(`Invalid object received. Expected members: ${_.toString(props)}, but received object only has ${_.toString(_.keys(val))}`)
  }

  const resolve = {
    WILL_WIN: () =>
      ensureHas(stats, ['winner']) &&
      stats.winner,
    MORE_THAN_X_KILLS: () =>
      ensureHas(stats, ['kills']) &&
      ensureHas(details, ['kills']) &&
      stats.kills >= details.kills,
    MORE_THAN_X_DEATHS: () =>
      ensureHas(stats, ['deaths']) &&
      ensureHas(details, ['deaths']) &&
      stats.deaths >= details.deaths,
    MORE_THAN_X_CS: () =>
      ensureHas(stats, ['neutralMinionsKilled', 'minionsKilled']) &&
      ensureHas(details, ['cs']) &&
      stats.neutralMinionsKilled + stats.minionsKilled >= details.cs,
    GET_FIRST_BLOOD: () =>
      /*ensureHas(stats, ['firstBloodAssist', 'firstBloodKill']) &&*/
      stats.firstBloodAssist || stats.firstBloodKill,
    GET_DOUBLEKILL: () =>
      ensureHas(stats, ['doubleKills']) &&
      stats.doubleKills > 0,
    GET_TRIPLEKILL: () =>
      ensureHas(stats, ['tripleKills']) &&
      stats.tripleKills > 0,
    GET_QUADRA: () =>
      ensureHas(stats, ['quadraKills']) &&
      stats.quadraKills > 0,
    GET_PENTA: () =>
      ensureHas(stats, ['pentaKills']) &&
      stats.pentaKills > 0,
    MORE_THAN_X_ASSISTS: () =>
      ensureHas(stats, ['assists']) &&
      ensureHas(details, ['assists']) &&
      stats.assists >= details.assists,
    END_GAME_LEVEL_18: () =>
      ensureHas(stats, ['champLevel']) &&
      stats.champLevel == 18,
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
            SET "money" = "money" + "mu"."<%= curField %>"
            FROM (select "user", SUM("<%= curField %>") as "<%= curField %>" from "marketUsers" group by "user") mu
            WHERE "mu"."user" = "User"."id"
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

  MarketService.find({ query: { $limit: 1000, leagueGameId: match.matchId, leagueGameRegion: _.toLower(match.region) } })
    .then((markets) => markets.data)
    // Mark as inactive
    .then((markets) => Promise.all(_.map(markets, (market) =>
      MarketService.patch(market.id, {
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
