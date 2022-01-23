import moment from 'moment';
import { MY_PAGE_GET_MY_QUESTION } from '~/store/mutation-types';

let axiosCancelSource = null;

const state = () => ({
  success: false,
  message: null,
  error: null,
  detail: {},
  answer: null,
  loading: false,
});

const mutations = {
  [MY_PAGE_GET_MY_QUESTION](
    state,
    { success, message, error, detail, answer }
  ) {
    state.success = success || false;
    state.message = message || null;
    state.error = error || null;
    state.detail = detail || {};
    state.answer = answer || null;
    state.loading = false;
  },
  loading(state) {
    state.loading = true;
  },
  clear(state) {
    state.success = false;
    state.message = null;
    state.error = null;
    state.detail = {};
    state.answer = null;
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
        `/api/bbs/qaview.php?qa_id=${id}`,
        {
          cancelToken: axiosCancelSource.token,
        }
      );
      const { result, msg, data } = response;
      const success = result === 'OK';
      const detail = success ? parseDetail(data.view) : {};
      const answer =
        detail.qa_status && detail.qa_status !== 0
          ? parseDetail(data.answer)
          : null;
      commit(MY_PAGE_GET_MY_QUESTION, {
        success,
        message: success ? null : msg,
        detail,
        answer,
      });
    } catch (error) {
      commit(MY_PAGE_GET_MY_QUESTION, { success: false, error });
      console.log(error);
    }
  },
  clear({ commit }) {
    commit('clear');
  },
};

const parseDetail = (item) => {
  if (item === null) {
    return null;
  }
  let files = [];
  if (item.qa_file1.length > 0) {
    files = [
      ...files,
      {
        index: 0,
        file: item.qa_file1,
        name: item.qa_source1,
        deleted: false,
      },
    ];
  }
  if (item.qa_file2.length > 0) {
    files = [
      ...files,
      {
        index: 1,
        file: item.qa_file2,
        name: item.qa_source2,
        deleted: false,
      },
    ];
  }
  return {
    ...item,
    qa_id: parseInt(item.qa_id),
    qa_parent: parseInt(item.qa_parent),
    qa_related: parseInt(item.qa_related),
    qa_status: parseInt(item.qa_status),
    qa_datetime: moment(item.qa_datetime, 'YYYY-MM-DD HH:mm:ss').toDate(),
    files,
  };
};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
};
