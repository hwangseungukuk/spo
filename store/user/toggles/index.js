import { USER_TOGGLE_OPTIONS } from '~/store/mutation-types';

let axiosCancelSource = null;

const state = () => ({
  success: false,
  message: null,
  error: null,
});

const mutations = {
  [USER_TOGGLE_OPTIONS](state, { success, error, message, chat, memo }) {
    state.success = success || false;
    state.error = error || null;
    state.message = message || null;
    this.$auth.user.mb_deny_chat = chat ? '1' : '';
    this.$auth.user.mb_deny_memo = memo ? '1' : '';
  },
  clear(state) {
    state.success = false;
    state.error = null;
    state.message = null;
  },
};

const actions = {
  async updateDeny({ commit }, { chat, memo }) {
    try {
      if (axiosCancelSource !== null) {
        await axiosCancelSource.cancel();
      }
      axiosCancelSource = await this.$axios.CancelToken.source();
      commit('clear');
      const formData = new FormData();
      formData.append('mb_deny_chat', chat ? '1' : '');
      formData.append('mb_deny_memo', memo ? '1' : '');
      const response = await this.$axios.$post(
        '/api/member/deny_update.php',
        formData,
        {
          cancelToken: axiosCancelSource.token,
        }
      );
      const { result, msg } = response;
      const success = result === 'OK';
      commit(USER_TOGGLE_OPTIONS, {
        success,
        message: success ? null : msg,
        chat,
        memo,
      });
    } catch (error) {
      commit(USER_TOGGLE_OPTIONS, { success: false, error });
    }
  },
};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
};
