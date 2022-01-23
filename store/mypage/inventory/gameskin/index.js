import moment from 'moment';
import { MYPAGE_GET_INVENTORY } from '~/store/mutation-types';

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
  [MYPAGE_GET_INVENTORY](
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
  async getBoards({ commit }, { status, page, listRow }) {
    try {
      if (axiosCancelSource !== null) {
        await axiosCancelSource.cancel();
      }
      axiosCancelSource = await this.$axios.CancelToken.source();
      commit('loading');
      const response = await this.$axios.$get(
        `/api/market/inventory.php?ca_id=${status}&page=${page || 1}&list_row=${
          listRow || 10000
        }`,
        {
          cancelToken: axiosCancelSource.token,
        }
      );
      const { result, msg, data } = response;
      const success = result === 'OK';
      commit(MYPAGE_GET_INVENTORY, {
        success,
        message: success ? null : msg,
        items: success ? data.items : [],
        totalItems: success
          ? parseInt(data.total_count ? data.total_count : 0)
          : 0,
      });
    } catch (e) {
      if (this.$axios.isCancel(e)) {
        return;
      }
      commit(MYPAGE_GET_INVENTORY, { success: false, error: e });
    }
  },
  async clear({ commit }) {
    if (axiosCancelSource !== null) {
      await axiosCancelSource.cancel();
    }
    commit('clear');
  },
};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
};
