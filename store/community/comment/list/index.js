import moment from 'moment';
import { COMMUNITY_BOARD_GET_COMMENTS } from '~/store/mutation-types';

let axiosCancelSource = null;

const state = () => ({
  success: false,
  result: null,
  message: null,
  error: null,
  comment: [],
});

const mutations = {
  [COMMUNITY_BOARD_GET_COMMENTS](
    state,
    { success, result, message, error, comment }
  ) {
    state.success = success || false;
    state.result = result || null;
    state.message = message || null;
    state.error = error || null;
    state.comment = comment || [];
  },
  clear(state) {
    state.success = false;
    state.result = null;
    state.message = null;
    state.error = null;
    state.comment = [];
    state.loading = false;
  },
  setMessage(state, v) {
    state.result = v.result || null;
    state.message = v.msg || null;
  },
};

const actions = {
  async getComment({ commit }, { path, id }) {
    try {
      if (axiosCancelSource !== null) {
        await axiosCancelSource.cancel();
      }
      axiosCancelSource = await this.$axios.CancelToken.source();
      const response = await this.$axios.$get(
        `/api/bbs/view_comment.php?bo_table=${path}` + `&wr_id=${id}`,
        {
          cancelToken: axiosCancelSource.token,
        }
      );
      const { result, msg, data } = response;
      const success = result === 'OK';
      console.log('data.list:', data.list);
      commit(COMMUNITY_BOARD_GET_COMMENTS, {
        success,
        message: success ? null : msg,
        comment: success ? data.list.map((item) => parseComment(item)) : null,
      });
    } catch (e) {
      if (this.$axios.isCancel(e)) {
        return;
      }
      commit(COMMUNITY_BOARD_GET_COMMENTS, { success: false, error: e });
    }
  },
  async writeComment({ commit }, { path, id, commentId, wrContent, w }) {
    try {
      if (axiosCancelSource !== null) {
        await axiosCancelSource.cancel();
      }
      commit('setMessage', { result: null, msg: null });
      axiosCancelSource = await this.$axios.CancelToken.source();

      const formData = new FormData();
      formData.append('bo_table', path);
      formData.append('wr_id', id);
      formData.append('comment_id', commentId);
      formData.append('wr_content', wrContent);
      formData.append('w', w);

      const response = await this.$axios.$post(
        '/api/bbs/write_comment_update.php',
        formData,
        {
          cancelToken: axiosCancelSource.token,
        }
      );
      const { result, msg } = response;
      commit('setMessage', { result, msg });
    } catch (e) {
      if (this.$axios.isCancel(e)) {
        return;
      }
      commit(COMMUNITY_BOARD_GET_COMMENTS, { success: false, error: e });
    }
  },
  async deleteComment({ commit }, { path, wrId }) {
    try {
      if (axiosCancelSource !== null) {
        await axiosCancelSource.cancel();
      }
      axiosCancelSource = await this.$axios.CancelToken.source();
      commit('setMessage', { result: null, msg: null });

      const response = await this.$axios.$get(
        `/api/bbs/delete_comment.php?bo_table=${path}` + `&comment_id=${wrId}`,
        {
          cancelToken: axiosCancelSource.token,
        }
      );
      const { result, msg } = response;
      commit('setMessage', { result, msg });
    } catch (e) {
      if (this.$axios.isCancel(e)) {
        return;
      }
      commit(COMMUNITY_BOARD_GET_COMMENTS, { success: false, error: e });
    }
  },
  clear({ commit }) {
    commit('clear');
  },
};

const parseComment = (data) => {
  return {
    ...data,
    wr_datetime: moment(data.wr_datetime, 'YYYY-MM-DD HH:mm:ss').toDate(),
  };
};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
};
