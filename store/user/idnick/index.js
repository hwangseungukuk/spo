import { USER_GET_NICKNAME } from '~/store/mutation-types';

let axiosCancelSource = null;

const state = () => ({
  nickname: null,
});

const mutations = {
  [USER_GET_NICKNAME](state, { nickname }) {
    console.log('getNickname:0', nickname);
    state.nickname = nickname || null;
  },
  clear(state) {
    state.nickname = null;
  },
};

const actions = {
  async getNickname({ commit }, { id }) {
    try {
      if (axiosCancelSource !== null) {
        await axiosCancelSource.cancel();
      }
      axiosCancelSource = await this.$axios.CancelToken.source();
      commit('clear');
      const response = await this.$axios.$get(
        `/api/member/id_nick_convert.php?id=${id}`,
        {
          cancelToken: axiosCancelSource.token,
        }
      );
      const { result } = response;
      commit(USER_GET_NICKNAME, {
        nickname: result,
      });
    } catch (e) {
      if (this.$axios.isCancel(e)) {
        return;
      }
      commit(USER_GET_NICKNAME, { nickname: null });
    }
  },
};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
};
