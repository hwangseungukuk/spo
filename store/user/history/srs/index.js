import moment from 'moment';
import {
  CANCEL_BETTING_FOLDER,
  MODAL_BETTING_GET_HISTORIES,
  MODAL_BETTING_GET_HISTORY_DETAIL,
} from '~/store/mutation-types';

import { parseHitgameHistory } from '~/util/hitgame/betted/parser';

let axiosCancelSource = null;

const state = () => ({
  hasList: false,
  success: false,
  message: null,
  error: null,
  items: [],
  details: [],
  totalItems: 0,
  loading: false,
  fetching: false,
});

const mutations = {
  [MODAL_BETTING_GET_HISTORIES](
    state,
    { hasList, message, items, totalItems }
  ) {
    state.hasList = hasList || false;
    state.message = message || null;
    state.items = items || [];
    state.totalItems = totalItems || 0;
    state.loading = false;
  },
  [MODAL_BETTING_GET_HISTORY_DETAIL](
    state,
    { success, message, error, details }
  ) {
    state.success = success || false;
    state.message = message || null;
    state.error = error || null;
    state.fetching = false;
    state.details = details || [];
  },
  [CANCEL_BETTING_FOLDER](state, { success, items }) {
    if (!success) {
      return;
    }
    state.items = state.items.map((sItem) => {
      const item = items.find(
        (item) => sItem.DrawId === item.id && item.success
      );
      if (item) {
        return {
          ...sItem,
          DrawState: 'special',
          RefundingByUser: 1,
          Odd: 1,
          ExpectedWinSpoGold: sItem.SpoGold,
        };
      } else {
        return sItem;
      }
    });
    state.details = state.details.map((sDetail) => {
      const item = items.find(
        (item) => sDetail.DrawId === item.id && item.success
      );
      if (item) {
        return {
          ...sDetail,
          DrawState: 'refunding',
          RefundingByUser: 1,
        };
      } else {
        return sDetail;
      }
    });
  },
  loading(state) {
    state.loading = true;
  },
  fetching(state) {
    state.fetching = true;
  },
  clearItems(state) {
    state.loading = false;
    state.hasList = false;
    state.message = null;
    state.error = null;
    state.items = [];
  },
  clearDetail(state) {
    state.fetching = false;
    state.success = false;
    state.message = null;
    state.error = null;
    state.details = [];
  },
  clearAll(state) {
    state.hasList = false;
    state.success = false;
    state.message = null;
    state.error = null;
    state.items = [];
    state.details = [];
    state.totalItems = 0;
    state.loading = false;
    state.fetching = false;
  },
};

const getters = {
  getDrawIdItems: (state) => (drawIds) => {
    console.log(drawIds);
    const results = state.items.filter((sItem) => {
      return drawIds.some((drawId) => drawId === sItem.DrawId);
    });
    return results;
  },
  getDrawIdItemDetails: (state) => (drawId) => {
    return state.details.filter((item) => item.DrawId === drawId);
  },
};

const actions = {
  getList({ commit, dispatch }, { type, startAt, endAt, page, status }) {
    commit('clearItems');
    commit('loading');
    dispatch(
      'gamecenter/betting/ws/getHistories',
      {
        type,
        startAt,
        endAt,
        page,
        status,
        from: 'modal',
        pageSize: 8,
      },
      { root: true }
    );
  },
  async fetch({ state, commit }) {
    if (state.items.length <= 0) {
      return;
    }
    try {
      if (axiosCancelSource !== null) {
        await axiosCancelSource.cancel();
      }
      axiosCancelSource = await this.$axios.CancelToken.source();
      commit('clearDetail');
      commit('fetching');
      const itemArr = state.items.reduce(
        (arr, item) => (arr = [...arr, `${item.DrawType}/${item.DrawId}`]),
        []
      );
      const response = await this.$axios.$get(
        `/api/betting/hitlist.php?val=5::${itemArr.join()}`,
        {
          cancelToken: axiosCancelSource.token,
        }
      );
      const { result, msg, data } = response;
      const success = result === 'OK';
      const dateFormat = 'YYYY-MM-DD HH:mm:ss';
      commit(MODAL_BETTING_GET_HISTORY_DETAIL, {
        success,
        message: success ? null : msg,
        details: success
          ? data.data.map((item) => parseHitgameHistory(item))
          : null,
      });
    } catch (error) {
      commit(MODAL_BETTING_GET_HISTORY_DETAIL, { success: false, error });
    }
  },
  clearAll({ commit }) {
    commit('clearAll');
  },
};

export default {
  namespaced: true,
  state,
  mutations,
  getters,
  actions,
};
