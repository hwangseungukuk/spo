import { USER_WRITE_MESSAGES } from '~/store/mutation-types';

let axiosCancelSource = null;

const state = () => ({
  success: false,
  message: null,
  error: null,
  requesting: false,
});

const mutations = {
  [USER_WRITE_MESSAGES](state, { success, error, message }) {
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
  async write({ commit }, { ids, memo }) {
    try {
      if (axiosCancelSource !== null) {
        await axiosCancelSource.cancel();
      }
      axiosCancelSource = await this.$axios.CancelToken.source();
      commit('clear');
      commit('requesting');
      const token = this.$auth.getToken('spolive');
      const formData = new FormData();
      formData.append('me_recv_mb_id', ids);
      formData.append('me_memo', memo);
      formData.append('token', token);
      const response = await this.$axios.$post('/api/memo/send.php', formData, {
        cancelToken: axiosCancelSource.token,
      });
      const { result, msg, data } = response;
      const success = result === 'OK';
      commit(USER_WRITE_MESSAGES, {
        success,
        message: msg,
      });
    } catch (e) {
      if (this.$axios.isCancel(e)) {
        return;
      }
      console.error(e);
      commit(USER_WRITE_MESSAGES, { success: false, error: e });
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
