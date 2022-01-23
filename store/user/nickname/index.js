import { CHECK_DUPLICATE_NICKNAME } from '~/store/mutation-types';

const state = () => ({
  success: null,
  message: null,
  error: null,
});

const mutations = {
  [CHECK_DUPLICATE_NICKNAME](state, { success, message, error }) {
    state.success = success || false;
    state.message = message || null;
    state.error = error || null;
  },
  clear(state) {
    state.success = null;
    state.message = null;
    state.error = null;
  },
};

let axiosCancelSource = null;

const actions = {
  async check({ commit }, { nickname }) {
    try {
      if (axiosCancelSource !== null) {
        await axiosCancelSource.cancel();
      }
      axiosCancelSource = await this.$axios.CancelToken.source();
      commit('clear');
      const formData = new FormData();
      formData.append('mb_nick', nickname);

      const response = await this.$axios.$post(
        '/api/member/nick_check.php',
        formData,
        {
          cancelToken: axiosCancelSource.token,
        }
      );
      const { result, msg } = response;
      const success = result === 'SUCCESS' || result === 'OK';
      commit(CHECK_DUPLICATE_NICKNAME, {
        success,
        message: msg,
      });
    } catch (e) {
      if (this.$axios.isCancel(e)) {
        return;
      }
      console.error(e);
      commit(CHECK_DUPLICATE_NICKNAME, { success: false, error: e });
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
