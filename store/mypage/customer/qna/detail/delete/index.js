import { MY_PAGE_DELETE_MY_QUESTION } from '~/store/mutation-types';

let axiosCancelSource = null;

const state = () => ({
  success: false,
  message: null,
  error: null,
  deleting: false,
});

const mutations = {
  [MY_PAGE_DELETE_MY_QUESTION](state, { success, message, error }) {
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
  async delete({ commit }, { id }) {
    try {
      if (axiosCancelSource !== null) {
        await axiosCancelSource.cancel();
      }
      axiosCancelSource = await this.$axios.CancelToken.source();
      commit('clear');
      commit('deleting');
      const formData = new FormData();
      formData.append('qa_id', id);
      const response = await this.$axios.$post(
        `/api/bbs/qadelete.php`,
        formData,
        {
          cancelToken: axiosCancelSource.token,
        }
      );
      const { result, msg } = response;
      const success = result === 'OK';
      commit(MY_PAGE_DELETE_MY_QUESTION, {
        success,
        message: success ? null : msg,
      });
    } catch (e) {
      if (this.$axios.isCancel(e)) {
        return;
      }
      commit(MY_PAGE_DELETE_MY_QUESTION, { success: false, error: e });
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
