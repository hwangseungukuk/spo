import { COMMUNITY_BOARD_DELETE } from '~/store/mutation-types';

let axiosCancelSource = null;

const state = () => ({
  success: false,
  message: null,
  error: null,
  deleting: false,
});

const mutations = {
  [COMMUNITY_BOARD_DELETE](state, { success, message, error }) {
    state.success = success || false;
    state.message = message || null;
    state.error = error || null;
    state.deleting = false;
  },
  deleting(state) {
    state.deleting = true;
  },
  clear(state) {
    state.success = false;
    state.message = null;
    state.error = null;
    state.deleting = false;
  },
};

const actions = {
  async delete({ commit }, { path, id }) {
    try {
      if (axiosCancelSource !== null) {
        await axiosCancelSource.cancel();
      }
      axiosCancelSource = await this.$axios.CancelToken.source();
      commit('clear');
      commit('deleting');
      const response = await this.$axios.$get(
        `/api/bbs/delete.php?bo_table=${path}&wr_id=${id}`,
        {
          cancelToken: axiosCancelSource.token,
        }
      );
      const { result, msg } = response;
      const success = result === 'OK';
      commit(COMMUNITY_BOARD_DELETE, {
        success,
        message: success ? null : msg,
      });
    } catch (e) {
      if (this.$axios.isCancel(e)) {
        return;
      }
      commit(COMMUNITY_BOARD_DELETE, { success: false, error: e });
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
