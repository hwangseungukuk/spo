import moment from 'moment';
import { USER_GET_MESSAGES } from '~/store/mutation-types';

let axiosCancelSource = null;

const ITEM_SIZE = 10;

const state = () => ({
  success: false,
  message: null,
  error: null,
  items: [],
  totalItems: 0,
  loading: false,
});

const mutations = {
  [USER_GET_MESSAGES](state, { success, message, error, items, totalItems }) {
    state.success = success || false;
    state.message = message || null;
    state.error = error || null;
    state.items = items || [];
    state.totalItems = totalItems || 0;
    state.loading = false;
  },
  clear(state) {
    state.loading = false;
    state.success = false;
    state.message = null;
    state.error = null;
    state.items = [];
    state.totalItems = 0;
  },
  loading(state) {
    state.loading = true;
  },
};

const actions = {
  async selectDelete({ commit }, { path, ids }) {
    try {
      // commit('loading');
      if (axiosCancelSource !== null) {
        await axiosCancelSource.cancel();
      }
      axiosCancelSource = await this.$axios.CancelToken.source();
      const token = this.$auth.getToken('spolive');
      const formData = new FormData();
      formData.append('token', token);
      formData.append('kind', path);

      for (let i = 0; i < ids.length; i++) {
        formData.append(`delIdx[${i}]`, ids[i]);
      }

      const response = await this.$axios.$post(
        'api/memo/delete.php',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
          cancelToken: axiosCancelSource.token,
        }
      );
      const { result, msg, data } = response;
      const success = result === 'OK';
    } catch (e) {
      if (this.$axios.isCancel(e)) {
        return;
      }
      console.error(e);
    }
  },
  async allDelete({ commit }, { path }) {
    try {
      // commit('loading');
      if (axiosCancelSource !== null) {
        await axiosCancelSource.cancel();
      }
      axiosCancelSource = await this.$axios.CancelToken.source();
      const token = this.$auth.getToken('spolive');
      const formData = new FormData();
      formData.append('token', token);
      formData.append('kind', path);
      formData.append('delIdx', 'all');

      const response = await this.$axios.$post(
        'api/memo/delete.php',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
          cancelToken: axiosCancelSource.token,
        }
      );
      const { result, msg, data } = response;
      const success = result === 'OK';
    } catch (e) {
      if (this.$axios.isCancel(e)) {
        return;
      }
      console.error(e);
    }
  },
  async getBoards({ commit }, { path, page, pagesize }) {
    try {
      if (axiosCancelSource !== null) {
        await axiosCancelSource.cancel();
      }
      axiosCancelSource = await this.$axios.CancelToken.source();
      commit('loading');
      const response = await this.$axios.$get(
        `/api/memo/list.php?kind=${path}` +
          `&page=${page || 1}` +
          `&page_row_num=${pagesize || ITEM_SIZE}`,
        {
          cancelToken: axiosCancelSource.token,
        }
      );
      const { result, msg, data } = response;
      const success = result === 'OK';
      commit(USER_GET_MESSAGES, {
        success,
        message: success ? null : msg,
        items: success
          ? data.list.map((item) => {
              return parseBoard(item);
            })
          : [],
        totalItems: success
          ? parseInt(data.total_count ? data.total_count : 0)
          : 0,
      });
    } catch (e) {
      if (this.$axios.isCancel(e)) {
        return;
      }
      console.error(e);
      commit(USER_GET_MESSAGES, { success: false, error: e });
    }
  },
  clear({ commit }) {
    commit('clear');
  },
};

const parseBoard = (board) => {
  return {
    ...board,
    wr_id: parseInt(board.wr_id),
    datetime: moment(board.wr_datetime, 'YYYY-MM-DD HH:mm:ss').toDate(),
  };
};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
};
