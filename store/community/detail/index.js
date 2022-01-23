import moment from 'moment';
import { COMMUNITY_GET_BOARD } from '~/store/mutation-types';

let axiosCancelSource = null;

const state = () => ({
  success: false,
  loading: false,
  result: null,
  message: null,
  error: null,
  data: {},
});

const mutations = {
  [COMMUNITY_GET_BOARD](state, { success, result, message, error, data }) {
    state.success = success || false;
    state.result = result || null;
    state.message = message || null;
    state.error = error || null;
    state.data = data || {};
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
    state.data = {};
    state.loading = false;
  },
};

const actions = {
  async getDetail({ commit, dispatch }, { path, id }) {
    commit('clear');
    commit('loading');
    await dispatch('_getDetail', { path, id });
  },
  async fetch({ commit, dispatch }, { path, id }) {
    await dispatch('_getDetail', { path, id });
  },
  async _getDetail({ commit }, { path, id }) {
    try {
      if (axiosCancelSource !== null) {
        await axiosCancelSource.cancel();
      }
      axiosCancelSource = await this.$axios.CancelToken.source();
      const response = await this.$axios.$get(
        `/api/bbs/board.php?bo_table=${path}` + `&wr_id=${id}`,
        {
          cancelToken: axiosCancelSource.token,
        }
      );
      const { result, msg, data } = response;
      const success = result === 'OK';
      commit(COMMUNITY_GET_BOARD, {
        success,
        message: success ? null : msg,
        data: success ? parseDetail(data.view) : null,
      });
    } catch (e) {
      if (this.$axios.isCancel(e)) {
        return;
      }
      commit(COMMUNITY_GET_BOARD, { success: false, error: e });
    }
  },
  clear({ commit }) {
    commit('clear');
  },
};

const parseDetail = (detail) => {
  const replyCountStr = detail.reply_cnt;
  console.log('replyCountStr', replyCountStr);
  let replyCnt = 0;
  if (replyCountStr) {
    replyCnt = replyCountStr.length > 0 ? parseInt(replyCountStr) : 0;
  }
  return {
    ...detail,
    id: parseInt(detail.wr_id),
    datetime: moment(detail.wr_datetime, 'YYYY-MM-DD HH:mm:ss').toDate(),
    is_my: detail.is_my && detail.is_my !== null ? detail.is_my : false,
    reply_cnt: replyCnt,
    files: Object.values(detail.file).filter((file) => {
      return file.file ? file.file.length > 0 : false;
    }),
    wr_10:
      detail.wr_10 === null
        ? null
        : detail.wr_10.length <= 0
        ? null
        : detail.wr_10,
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
