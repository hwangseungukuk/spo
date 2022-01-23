import { STORE_BUY_ITEM } from '~/store/mutation-types';

let axiosCancelSource = null;

const state = () => ({
  success: false,
  result: null,
  type: null,
  msg: null,
  data: null,
  error: null,
});

const mutations = {
  [STORE_BUY_ITEM](state, { success, result, type, msg, data, error }) {
    state.success = success || false;
    state.result = result || null;
    state.type = type || null;
    state.msg = msg || null;
    state.data = data || null;
    state.error = error || null;
  },
  clear(state) {
    state.success = false;
    state.result = null;
    state.type = null;
    state.msg = null;
    state.data = null;
    state.error = null;
  },
};

const actions = {
  async buyItem({ commit }, { itId, qty }) {
    try {
      if (axiosCancelSource !== null) {
        await axiosCancelSource.cancel();
      }
      axiosCancelSource = await this.$axios.CancelToken.source();
      commit('clear');
      const formData = new FormData();
      formData.append('it_id', itId);
      formData.append('qty', qty);

      const response = await this.$axios.$post(
        '/api/market/buy.php',
        formData,
        {
          cancelToken: axiosCancelSource.token,
        }
      );
      const { result, type, msg } = response;
      commit('STORE_BUY_ITEM', { result, type, msg });
    } catch (e) {
      if (this.$axios.isCancel(e)) {
        return;
      }
      commit(STORE_BUY_ITEM, { success: false, error: e });
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
