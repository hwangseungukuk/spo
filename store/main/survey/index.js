import { GET_SURVEY_DATA } from '~/store/mutation-types';

let axiosCancelSource = null;

const state = () => ({
  success: false,
  message: null,
  error: null,
  list: [],
});

const mutations = {
  [GET_SURVEY_DATA](state, { success, message, error, list }) {
    state.success = success || false;
    state.message = message || null;
    state.error = error || null;
    state.list = list || [];
  },
  clear(state) {
    state.success = false;
    state.message = null;
    state.error = null;
    state.list = [];
  },
};

const actions = {
  async getSurvey({ commit }) {
    try {
      if (axiosCancelSource !== null) {
        await axiosCancelSource.cancel();
      }
      axiosCancelSource = await this.$axios.CancelToken.source();
      const response = await this.$axios.$get('/api/survey/survey.php', {
        cancelToken: axiosCancelSource.token,
      });
      const { result, msg, data } = response;
      const success = result === 'SUCCESS' || result === 'OK';
      const message = success ? null : msg;
      commit(GET_SURVEY_DATA, {
        success,
        message,
        list: success ? data.list : [],
      });
    } catch (e) {
      commit(GET_SURVEY_DATA, { error: e });
      console.error(e);
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
