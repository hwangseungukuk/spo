import { COMMUNITY_BOARD_WRITE } from '~/store/mutation-types';

let axiosCancelSource = null;

const state = () => ({
  success: false,
  message: null,
  error: null,
  boardId: null,
  requesting: false,
});

const mutations = {
  [COMMUNITY_BOARD_WRITE](state, { success, error, boardId, message }) {
    state.requesting = false;
    state.success = success || false;
    state.message = message || null;
    state.error = error || null;
    state.boardId = boardId || null;
  },
  requesting(state) {
    state.requesting = true;
  },
  clear(state) {
    state.requesting = false;
    state.success = false;
    state.message = null;
    state.error = null;
    state.boardId = null;
  },
};

const actions = {
  async write(
    { commit },
    {
      path,
      id,
      mode,
      category,
      subject,
      contents,
      links,
      files,
      originFiles,
      bets,
    }
  ) {
    try {
      if (axiosCancelSource !== null) {
        await axiosCancelSource.cancel();
      }
      axiosCancelSource = await this.$axios.CancelToken.source();
      commit('clear');
      commit('requesting');
      const token = this.$auth.getToken('spolive');
      const formData = new FormData();
      if (id) {
        formData.append('wr_id', id);
      }
      formData.append('w', mode); // 수정 u, 답글 r
      if (category) {
        formData.append('ca_name', category);
      }
      formData.append('bo_table', path);
      formData.append('wr_subject', subject);
      formData.append('wr_content', contents);
      formData.append('token', token);
      formData.append('html', 'html1');
      for (let i = 0; i < links.length; i++) {
        formData.append(`wr_link${i + 1}`, links[i]);
      }

      // 첨부파일 삭제
      for (let i = 0; i < originFiles.length; i++) {
        let bfFileDel = 0;
        if (originFiles[i].deleted) {
          bfFileDel = 1;
        }
        formData.append(`bf_file_del[${i}]`, bfFileDel);
      }

      if (originFiles.length > 0) {
        for (let i = 0; i < files.length; i++) {
          formData.append(`bf_file[]`, files[i]);
        }
      } else {
        for (let i = 0; i < files.length; i++) {
          formData.append(`bf_file[${i}]`, files[i]);
        }
      }
      if (bets !== null && bets.length > 0) {
        formData.append('wr_10', bets);
      }
      const response = await this.$axios.$post(
        '/api/bbs/write_update.php',
        formData,
        {
          cancelToken: axiosCancelSource.token,
        }
      );
      const { result, msg, data } = response;
      const success = result === 'OK';
      commit(COMMUNITY_BOARD_WRITE, {
        success,
        message: success ? null : msg,
        boardId: success ? data.wr_id : null,
      });
    } catch (e) {
      if (this.$axios.isCancel(e)) {
        return;
      }
      console.error(e);
      commit(COMMUNITY_BOARD_WRITE, { success: false, error: e });
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
