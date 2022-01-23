import moment from 'moment';
import { MYPAGE_GET_FAQ } from '~/store/mutation-types';

let axiosCancelSource = null;

const ITEM_SIZE = 20;

const state = () => ({
  success: false,
  message: null,
  error: null,
  items: [],
  totalItems: 0,
  loading: false,
});

const mutations = {
  [MYPAGE_GET_FAQ](state, { success, message, error, items, totalItems }) {
    state.success = success || false;
    state.message = message || null;
    state.error = error || null;
    state.items = items || [];
    state.totalItems = totalItems || 0;
    state.loading = false;
  },
  clear(state) {
    state.loading = false;
    state.success = false;
    state.message = null;
    state.error = null;
    state.items = [];
    state.totalItems = 0;
  },
  loading(state) {
    state.loading = true;
  },
};

const actions = {
  async getFaqs({ commit }, { status, stx, page, json }) {
    try {
      if (axiosCancelSource !== null) {
        await axiosCancelSource.cancel();
      }
      axiosCancelSource = await this.$axios.CancelToken.source();
      commit('loading');
      const response = await this.$axios.$get(
        `/api/bbs/faq.php?fm_id=${status || ''}` +
          `&stx=${stx || ''}` +
          `&page=${page || 1}` +
          `&page_row=${ITEM_SIZE}` +
          `&__OUTPUT=${json ? 'JSON' : ''}`,
        {
          cancelToken: axiosCancelSource.token,
        }
      );
      const { result, msg, data } = response;
      const success = result === 'OK';
      commit(MYPAGE_GET_FAQ, {
        success,
        message: success ? null : msg,
        items: success ? data.list : [],
        totalItems: success
          ? parseInt(data.total_count ? data.total_count : 0)
          : 0,
      });
    } catch (e) {
      if (this.$axios.isCancel(e)) {
        return;
      }
      console.error(e);
      commit(MYPAGE_GET_FAQ, { success: false, error: e });
    }
  },
  async clear({ commit }) {
    if (axiosCancelSource !== null) {
      await axiosCancelSource.cancel();
    }
    commit('clear');
  },
};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
};
