/* eslint-disable camelcase */
export default {
  methods: {
    getRemainingTime(eventStatus) {
      if (!eventStatus || !eventStatus.clock) {
        return '';
      }
      const {
        remaining_time_live,
        remaining_time_in_period,
        match_time,
      } = eventStatus.clock;

      if (remaining_time_live) {
        return remaining_time_live;
      } else {
        return remaining_time_in_period || match_time;
      }
    },
    getHomeScore(eventStatus) {
      return eventStatus ? eventStatus.home_score : 0;
    },
    getAwayScore(eventStatus) {
      return eventStatus ? eventStatus.away_score : 0;
    },
    getHomeSetScore(eventStatus) {
      if (!eventStatus || eventStatus === null) {
        return 0;
      }
      const { period_scores } = eventStatus;
      if (period_scores === null || period_scores.length <= 0) {
        return 0;
      }
      return period_scores[0].home_score;
    },
    getAwaySetScore(eventStatus) {
      if (!eventStatus || eventStatus === null) {
        return 0;
      }
      const { period_scores } = eventStatus;
      if (period_scores === null || period_scores.length <= 0) {
        return 0;
      }
      return period_scores[0].away_score;
    },
    getEventStatusServer(eventStatus) {
      if (!eventStatus || eventStatus === null) {
        return 0;
      }
      const { current_server } = eventStatus;
      if (!current_server) {
        return null;
      }
      return current_server;
    },
    getSRSgame(odds) {
      if (!odds || odds === null) {
        return null;
      }
      const result = odds.find((odd) => {
        return (
          odd.id === 1 &&
          odd.status === 1 &&
          odd.outcome.length > 0 &&
          odd.outcome.some((c) => c.id === 1)
        );
      });
      if (result) {
        return result.outcome;
      }
      return null;
    },
    openMatchInfo(MatchId) {
      const options =
        'top=100, left=100, width=710, height=655, status=no, menubar=no, toolbar=no, resizable=no, scrollbars=no';
      const url = `https://s5.sir.sportradar.com/spolive/ko/match/${MatchId}`;
      window.open(url, 'spolive_match_info', options);
    },
  },
};
