import { PMANG_USER_UNREGISTER } from '~/store/mutation-types';

const state = () => ({
  success: false,
  message: null,
  error: null,
});

const mutations = {
  [PMANG_USER_UNREGISTER](state, { success, message, error }) {
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

let axiosCancelSource = null;

const actions = {
  async unregister({ commit }, { selfCertToken }) {
    try {
      if (axiosCancelSource !== null) {
        await axiosCancelSource.cancel();
      }
      axiosCancelSource = await this.$axios.CancelToken.source();
      commit('clear');

      const formData = new FormData();
      formData.append('authToken', selfCertToken);
      const response = await this.$axios.$post(
        '/api/member/pmang_member_leave.php',
        formData,
        {
          cancelToken: axiosCancelSource.token,
        }
      );
      const { result, msg } = response;
      const success = result === 'SUCCESS' || result === 'OK';
      commit(PMANG_USER_UNREGISTER, {
        success,
        message: success ? null : msg,
      });
    } catch (e) {
      if (this.$axios.isCancel(e)) {
        return;
      }
      console.error(e);
      commit(PMANG_USER_UNREGISTER, { success: false, error: e });
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
