import { USER_GET_MESSAGES } from '~/store/mutation-types';

let axiosCancelSource = null;

const state = () => ({
  success: false,
  message: null,
  error: null,
  data: null,
  loading: false,
});

const mutations = {
  [USER_GET_MESSAGES](state, { success, message, error, data }) {
    state.success = success || false;
    state.message = message || null;
    state.error = error || null;
    state.data = data || null;
    state.loading = false;
  },
  loading(state) {
    state.loading = true;
  },
  clear(state) {
    state.success = false;
    state.message = null;
    state.error = null;
    state.data = null;
    state.loading = false;
  },
};

const actions = {
  async getDetail({ commit }, { path, id }) {
    try {
      if (axiosCancelSource !== null) {
        await axiosCancelSource.cancel();
      }
      axiosCancelSource = await this.$axios.CancelToken.source();
      commit('loading');
      const response = await this.$axios.$get(
        `/api/memo/view.php?kind=${path}` + `&me_id=${id}`,
        {
          cancelToken: axiosCancelSource.token,
        }
      );
      const { result, msg, data } = response;
      console.log('memo:', data);
      const success = result === 'OK';
      commit(USER_GET_MESSAGES, {
        success,
        message: success ? null : msg,
        data: success ? parseDetail(data.memo, data.prev, data.next) : null,
      });
    } catch (e) {
      if (this.$axios.isCancel(e)) {
        return;
      }
      commit(USER_GET_MESSAGES, { success: false, error: e });
    }
  },
  clear({ commit }) {
    commit('clear');
  },
};

const parseDetail = (memo, pv, nt) => {
  return {
    ...memo,
    prev: Array.isArray(pv)
      ? null
      : {
          ...pv,
        },
    next: Array.isArray(nt)
      ? null
      : {
          ...nt,
        },
  };
};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
};
