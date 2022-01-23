import {
  makeGameGroup,
  filterGames,
  parseGameItem,
} from '~/store/gamecenter/betting/list';
import {
  GET_SRS_GAME_LIST,
  CART_UPDATE_BETTING_ITEM,
} from '~/store/mutation-types';

const state = () => ({
  loading: false,
  games: [],
  leagues: {},
  subscribed: false,
});

const getters = {
  getGames: (state) => {
    let results = [];
    state.games.map((game) => {
      const foundIndex = results.findIndex((r, index) => {
        return (
          r.MatchDate.getTime() === game.MatchDate.getTime() &&
          r.TournamentId === game.TournamentId
        );
      });
      if (foundIndex >= 0) {
        results[foundIndex] = {
          ...results[foundIndex],
          games: [...results[foundIndex].games, game],
        };
      } else {
        results = [
          ...results,
          {
            MatchDate: game.MatchDate,
            TournamentId: game.TournamentId,
            SportId: game.SportId,
            games: [game],
          },
        ];
      }
    });
    return results;
  },
  getGameCount: (state, getters) => {
    if (state.loading) {
      return -1;
    }
    return getters.getGames.length;
  },
  getOpenedGames: (state, getters) => (timestamp) => {
    return getters.getGames.filter((result) => {
      return result.MatchDate.getTime() >= timestamp;
    });
  },
  getOpenedLeagues: (state, getters) => (timestamp) => {
    const result = {};
    getters.getOpenedGames(timestamp).map(({ SportId, TournamentId }) => {
      if (!result[SportId]) {
        result[SportId] = [];
      }
      if (result[SportId].includes(TournamentId)) {
        return;
      }
      result[SportId] = [...result[SportId], TournamentId];
      result[SportId].sort((a, b) => a - b);
    });
    return result;
  },
  getClosedGames: (state, getters) => (timestamp) => {
    return getters.getGames.filter((result) => {
      return result.MatchDate.getTime() < timestamp;
    });
  },
  getGamesByTagFilter: (state, getters) => ({ leagues, selectedAll }, date) => {
    const fLeagues = Object.values(leagues).flat();
    return getters.getOpenedGames(date).filter(({ SportId, TournamentId }) => {
      return fLeagues.includes(TournamentId) || selectedAll[SportId];
    });
  },
};

const mutations = {
  [GET_SRS_GAME_LIST](state, { games }) {
    state.games = makeGameGroup(state.games, games);
    state.subscribed = true;
    state.loading = false;
  },
  loading(state) {
    state.loading = true;
  },
  clear(state) {
    state.loading = false;
    state.games = [];
    state.subscribed = false;
  },
};

let listener = null;

const actions = {
  subscribe({ commit, dispatch }) {
    listener = (v) => {
      const result =
        v === null
          ? []
          : filterGames(
              v.map((item) => parseGameItem(item)),
              new Date()
            );
      commit(GET_SRS_GAME_LIST, {
        games: result,
      });
      result.map((r) => {
        commit(
          `gamecenter/betting/cart/${CART_UPDATE_BETTING_ITEM}`,
          { updated: { ...r } },
          {
            root: true,
          }
        );
      });
    };
    dispatch('gamecenter/betting/ws/subscribeSRSGameList', listener, {
      root: true,
    });
  },
  unsubscribe({ commit, dispatch }) {
    dispatch('gamecenter/betting/ws/unsubscribeSRSGameList', listener, {
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
