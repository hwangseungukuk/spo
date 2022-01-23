import moment from 'moment';
import { COMMUNITY_GET_HOME_BOARDS } from '~/store/mutation-types';

const state = () => ({
  success: false,
  message: null,
  error: null,
  items: [],
  loading: false,
});

let axiosCancelSource = null;

const mutations = {
  [COMMUNITY_GET_HOME_BOARDS](state, { success, message, error, items }) {
    state.success = success || false;
    state.message = message || null;
    state.error = error || null;
    state.items = items || [];
    state.loading = false;
  },
  clear(state) {
    state.loading = false;
    state.success = false;
    state.message = null;
    state.error = null;
    state.items = [];
  },
  loading(state) {
    state.loading = true;
  },
};

const actions = {
  async getBoards({ commit }, { path, pageSize }) {
    try {
      if (axiosCancelSource !== null) {
        await axiosCancelSource.cancel();
      }
      axiosCancelSource = await this.$axios.CancelToken.source();
      commit('loading');
      const response = await this.$axios.$get(
        `/api/bbs/board.php?bo_table=${path}` +
          `&page=1` +
          `&page_row_num=${pageSize || 5}`,
        {
          cancelToken: axiosCancelSource.token,
        }
      );
      const { result, msg, data } = response;
      const success = result === 'OK';
      commit(COMMUNITY_GET_HOME_BOARDS, {
        success,
        message: success ? null : msg,
        items: success
          ? data.list.map((item) => {
              return parseBoard(item);
            })
          : [],
      });
    } catch (e) {
      if (this.$axios.isCancel(e)) {
        return;
      }
      console.error(e);
      commit(COMMUNITY_GET_HOME_BOARDS, { success: false, error: e });
    }
  },
  clear({ commit }) {
    commit('clear');
  },
};

const parseBoard = (board) => {
  let linkCount = 0;
  if (board.wr_link1.length > 0) {
    linkCount += 1;
  }
  if (board.wr_link2.length > 0) {
    linkCount += 1;
  }
  return {
    ...board,
    wr_id: parseInt(board.wr_id),
    comments: parseInt(board.wr_comment),
    hits: parseInt(board.wr_hit),
    datetime: moment(board.wr_datetime, 'YYYY-MM-DD HH:mm:ss').toDate(),
    files: parseInt(board.wr_file),
    links: linkCount,
  };
};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
};
