/* eslint-disable camelcase */
import moment from 'moment';
import dummy from './live_dummy';
import {
  GET_LIVE_GAME_LIST,
  CART_UPDATE_BETTING_ITEM,
} from '~/store/mutation-types';

const makeTSLeagueGameGroup = (games) => {
  let result = {};
  games.map((game) => {
    const { MatchStatusCode, MatchDate, SportId, TournamentId } = game;
    if (MatchStatusCode >= 60 && MatchStatusCode <= 100) {
      return;
    }
    const status = MatchStatusCode === 0 ? 'wait' : 'active';
    if (!result[status]) {
      result = { ...result, [status]: {} };
    }
    const matchDateTime =
      MatchStatusCode === 0 ? MatchDate.getTime() : TournamentId;
    if (!result[status][matchDateTime]) {
      result[status][matchDateTime] = [];
    }
    const foundIndex = result[status][matchDateTime].findIndex((item) => {
      return item.TournamentId === TournamentId;
    });
    if (foundIndex >= 0) {
      result[status][matchDateTime][foundIndex].matches = [
        ...result[status][matchDateTime][foundIndex].matches,
        game,
      ];
    } else {
      result[status][matchDateTime] = [
        ...result[status][matchDateTime],
        {
          SportId,
          TournamentId,
          matches: [game],
        },
      ];
    }
  });
  return result;
};

const makeLeagueGameGroup = (games) => {
  const result = {};
  games.map((game) => {
    if (!result[game.TournamentId]) {
      result[game.TournamentId] = [];
    }
    result[game.TournamentId] = [...result[game.TournamentId], game];
  });
  return result;
};

const makeSportLeagueGameGroup = (games) => {
  const result = {};
  games.map((game) => {
    if (!result[game.SportId]) {
      result[game.SportId] = {};
    }
    if (!result[game.SportId][game.TournamentId]) {
      result[game.SportId][game.TournamentId] = [];
    }
    result[game.SportId][game.TournamentId] = [
      ...result[game.SportId][game.TournamentId],
      game,
    ];
  });
  return result;
};

const parseItem = (item) => {
  return {
    ...item,
    MatchDate: moment(item.MatchDate, 'YYYY-MM-DD HH:mm').toDate(),
    event_status: item.event_status
      ? parseEventStatus(item.event_status)
      : null,
    odds: item.odds ? item.odds.map((odd) => parseOdd(odd)) : null,
  };
};

const parseEventStatus = (es) => {
  return {
    ...es,
    away_score: parseInt(es.away_score),
    home_score: parseInt(es.home_score),
    match_status: parseInt(es.match_status),
    status: parseInt(es.status),
    reporting: parseInt(es.reporting),
    current_server: es.current_server ? parseInt(es.current_server) : null,
    period_scores: es.period_scores
      ? parsePeriodScores(es.period_scores)
      : null,
    period_scores_origin: es.period_scores,
  };
};

const parsePeriodScores = ({ period_score }) => {
  if (!period_score) {
    return null;
  }
  if (!Array.isArray(period_score) && Object.keys(period_score).length > 0) {
    return [
      {
        ...period_score,
        away_score: parseInt(period_score.away_score),
        home_score: parseInt(period_score.home_score),
        number: parseInt(period_score.number),
      },
    ];
  }
  const result = [
    ...period_score.map((score) => {
      return {
        ...score,
        away_score: parseInt(score.away_score),
        home_score: parseInt(score.home_score),
        number: parseInt(score.number),
      };
    }),
  ];
  result.sort((a, b) => {
    return b.number - a.number;
  });
  return result;
};

const parseOdd = (odd) => {
  return {
    ...odd,
    id: parseInt(odd.id),
    favourite: odd.favourite ? parseInt(odd.favourite) : null,
    alotted: odd.alotted ? (odd.alotted === '' ? null : odd.alotted) : null,
    specifiersOrigin: odd.specifiers ? odd.specifiers : null,
    specifiers: odd.specifiers ? parseSpecifiers(odd.specifiers) : null,
    outcome: odd.outcome
      ? odd.outcome.map((outcome) => ({
          ...outcome,
          active: parseInt(outcome.active),
          id: parseInt(outcome.id),
          odds: parseFloat(outcome.odds),
        }))
      : [],
  };
};

const parseSpecifiers = (specifiers) => {
  let result = {};
  const arr = specifiers.split('|');
  arr.map((i) => {
    const specifier = i.split('=');
    result = {
      ...result,
      [specifier[0]]: specifier[1],
    };
  });
  return result;
};

const state = () => ({
  connected: false,
  connecting: false,
  // games: [...dummy.map((d) => parseItem(d))],
  games: [],
  updateCart: false,
});

const mutations = {
  [GET_LIVE_GAME_LIST](state, { games }) {
    state.connected = true;
    state.connecting = false;
    state.games = [...games];
  },
  updateCart(state, { updateCart }) {
    console.log('update cart mutation');
    state.updateCart = updateCart;
  },
  loading(state) {
    state.connected = false;
    state.connecting = true;
  },
  clear(state) {
    state.connected = false;
    state.connecting = false;
    state.games = [];
    state.activeSports = [];
  },
};

const getters = {
  getGames: (state) => {
    return makeTSLeagueGameGroup(state.games);
  },
  getGame: (state) => (MatchId) => {
    const result = state.games.find((game) => game.MatchId === MatchId);
    if (!result) {
      return null;
    }
    return result;
  },
  getLiveGames: (state) => {
    return state.games.filter(({ MatchStatusCode }) => {
      return !(
        MatchStatusCode === 0 ||
        (MatchStatusCode >= 60 && MatchStatusCode <= 100)
      );
    });
  },
  getLiveGameGroup: (state, getters) => {
    return makeLeagueGameGroup(getters.getLiveGames);
  },
  getSelectedLeagueLiveGameGroup: (state, getters) => (leagues) => {
    const result = getters.getLiveGames.filter((game) => {
      return leagues.includes(game.TournamentId);
    });
    return makeTSLeagueGameGroup(result);
  },
  countOfGames: (state) => {
    return state.games.filter(({ MatchStatusCode }) => {
      return (
        MatchStatusCode === 0 || (MatchStatusCode < 60 && MatchStatusCode > 100)
      );
    }).length;
  },
  hasGames: (state, getters) => {
    return getters.countOfGames > 0;
  },
  countOfLiveGames: (state, getters) => {
    return getters.getLiveGames.length;
  },
  getRecommendGames: (state, getters) => {
    return getters.getLiveGames.filter((game) => game.MainMatch !== null);
  },
  getRecommendGameGroup: (state, getters) => {
    return makeLeagueGameGroup(getters.getRecommendGames);
  },
  getScheduledGames: (state) => {
    return state.games.filter((game) => game.MatchStatusCode === 0);
  },
  getScheduledGameGroup: (state, getters) => {
    return makeLeagueGameGroup(getters.getScheduledGames);
  },
  getSportGameGroup: (state, getters) => {
    return makeSportLeagueGameGroup(getters.getLiveGames);
  },
};

let listener = null;

const actions = {
  updateCart({ commit }, updateCart) {
    commit('updateCart', { updateCart });
    console.log('update cart action');
  },
  subscribe({ state, commit, dispatch }) {
    listener = (v) => {
      const parsed = JSON.parse(
        this.$LZString.decompressFromEncodedURIComponent(v)
      ); // decompressing data.
      const result = parsed.map((game) => parseItem(game));
      result.sort((a, b) => {
        return a.MatchDate.getTime() - b.MatchDate.getTime();
      });
      commit(GET_LIVE_GAME_LIST, {
        games: result,
      });
      if (!state.updateCart) {
        return;
      }
      result.map((r) => {
        commit(
          `gamecenter/betting/cart/${CART_UPDATE_BETTING_ITEM}`,
          { updated: { ...r, Odds: r.odds, odds: undefined } },
          {
            root: true,
          }
        );
      });
    };
    dispatch('gamecenter/betting/ws/subscribeLiveGameList', listener, {
      root: true,
    });
  },
  unsubscribe({ commit, dispatch }) {
    dispatch('gamecenter/betting/ws/unsubscribeLiveGameList', listener, {
      root: true,
    });
  },
  clear({ commit }) {
    commit('clear');
  },
};

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions,
};
