import { USER_LOGIN } from '~/store/mutation-types';

const state = () => ({
  success: false,
  message: null,
  error: null,
  loggingIn: false,
});

const mutations = {
  [USER_LOGIN](state, { success, message, error }) {
    state.loggingIn = false;
    state.success = success || false;
    state.message = message || null;
    state.error = error || null;
  },
  loggingIn(state) {
    state.loggingIn = true;
  },
  clear(state) {
    state.loggingIn = false;
    state.success = false;
    state.message = null;
    state.error = null;
  },
};

const actions = {
  async login({ commit }, { id, password }) {
    try {
      commit('loggingIn');
      commit('clear');
      const formData = new FormData();
      formData.append('mb_id', id);
      formData.append('mb_password', password);
      const response = await this.$auth.loginWith('spolive', {
        data: formData,
      });
      const { result, msg } = response.data;
      const success = result === 'OK';
      if (success) {
        await this.$auth.fetchUser();
      }
      commit(USER_LOGIN, { success, message: success ? null : msg });
    } catch (e) {
      if (this.$axios.isCancel(e)) {
        return;
      }
      console.error(e);
      commit(USER_LOGIN, { success: false, error: e });
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
