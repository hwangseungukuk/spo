import { PMANG_USER_REGISTER } from '~/store/mutation-types';

const state = () => ({
  success: false,
  message: null,
  code: null,
  error: null,
});

const mutations = {
  async [PMANG_USER_REGISTER](state, { success, message, code, error, token }) {
    state.success = success || false;
    state.message = message || null;
    state.code = code || null;
    state.error = error || null;
    if (success) {
      await this.$auth.setToken('spolive', token);
      await this.$auth.fetchUser();
    }
  },
  clear(state) {
    state.success = false;
    state.message = null;
    state.error = null;
  },
};

let axiosCancelSource = null;

const actions = {
  async register(
    { commit },
    {
      selfCertToken,
      nickname,
      stipulation,
      privacy,
      operational,
      recommendId,
      mailling,
      sms,
      email,
    }
  ) {
    try {
      if (axiosCancelSource !== null) {
        await axiosCancelSource.cancel();
      }
      axiosCancelSource = await this.$axios.CancelToken.source();
      commit('clear');

      const formData = new FormData();
      formData.append('authToken', selfCertToken);
      formData.append('mb_nick', nickname);
      formData.append('stipulation', stipulation ? 1 : 0);
      formData.append('privacy', privacy ? 1 : 0);
      // formData.append('operational', operational ? 1 : 0);

      const response = await this.$axios.$post(
        '/api/member/pmang_register.php',
        formData,
        {
          cancelToken: axiosCancelSource.token,
        }
      );
      const { result, msg, data } = response;
      const success = result === 'SUCCESS' || result === 'OK';
      commit(PMANG_USER_REGISTER, {
        success,
        code: result,
        message: success ? null : msg,
        token: data ? data.token : null,
      });
    } catch (e) {
      if (this.$axios.isCancel(e)) {
        return;
      }
      console.error(e);
      commit(PMANG_USER_REGISTER, { success: false, error: e });
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
