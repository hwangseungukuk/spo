import { MYPAGE_CHANGE_INVENTORY } from '~/store/mutation-types';

let axiosCancelSource = null;

const state = () => ({
  success: false,
  message: null,
  error: null,
});

const mutations = {
  [MYPAGE_CHANGE_INVENTORY](state, { success, message, error, callback }) {
    state.success = success || false;
    state.message = message || null;
    state.error = error || null;
    if (callback) {
      callback(state.success);
    }
  },
  clear(state) {
    state.success = false;
    state.message = null;
  },
};

const actions = {
  async changeGameskins({ commit }, { mode, caId, skinIndex }) {
    try {
      if (axiosCancelSource !== null) {
        await axiosCancelSource.cancel();
      }
      axiosCancelSource = await this.$axios.CancelToken.source();
      commit('clear');
      const response = await this.$axios.$get(
        `/api/market/skin_change.php?mode=${mode}` +
          `&ca_id=${caId}` +
          `&skinIndex=${skinIndex}`,
        {
          cancelToken: axiosCancelSource.token,
        }
      );
      const { result, msg } = response;
      const success = result === 'OK';
      commit(MYPAGE_CHANGE_INVENTORY, {
        success,
        message: msg,
      });
    } catch (e) {
      if (this.$axios.isCancel(e)) {
        return;
      }
      console.error(e);
      commit(MYPAGE_CHANGE_INVENTORY, { success: false, error: e });
    }
  },
  async changeNicknames({ commit }, { itno, caid, mbnick, callback }) {
    try {
      if (axiosCancelSource !== null) {
        await axiosCancelSource.cancel();
      }
      axiosCancelSource = await this.$axios.CancelToken.source();
      commit('clear');
      const formData = new FormData();
      formData.append('it_no', itno);
      formData.append('ca_id', caid);
      formData.append('mb_nick', mbnick);
      formData.append('mode', 'nicknameupdate');

      const response = await this.$axios.$post(
        '/api/market/use.php',
        formData,
        {
          cancelToken: axiosCancelSource.token,
        }
      );
      const { result, msg } = response;
      const success = result === 'OK';
      commit(MYPAGE_CHANGE_INVENTORY, { success, message: msg, callback });
    } catch (e) {
      if (this.$axios.isCancel(e)) {
        return;
      }
      commit(MYPAGE_CHANGE_INVENTORY, { success: false, error: e });
    }
  },
  async useItems({ commit }, { itno, caid }) {
    try {
      if (axiosCancelSource !== null) {
        await axiosCancelSource.cancel();
      }
      axiosCancelSource = await this.$axios.CancelToken.source();
      commit('clear');
      const formData = new FormData();
      formData.append('it_no', itno);
      formData.append('ca_id', caid);

      const response = await this.$axios.$post(
        '/api/market/use.php',
        formData,
        {
          cancelToken: axiosCancelSource.token,
        }
      );
      const { result, msg } = response;
      const success = result === 'OK';
      commit(MYPAGE_CHANGE_INVENTORY, { success, message: msg });
    } catch (e) {
      if (this.$axios.isCancel(e)) {
        return;
      }
      commit(MYPAGE_CHANGE_INVENTORY, { success: false, error: e });
    }
  },
  async withdrawal({ commit }, { itno, itcnt }) {
    try {
      if (axiosCancelSource !== null) {
        await axiosCancelSource.cancel();
      }
      axiosCancelSource = await this.$axios.CancelToken.source();
      commit('clear');
      const formData = new FormData();
      formData.append('it_no', itno);
      formData.append('it_cnt', itcnt);

      const response = await this.$axios.$post(
        '/api/market/item_withdrawal.php',
        formData,
        {
          cancelToken: axiosCancelSource.token,
        }
      );
      const { result, msg } = response;
      const success = result === 'SUCCESS';
      commit(MYPAGE_CHANGE_INVENTORY, { success, message: msg });
    } catch (e) {
      if (this.$axios.isCancel(e)) {
        return;
      }
      commit(MYPAGE_CHANGE_INVENTORY, { success: false, error: e });
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
