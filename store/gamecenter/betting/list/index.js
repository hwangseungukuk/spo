import moment from 'moment';

const ALLOTTED_VALUE_REGEX = /[A-Za-z+]{1,}/g;

const getAllottedValue = (allottedValue) => {
  if (!allottedValue || allottedValue === null) {
    return null;
  }
  try {
    const replaced = allottedValue.replace(ALLOTTED_VALUE_REGEX, '');
    if (replaced.length <= 0) {
      return null;
    } else {
      return parseFloat(replaced);
    }
  } catch (e) {
    return allottedValue;
  }
};

export const makeGameGroup = (stored, games, isSpecial) => {
  let results = [...stored];
  games.map((game) => {
    const resultIndex = results.findIndex((result) => {
      return result.id === game.id;
    });
    if (resultIndex >= 0) {
      let gameType = '';
      if (game.SRSMarketType.includes('handicap')) {
        gameType = 'handicaps';
      } else if (game.SRSMarketType.includes('total')) {
        gameType = 'totals';
      } else {
        gameType = 'ways';
      }
      const gameIndex = results[resultIndex][gameType].findIndex((betting) => {
        return isSpecial
          ? betting.BMatchId === game.BMatchId
          : betting.AllottedValue === game.AllottedValue;
      });
      if (gameIndex >= 0) {
        const updated = {
          ...results[resultIndex][gameType][gameIndex],
          ...game,
        };
        results[resultIndex][gameType][gameIndex] = updated;
      } else {
        const updated = {
          ...results[resultIndex],
          [gameType]: [...results[resultIndex][gameType], game],
        };
        results[resultIndex] = updated;
      }
      results[resultIndex][gameType] = results[resultIndex][gameType].filter(
        (game) => game.MatchStatusCode !== -1
      );
      results[resultIndex][gameType].sort(sortOddsGames);
    } else {
      const result = {
        id: game.id,
        TournamentId: game.TournamentId,
        MatchDate: game.MatchDate,
        HomeTeam_Name: game.HomeTeam_Name,
        HomeTeam_UniqueId: game.HomeTeam_UniqueId,
        AwayTeam_Name: game.AwayTeam_Name,
        AwayTeam_UniqueId: game.AwayTeam_UniqueId,
        BMatchId: game.BMatchId,
        SportId: game.SportId,
        SRSSpecialMarketType: game.SRSSpecialMarketType || null,
        MatchStatusCode: game.MatchStatusCode,
        MarketStatus: game.MarketStatus,
        ways: [],
        totals: [],
        handicaps: [],
      };
      if (game.SRSMarketType.includes('total')) {
        result.totals = [...result.totals, game].filter(
          (game) => game.MatchStatusCode !== -1
        );
      } else if (game.SRSMarketType.includes('handicap')) {
        result.handicaps = [...result.handicaps, game].filter(
          (game) => game.MatchStatusCode !== -1
        );
      } else {
        result.ways = [...result.ways, game].filter(
          (game) => game.MatchStatusCode !== -1
        );
      }
      const { ways, totals, handicaps } = result;
      if (ways.length <= 0 && totals.length <= 0 && handicaps.length <= 0) {
        return;
      }
      results = [...results, result];
    }
  });
  results.sort((a, b) => {
    return a.MatchDate.getTime() - b.MatchDate.getTime();
  });
  return results;
};

const sortOddsGames = (a, b) => {
  const absA = Math.abs(a.Odd_L - a.Odd_R);
  const absB = Math.abs(b.Odd_L - b.Odd_R);
  if (absA > absB) {
    return 1;
  }
  if (absA < absB) {
    return -1;
  }
  return 0;
};

export const filterGames = (games, currentDate) => {
  return games.filter((game) => {
    return game.MatchDate.getTime() >= currentDate.getTime();
  });
};

export const parseGameItem = (game) => {
  return {
    ...game,
    MatchDate: moment.utc(game.MatchDate).add(9, 'h').toDate(),
    AllottedValue: getAllottedValue(game.AllottedValue),
  };
};
