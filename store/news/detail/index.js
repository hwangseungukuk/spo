import moment from 'moment';
import { NEWS_GET_BOARD } from '~/store/mutation-types';

let axiosCancelSource = null;

const state = () => ({
  success: false,
  message: null,
  error: null,
  data: null,
  loading: false,
});

const mutations = {
  [NEWS_GET_BOARD](state, { success, message, error, data }) {
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
        `/api/bbs/board.php?bo_table=${path}` + `&wr_id=${id}`,
        {
          cancelToken: axiosCancelSource.token,
        }
      );
      const { result, msg, data } = response;
      const success = result === 'OK';
      commit(NEWS_GET_BOARD, {
        success,
        message: success ? null : msg,
        data: success ? parseDetail(data.view) : null,
      });
    } catch (e) {
      if (this.$axios.isCancel(e)) {
        return;
      }
      commit(NEWS_GET_BOARD, { success: false, error: e });
    }
  },
  clear({ commit }) {
    commit('clear');
  },
};

const parseDetail = (detail) => {
  return {
    ...detail,
    id: parseInt(detail.wr_id),
    datetime: moment(detail.wr_datetime, 'YYYY-MM-DD HH:mm:ss').toDate(),
    is_my: detail.is_my || false,
    prev: detail.next
      ? {
          ...detail.next,
        }
      : null,
    next: detail.prev
      ? {
          ...detail.prev,
        }
      : null,
  };
};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
};
