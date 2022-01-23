const actions = {
  async delete({ commit }, { filename }) {
    try {
      const token = this.$auth.getToken('spolive');

      const formData = new FormData();
      formData.append('token', token);
      formData.append('file', filename);
      const response = await this.$axios.$delete('api/bbs/file.php', formData);
      const { result, msg, data } = response;
      const success = result === 'OK';
    } catch (e) {
      if (this.$axios.isCancel(e)) {
        return;
      }
      console.error(e);
    }
  },
};

export default {
  namespaced: true,
  actions,
};
