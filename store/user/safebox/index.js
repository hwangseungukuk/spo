import { USER_SAFEBOX_LOAD, USER_SAFEBOX_UPDATE } from '~/store/mutation-types';

let axiosCancelSource = null;

const state = () => ({
  loaded: false,
  success: false,
  message: null,
  error: null,
  gold: 0,
  safebox: 0,
  limited: 50000000000,
  requesting: false,
});

const mutations = {
  [USER_SAFEBOX_LOAD](
    state,
    { loaded, message, error, gold, safebox, limited }
  ) {
    state.loaded = loaded || false;
    state.message = message || null;
    state.error = error || null;
    state.gold = gold || 0;
    state.safebox = safebox || 0;
    state.limited = limited || 50000000000;
    state.requesting = false;
  },
  [USER_SAFEBOX_UPDATE](state, { success, message, error }) {
    state.success = success || false;
    state.message = message || null;
    state.error = error || null;
  },
  requesting(state, status = true) {
    state.requesting = status;
  },
  updateUserInfo(state, { safebox, gold }) {
    this.$auth.user.spoGold = gold;
    this.$auth.user.chest_gold = safebox;
  },
  setSuccessMessageDefault(state) {
    state.success = false;
    state.message = null;
  },
};

const actions = {
  async load({ commit }) {
    try {
      if (axiosCancelSource !== null) {
        await axiosCancelSource.cancel();
      }
      axiosCancelSource = await this.$axios.CancelToken.source();
      commit('setSuccessMessageDefault');
      const response = await this.$axios.$post('/api/goldchest/myinfo.php', {
        cancelToken: axiosCancelSource.token,
      });
      const { result, msg, data } = response;
      const loaded = result === 'OK';
      commit(USER_SAFEBOX_LOAD, {
        loaded,
        message: loaded ? null : msg,
        gold: data.spoGold,
        safebox: data.chestGold,
        limited: data.chestLimit,
      });
    } catch (e) {
      if (this.$axios.isCancel(e)) {
        return;
      }
      commit(USER_SAFEBOX_LOAD, { success: false, error: e });
    }
  },
  async update({ commit, dispatch }, { mode, gold }) {
    try {
      if (axiosCancelSource !== null) {
        await axiosCancelSource.cancel();
      }
      commit('requesting');
      axiosCancelSource = await this.$axios.CancelToken.source();
      commit('setSuccessMessageDefault');
      const formData = new FormData();
      formData.append('gold', gold);
      formData.append('mode', mode);
      const response = await this.$axios.$post(
        '/api/goldchest/proc.php',
        formData,
        {
          cancelToken: axiosCancelSource.token,
        }
      );
      const { result, msg } = response;
      const success = result === 'OK';
      commit(USER_SAFEBOX_UPDATE, {
        success,
        mode,
        target: gold,
        message: success ? null : msg,
      });
    } catch (e) {
      if (this.$axios.isCancel(e)) {
        return;
      }
      commit(USER_SAFEBOX_UPDATE, { success: false, error: e });
    }
  },
  updateUserInfo({ commit }, { safebox, gold }) {
    commit('updateUserInfo', { safebox, gold });
  },
  changeRequesting({ commit }, status) {
    commit('requesting', status);
  },
};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
};
