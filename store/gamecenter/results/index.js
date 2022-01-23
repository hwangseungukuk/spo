import moment from 'moment';
import { GET_GAME_RESULTS } from '~/store/mutation-types';

import { parseItem } from '~/util/hitgame/result/parser';

let axiosCancelSource = null;

const state = () => ({
  success: false,
  message: null,
  error: null,
  loading: false,
  items: [],
});

const getters = {
  getResultsHasAnalysis: (state) => {
    return state.items.filter((item) => item.AnalysisUrl !== null);
  },
  getLeagueList: (state) => {
    const result = {};
    state.items.map(({ SportId, TournamentId }) => {
      if (!result[SportId]) {
        result[SportId] = [];
      }
      if (result[SportId].includes(TournamentId)) {
        return;
      }
      result[SportId] = [...result[SportId], TournamentId];
    });
    return result;
  },
  getSelectedSportItems: (state) => (SportId) => {
    return state.items.filter((item) => {
      return item.SportId === SportId;
    });
  },
  getSelectedLeaguesItems: (state) => ({ leagues, selectedAll }) => {
    const fLeagues = Object.values(leagues).flat();
    return state.items.filter(({ SportId, TournamentId }) => {
      return fLeagues.includes(TournamentId) || selectedAll[SportId];
    });
  },
};

const mutations = {
  [GET_GAME_RESULTS](state, { success, message, error, items }) {
    state.success = success || false;
    state.message = message || null;
    state.error = error || null;
    state.items = items || [];
    state.loading = false;
  },
  loading(state) {
    state.loading = true;
  },
  clear(state) {
    state.loading = false;
    state.success = false;
    state.message = null;
    state.error = null;
    state.items = [];
  },
};

const actions = {
  async getResults({ commit }, date) {
    let currentDate = date;
    if (currentDate === undefined || currentDate === null) {
      currentDate = new Date();
    }
    try {
      if (axiosCancelSource !== null) {
        await axiosCancelSource.cancel();
      }
      axiosCancelSource = await this.$axios.CancelToken.source();
      commit('clear');
      commit('loading');
      const result = await this.$axios.$get(
        `${process.env.SRS_CURRENT_URL}/Schedule/0/${this.$moment(date).format(
          'YYYY-MM-DD'
        )}`,
        {
          cancelToken: axiosCancelSource.token,
        }
      );
      commit(GET_GAME_RESULTS, {
        success: true,
        items: result
          .map((item) => parseItem(item))
          .filter((item) => {
            return (
              moment(item.MatchDate).format('YYYYMMDD') ===
              moment(currentDate).format('YYYYMMDD')
            );
          })
          .sort((a, b) => {
            return a.MatchDate.getTime() > b.MatchDate.getTime();
          }),
      });
    } catch (error) {
      commit(GET_GAME_RESULTS, { success: false, error });
    }
  },
};

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions,
};
