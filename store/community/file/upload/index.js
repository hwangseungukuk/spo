import { COMMUNITY_FILE_UPLOAD } from '~/store/mutation-types';

const state = () => ({
  success: false,
  message: null,
  error: null,
  uploading: false,
});

const mutations = {
  [COMMUNITY_FILE_UPLOAD](state, { success, message, error, url }) {
    state.success = success || false;
    state.message = message || null;
    state.error = error || null;
    state.uploading = false;
  },
  uploading(state) {
    state.uploading = true;
  },
  clear(state) {
    state.success = false;
    state.message = null;
    state.error = null;
    state.uploading = false;
  },
};

const actions = {
  async upload({ commit }, { file, callback }) {
    try {
      commit('clear');
      commit('uploading');
      const token = this.$auth.getToken('spolive');

      const formData = new FormData();
      formData.append('token', token);
      formData.append('files[]', file);
      const response = await this.$axios.$post('api/bbs/file.php', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      const { result, msg, data } = response;
      const success = result === 'OK';
      commit(COMMUNITY_FILE_UPLOAD, { success, message: success ? null : msg });
      if (success) {
        callback(file.name, data.files[0].url);
      }
    } catch (e) {
      if (this.$axios.isCancel(e)) {
        return;
      }
      commit(COMMUNITY_FILE_UPLOAD, { success: false, error: e });
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
