import { STORE_GET_BOARDS } from '~/store/mutation-types';

let axiosCancelSource = null;

const ITEM_SIZE = 12;

const state = () => ({
  success: false,
  message: null,
  error: null,
  categories: [],
  items: [],
  totalItems: 0,
  loading: false,
});

const mutations = {
  [STORE_GET_BOARDS](
    state,
    { success, message, error, categories, items, totalItems }
  ) {
    state.success = success || false;
    state.message = message || null;
    state.error = error || null;
    state.categories = categories || [];
    state.items = items || [];
    state.totalItems = totalItems || 0;
    state.loading = false;
  },
  clear(state) {
    state.loading = false;
    state.success = false;
    state.message = null;
    state.error = null;
    state.categories = [];
    state.items = [];
    state.totalItems = 0;
  },
  loading(state) {
    state.loading = true;
  },
};

const actions = {
  async getBoards({ commit }, { id1, id2, field, page, listMod, listRow }) {
    try {
      if (axiosCancelSource !== null) {
        await axiosCancelSource.cancel();
      }
      axiosCancelSource = await this.$axios.CancelToken.source();
      commit('loading');
      const response = await this.$axios.$get(
        `/api/market/list.php?ca_id=${id1}` +
          `&ca_id2=${id2 || ''}` +
          `&ca_id3=${field || ''}` +
          `&page=${page || 1}` +
          `&list_mod=${listMod || 3}` +
          `&list_row=${listRow || 4}`,
        {
          cancelToken: axiosCancelSource.token,
        }
      );
      const { result, msg, data } = response;
      const success = result === 'OK';
      console.log('data.lists:', data.lists);
      commit(STORE_GET_BOARDS, {
        success,
        message: success ? null : msg,
        categories: data.category3 !== null ? data.category3 : [],
        items: success ? data.lists : [],
        totalItems: success
          ? parseInt(data.total_count ? data.total_count : 0)
          : 0,
      });
    } catch (e) {
      if (this.$axios.isCancel(e)) {
        return;
      }
      console.error(e);
      commit(STORE_GET_BOARDS, { success: false, error: e });
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
