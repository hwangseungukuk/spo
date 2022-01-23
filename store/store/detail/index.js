import { STORE_GET_BOARD } from '~/store/mutation-types';

let axiosCancelSource = null;

const state = () => ({
  success: false,
  result: null,
  message: null,
  error: null,
  data: null,
  loading: false,
});

const mutations = {
  [STORE_GET_BOARD](state, { success, result, message, error, data }) {
    state.success = success || false;
    state.result = result || null;
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
    state.result = null;
    state.message = null;
    state.error = null;
    state.data = null;
    state.loading = false;
  },
};

const actions = {
  async getDetail({ commit }, { id }) {
    try {
      if (axiosCancelSource !== null) {
        await axiosCancelSource.cancel();
      }
      axiosCancelSource = await this.$axios.CancelToken.source();
      commit('clear');
      commit('loading');
      const response = await this.$axios.$get(
        `/api/market/item.php?it_id=${id}`,
        {
          cancelToken: axiosCancelSource.token,
        }
      );
      const { result, msg, data } = response;
      const success = result === 'OK';
      console.log('data.item:', data.item);
      commit(STORE_GET_BOARD, {
        success,
        message: success ? null : msg,
        data: success ? parseDetail(data.item) : null,
      });
    } catch (e) {
      if (this.$axios.isCancel(e)) {
        return;
      }
      commit(STORE_GET_BOARD, { success: false, error: e });
    }
  },
  clear({ commit }) {
    commit('clear');
  },
};

const parseDetail = (detail) => {
  return {
    ...detail,
    id: parseInt(detail.it_id),
  };
};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
};
