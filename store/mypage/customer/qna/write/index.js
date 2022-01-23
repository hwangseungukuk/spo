import { MY_PAGE_WRITE_MY_QUESTION } from '~/store/mutation-types';

let axiosCancelSource = null;

const state = () => ({
  success: false,
  message: null,
  error: null,
  id: null,
});

const mutations = {
  [MY_PAGE_WRITE_MY_QUESTION](state, { success, message, error, id }) {
    state.success = success || false;
    state.message = message || null;
    state.error = error || null;
    state.id = id || null;
  },
  clear(state) {
    state.success = false;
    state.message = null;
    state.error = null;
    state.id = null;
  },
};

const actions = {
  async write(
    { commit },
    {
      id,
      category,
      email,
      contact,
      subject,
      contents,
      bets,
      files,
      originFiles,
    }
  ) {
    try {
      if (axiosCancelSource !== null) {
        await axiosCancelSource.cancel();
      }
      axiosCancelSource = await this.$axios.CancelToken.source();
      const formData = new FormData();
      formData.append('qa_html', 1);
      formData.append('qa_category', category);
      formData.append('qa_email', email);
      formData.append('qa_hp', contact);
      formData.append('qa_subject', subject);
      formData.append('qa_content', contents);
      if (bets !== null && bets.length > 0) {
        formData.append('qa_score', bets);
      }
      if (id) {
        formData.append('w', 'u');
        formData.append('qa_id', id);
      }
      for (let i = 0; i < files.length; i++) {
        formData.append(`bf_file[${i + 1}]`, files[i]);
      }
      // for (let i = 0; i < originFiles.length; i++) {
      //   const originFile = originFiles[i];
      //   if (originFile.deleted) {
      //     formData.append(`bf_file_del[${originFile.index}]`, 1);
      //   }
      // }

      // 첨부파일 삭제
      for (let i = 0; i < originFiles.length; i++) {
        let bfFileDel = 0;
        if (originFiles[i].deleted) {
          bfFileDel = 1;
        }
        formData.append(`bf_file_del[${i + 1}]`, bfFileDel);
      }

      const response = await this.$axios.$post(
        '/api/bbs/qawrite_update2.php',
        formData,
        {
          cancelToken: axiosCancelSource.token,
        }
      );
      const { result, msg, data } = response;
      const success = result === 'OK';
      commit(MY_PAGE_WRITE_MY_QUESTION, {
        success,
        message: success ? null : msg,
        id: success ? data.qa_id : null,
      });
    } catch (error) {
      commit(MY_PAGE_WRITE_MY_QUESTION, { success: false, error });
      console.error(error);
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
