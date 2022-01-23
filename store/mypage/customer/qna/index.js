import moment from 'moment';
import { MY_PAGE_GET_MY_QUESTIONS } from '~/store/mutation-types';

let axiosCancelSource = null;

const ITEM_SIZE = 20;

const state = () => ({
  success: false,
  message: null,
  error: null,
  items: [],
  categories: [],
  totalItems: 0,
  loading: false,
});

const mutations = {
  [MY_PAGE_GET_MY_QUESTIONS](
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
  loading(state) {
    state.loading = true;
  },
  clear(state) {
    state.success = false;
    state.message = null;
    state.error = null;
    state.categories = [];
    state.items = [];
    // state.totalItems = 0;
    state.loading = false;
  },
};

const actions = {
  async getList({ commit }, { page, pageSize, search }) {
    try {
      if (axiosCancelSource !== null) {
        await axiosCancelSource.cancel();
      }
      axiosCancelSource = await this.$axios.CancelToken.source();
      commit('clear');
      commit('loading');
      const response = await this.$axios.$get(
        `/api/bbs/qalist.php` +
          `?page=${page || 1}` +
          `&page_row_num=${pageSize || ITEM_SIZE}` +
          `&stx=${search || ''}`,
        {
          cancelToken: axiosCancelSource.token,
        }
      );
      const { result, msg, data } = response;
      const success = result === 'OK';
      commit(MY_PAGE_GET_MY_QUESTIONS, {
        success,
        message: success ? null : msg,
        categories: success ? data.categorys : [],
        items: success ? parseList(data.list) : [],
        totalItems: success ? parseInt(data.total_count) : 0,
      });
    } catch (error) {
      if (this.$axios.isCancel(error)) {
        return;
      }
      console.error(error);
      commit(MY_PAGE_GET_MY_QUESTIONS, { success: false, error });
    }
  },
  clear({ commit }) {
    commit('clear');
  },
};

const parseList = (items) => {
  return items.map((item) => {
    const hasFiles = item.qa_file1.length > 0 || item.qa_file2.length > 0;
    return {
      ...item,
      qa_id: parseInt(item.qa_id),
      qa_datetime: moment(item.qa_datetime, 'YYYY-MM-DD HH:mm:ss').toDate(),
      qa_status: parseInt(item.qa_status),
      qa_score: item.qa_score === null ? '' : item.qa_score,
      hasFiles,
    };
  });
};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
};
