import moment from 'moment';

export const parseCasualHistory = (item) => {
  const resultValue = parseInt(item.resultValue);
  const winRate = item.winRate !== null ? parseFloat(item.winRate) : 0;
  return {
    ...item,
    inning: parseInt(item.inning),
    insertDT: moment(item.insertDT, 'YYYY-MM-DD HH:mm:ss').toDate(),
    forecastValue: parseInt(item.forecastValue),
    resultValue,
    result: parseInt(item.result),
    winRate,
    spoGold: parseInt(item.spoGold),
    winSpoGold: item.winSpoGold !== null ? parseInt(item.winSpoGold) : 0,
    index: parseInt(item.userBettingIndex),
    succeeded: item.forecastValue === item.resultValue,
    status:
      resultValue === 999
        ? 'wait'
        : item.forecastValue === item.resultValue
        ? 'succeeded'
        : 'failed',
  };
};

export const parseHitgameHistory = (item) => {
  const dateFormat = 'YYYY-MM-DD HH:mm:ss';
  return {
    ...item,
    DrawId: parseInt(item.DrawId),
    DateDrawn: moment(item.DateDrawn, dateFormat).toDate(),
    MarketId: parseInt(item.MarketId),
    OutomeId: parseInt(item.OutomeId),
    MatchDate: moment(item.MatchDate, dateFormat).toDate(),
    MatchDateKor: moment(item.MatchDate, dateFormat).add(9, 'hours').toDate(),
    AllottedValue:
      item.AllottedValue === 'None' ? null : parseFloat(item.AllottedValue),
    Odd_C: item.Odd_C === null ? null : parseFloat(item.Odd_C),
    Odd_L: parseFloat(item.Odd_L),
    Odd_R: parseFloat(item.Odd_R),
    SportId: parseInt(item.SportId),
    Specifiers: item.Specifiers
      ? item.Specifiers.length > 0
        ? JSON.parse(item.Specifiers)
        : {}
      : {},
    TournamentId: parseInt(item.TournamentId),
    MatchStatusCode: parseInt(item.MatchStatusCode),
    HomeTeam_Score: parseInt(item.HomeTeam_Score),
    AwayTeam_Score: parseInt(item.AwayTeam_Score),
  };
};
