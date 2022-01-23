import { CANCEL_BETTING_FOLDER } from '~/store/mutation-types';

let axiosCancelSource = null;

const state = () => ({
  success: false,
  message: null,
  error: null,
  items: [],
  from: null,
});

const mutations = {
  [CANCEL_BETTING_FOLDER](state, { success, error, message, items, from }) {
    state.success = success || false;
    state.message = message || null;
    state.error = error || null;
    state.items = items || [];
    state.from = from || null;
  },
  clear(state) {
    state.success = false;
    state.message = null;
    state.error = null;
    state.items = [];
    state.from = null;
  },
};

const getters = {
  isItemCanceled: (state) => (drawId) => {
    return state.items.find((item) => item.id === drawId).success;
  },
};

const actions = {
  async cancelItems({ commit }, { type, items, from }) {
    try {
      if (axiosCancelSource !== null) {
        await axiosCancelSource.cancel();
      }
      axiosCancelSource = await this.$axios.CancelToken.source();
      commit('clear');
      const formData = new FormData();
      formData.append('item_type', 'cancel');
      formData.append('drawtype', type);
      formData.append('drawid', items.join('/'));
      const response = await this.$axios.$post(
        '/api/betting/cancel.php',
        formData,
        {
          cancelToken: axiosCancelSource.token,
        }
      );
      const { result, msg, data } = response;
      const success = result === 'OK';
      let resultItems = [...items];
      resultItems = resultItems.map((item, index) => {
        const splited = item.split('|');
        let parseCode = parseInt(data.code[index]);
        if (!parseCode) {
          parseCode = -1;
        }
        return {
          type: splited[0],
          id: parseInt(splited[1]),
          success: parseCode > 0,
          code: data.code[index],
        };
      });
      commit(CANCEL_BETTING_FOLDER, {
        success,
        message: success ? null : msg,
        items: resultItems,
        from,
      });
      commit(
        `gamecenter/history/${CANCEL_BETTING_FOLDER}`,
        { success, items: resultItems },
        { root: true }
      );
      commit(
        `mypage/hitgame/${CANCEL_BETTING_FOLDER}`,
        { success, items: resultItems },
        { root: true }
      );
    } catch (error) {
      commit(CANCEL_BETTING_FOLDER, { success: false, error });
    }
  },
  clear({ commit }) {
    commit('clear');
  },
};

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions,
};
