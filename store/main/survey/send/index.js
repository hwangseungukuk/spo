import { SEND_SURVEY_DATA } from '~/store/mutation-types';

let axiosCancelSource = null;

const state = () => ({
  success: false,
  message: null,
  error: null,
  list: [],
});

const mutations = {
  [SEND_SURVEY_DATA](state, { success, message, error, list }) {
    state.success = success || false;
    state.message = message || null;
    state.error = error || null;
  },
  clear(state) {
    state.success = false;
    state.message = null;
    state.error = null;
  },
};

const actions = {
  // eslint-disable-next-line camelcase
  async send({ commit }, survey_answer) {
    try {
      if (axiosCancelSource !== null) {
        await axiosCancelSource.cancel();
      }
      axiosCancelSource = await this.$axios.CancelToken.source();

      const response = await this.$axios.$post(
        '/api/survey/survey_update.php',
        survey_answer,
        {
          cancelToken: axiosCancelSource.token,
        }
      );
      const { result, msg, data } = response;
      const success = result === 'SUCCESS' || result === 'OK';
      const message = success ? null : msg;
      commit(SEND_SURVEY_DATA, {
        success,
        message,
      });
    } catch (e) {
      commit(SEND_SURVEY_DATA, { error: e });
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
