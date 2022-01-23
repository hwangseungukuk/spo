import moment from 'moment';
import { MYPAGE_GET_HISTORY } from '~/store/mutation-types';

let axiosCancelSource = null;

const ITEM_SIZE = 20;

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
  [MYPAGE_GET_HISTORY](
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
  async getBoards({ commit }, { type, page, pageSize }) {
    try {
      if (axiosCancelSource !== null) {
        await axiosCancelSource.cancel();
      }
      axiosCancelSource = await this.$axios.CancelToken.source();
      commit('loading');
      const response = await this.$axios.$get(
        `/api/coin/spocoin.php?type=${type}` +
          `&page=${page}` +
          `&page_row_num=${pageSize}`,
        {
          cancelToken: axiosCancelSource.token,
        }
      );
      const { result, msg, data } = response;
      const success = result === 'OK';
      commit(MYPAGE_GET_HISTORY, {
        success,
        message: success ? null : msg,
        items: success ? parseList(data.list) : [],
        totalItems: success
          ? parseInt(data.total_count ? data.total_count : 0)
          : 0,
      });
    } catch (e) {
      if (this.$axios.isCancel(e)) {
        return;
      }
      console.error(e);
      commit(MYPAGE_GET_HISTORY, { success: false, error: e });
    }
  },
  clear({ commit }) {
    commit('clear');
  },
};

const parseList = (list) => {
  return list.map((item) => {
    return {
      ...item,
      od_time: moment(item.od_time, 'YYYY-MM-DD HH:mm:ss').toDate(),
    };
  });
};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
};
