import {
  makeGameGroup,
  filterGames,
  parseGameItem,
} from '~/store/gamecenter/betting/list';
import {
  GET_MAIN_GAME_LIST,
  CART_UPDATE_BETTING_ITEM,
} from '~/store/mutation-types';

const state = () => ({
  loading: false,
  games: [],
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
  getGameCount: (state) => {
    if (state.loading) {
      return -1;
    }
    return state.games.length;
  },
  getOpenedGames: (state, getters) => (timestamp) => {
    return getters.getGames.filter((result) => {
      return result.MatchDate.getTime() >= timestamp;
    });
  },
  getClosedGames: (state, getters) => (timestamp) => {
    return getters.getGames.filter((result) => {
      return result.MatchDate.getTime() < timestamp;
    });
  },
};

const mutations = {
  [GET_MAIN_GAME_LIST](state, { games }) {
    state.games = makeGameGroup(state.games, games);
    state.loading = false;
    state.subscribed = true;
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
      commit(GET_MAIN_GAME_LIST, {
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
    dispatch('gamecenter/betting/ws/subscribeMainGameList', listener, {
      root: true,
    });
  },
  unsubscribe({ commit, dispatch }) {
    dispatch('gamecenter/betting/ws/unsubscribeMainGameList', listener, {
      root: true,
    });
  },
  clear({ dispatch, commit }) {
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
