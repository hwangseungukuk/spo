import moment from 'moment';
import { GAME_CENTER_BETTING_GET_CASUAL_HISTORIES } from '~/store/mutation-types';

import { parseCasualHistory } from '~/util/hitgame/betted/parser';

let axiosCancelSource = null;

const ITEM_SIZE = 20;

const state = () => ({
  success: false,
  message: null,
  error: null,
  items: [],
  loading: false,
  totalItems: 0,
});

const mutations = {
  [GAME_CENTER_BETTING_GET_CASUAL_HISTORIES](
    state,
    { success, message, error, items, totalItems }
  ) {
    console.log(items);
    state.success = success || false;
    state.message = message || null;
    state.error = error || null;
    state.items = items || [];
    state.totalItems = totalItems || 0;
    state.loading = false;
  },
  loading(state) {
    state.loading = true;
  },
  clear(state) {
    state.success = false;
    state.message = null;
    state.error = null;
    state.items = [];
    state.loading = false;
    state.totalItems = 0;
  },
};

const actions = {
  async getList({ commit }, { code, page, pageSize }) {
    try {
      if (axiosCancelSource !== null) {
        await axiosCancelSource.cancel();
      }
      axiosCancelSource = await this.$axios.CancelToken.source();
      commit('loading');
      const response = await this.$axios.$get(
        `/api/betting/casuallist.php` +
          `?gubun=${code}` +
          `&page_row_num=${pageSize || ITEM_SIZE}` +
          `&page=${page}` +
          `&start_date=1970-01-01`,
        {
          cancelToken: axiosCancelSource.token,
        }
      );
      const { result, msg, data } = response;
      const success = result === 'OK';
      commit(GAME_CENTER_BETTING_GET_CASUAL_HISTORIES, {
        success,
        message: success ? null : msg,
        items: success
          ? data.data.list.map((item) => parseCasualHistory(item))
          : [],
        totalItems: success ? parseInt(data.data.total) : 0,
      });
    } catch (error) {
      if (this.$axios.isCancel(error)) {
        return;
      }
      console.error(error);
      commit(GAME_CENTER_BETTING_GET_CASUAL_HISTORIES, {
        success: false,
        error,
      });
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
