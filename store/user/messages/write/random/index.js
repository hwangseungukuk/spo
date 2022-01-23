import { USER_WRITE_RANDOM_MESSAGES } from '~/store/mutation-types';

let axiosCancelSource = null;

const state = () => ({
  success: false,
  message: null,
  error: null,
  requesting: false,
});

const mutations = {
  [USER_WRITE_RANDOM_MESSAGES](state, { success, error, message }) {
    state.requesting = false;
    state.success = success || false;
    state.message = message || null;
    state.error = error || null;
  },
  requesting(state) {
    state.requesting = true;
  },
  clear(state) {
    state.requesting = false;
    state.success = false;
    state.message = null;
    state.error = null;
  },
};

const actions = {
  async write({ commit }, { selectCount, memo }) {
    try {
      if (axiosCancelSource !== null) {
        await axiosCancelSource.cancel();
      }
      axiosCancelSource = await this.$axios.CancelToken.source();
      commit('clear');
      commit('requesting');
      const formData = new FormData();
      formData.append('send_cnt', selectCount);
      formData.append('me_memo', memo);
      const response = await this.$axios.$post(
        '/api/memo/send_random.php',
        formData,
        {
          cancelToken: axiosCancelSource.token,
        }
      );
      const { result, msg, data } = response;
      const success = result === 'OK';
      commit(USER_WRITE_RANDOM_MESSAGES, {
        success,
        message: msg,
      });
    } catch (e) {
      if (this.$axios.isCancel(e)) {
        return;
      }
      console.error(e);
      commit(USER_WRITE_RANDOM_MESSAGES, { success: false, error: e });
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
