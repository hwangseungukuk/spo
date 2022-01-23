import moment from 'moment';
import { GET_LIVE_SCHEDULE } from '~/store/mutation-types';

const state = () => ({
  success: false,
  loading: false,
  error: null,
  items: [],
});

const mutations = {
  [GET_LIVE_SCHEDULE](state, { success, error, list }) {
    state.success = success || false;
    state.error = error || null;
    state.items = list || [];
    state.loading = false;
  },
  loading(state) {
    state.loading = true;
  },
  clear(state) {
    state.success = false;
    state.loading = false;
    state.error = null;
    state.items = [];
  },
};

let axiosCancelSource = null;

const parseItem = (item) => {
  return {
    ...item,
    MatchDate: moment(item.MatchDate, moment.ISO_8601).toDate(),
  };
};

const actions = {
  async getSchedule({ commit }, date) {
    try {
      if (axiosCancelSource !== null) {
        await axiosCancelSource.cancel();
      }
      axiosCancelSource = await this.$axios.CancelToken.source();
      commit('clear');
      commit('loading');
      const result = await this.$axios.$get(
        `${process.env.SRS_CURRENT_URL}/LiveSchedule/0/${this.$moment(
          date
        ).format('YYYY-MM-DD')}`,
        {
          cancelToken: axiosCancelSource.token,
        }
      );
      commit(GET_LIVE_SCHEDULE, {
        success: true,
        list: result
          // .filter((item) => item.MatchStatusCode === 0)
          .map((item) => parseItem(item)),
      });
    } catch (e) {
      if (this.$axios.isCancel(e)) {
        return;
      }
      console.error(e);
      commit(GET_LIVE_SCHEDULE, { error: e });
    }
  },
  clear({ commit }) {
    commit('clear');
  },
};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
};
