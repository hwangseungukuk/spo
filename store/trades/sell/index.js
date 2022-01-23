import moment from 'moment';
import {
  CANCEL_BETTING_FOLDER,
  TRADES_SELL_GET_LIST,
  TRADES_SELL_GET_LIST_DETAIL,
  TRADES_SELL_POST_SALE,
} from '~/store/mutation-types';

let axiosCancelSource = null;

const ITEM_SIZE = 20;

const state = () => ({
  hasList: false,
  success: false,
  result: null,
  drawId: null,
  message: null,
  error: null,
  items: [],
  details: [],
  totalItems: 0,
  loading: false,
  fetching: false,
});

const mutations = {
  [TRADES_SELL_GET_LIST](state, { hasList, message, items, totalItems }) {
    state.hasList = hasList;
    state.message = message || null;
    state.items = items || [];
    state.totalItems = totalItems || 0;
    state.loading = false;
  },
  [TRADES_SELL_GET_LIST_DETAIL](state, { success, message, error, details }) {
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
    if (state.items.length <= 0) {
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
  setMessage(state, v) {
    state.result = v.result || null;
    state.drawId = v.drawId || null;
    state.message = v.msg || null;
  },
};

const getters = {
  getDrawIdItems: (state) => (drawIds) => {
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
  async getList(
    { commit },
    { searchDate, searchStart, searchEnd, page, pageRowNum }
  ) {
    try {
      if (axiosCancelSource !== null) {
        await axiosCancelSource.cancel();
      }
      axiosCancelSource = await this.$axios.CancelToken.source();
      commit('clearItems');
      commit('loading');
      console.log(
        'trade.list.console.log:',
        `/api/trade/sell.php?search_date=${searchDate}` +
          `&search_start=${searchStart || ''}` +
          `&search_end=${searchEnd || ''}` +
          `&page=${page || 1}` +
          `&page_row_num=${pageRowNum || ITEM_SIZE}`
      );
      const response = await this.$axios.$get(
        `/api/trade/sell.php?search_date=${searchDate}` +
          `&search_start=${searchStart || ''}` +
          `&search_end=${searchEnd || ''}` +
          `&page=${page || 1}` +
          `&page_row_num=${pageRowNum || ITEM_SIZE}`,
        {
          cancelToken: axiosCancelSource.token,
        }
      );
      const { result, msg, data } = response;
      const success = result === 'OK';
      console.log('data.list:', data.list, data.count[0].Count);
      commit(TRADES_SELL_GET_LIST, {
        hasList: success,
        message: success ? null : msg,
        items: success ? data.list : [],
        totalItems: success ? data.count[0].Count : 0,
      });
    } catch (e) {
      if (this.$axios.isCancel(e)) {
        return;
      }
      console.error(e);
      commit(TRADES_SELL_GET_LIST, { success: false, error: e });
    }
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
      commit(TRADES_SELL_GET_LIST_DETAIL, {
        success,
        message: success ? null : msg,
        details: success
          ? data.data.map((item) => {
              return {
                ...item,
                DrawId: parseInt(item.DrawId),
                DateDrawn: moment(item.DateDrawn, dateFormat).toDate(),
                MatchDate: moment(item.MatchDate, dateFormat).toDate(),
                MatchDateKor: moment(item.MatchDate, dateFormat)
                  .add(9, 'hours')
                  .toDate(),
                AllottedValue:
                  item.AllottedValue === 'None'
                    ? null
                    : parseFloat(item.AllottedValue),
                Odd_C: item.Odd_C === null ? null : parseFloat(item.Odd_C),
                Odd_L: parseFloat(item.Odd_L),
                Odd_R: parseFloat(item.Odd_R),
                SportId: parseInt(item.SportId),
                TournamentId: parseInt(item.TournamentId),
                MatchStatusCode: parseInt(item.MatchStatusCode),
                HomeTeam_Score: parseInt(item.HomeTeam_Score),
                AwayTeam_Score: parseInt(item.AwayTeam_Score),
              };
            })
          : null,
      });
    } catch (error) {
      commit(TRADES_SELL_GET_LIST_DETAIL, { success: false, error });
    }
  },
  async tradesSell({ commit }, { mode, drawtype, drawid, sellprice, id }) {
    try {
      if (axiosCancelSource !== null) {
        await axiosCancelSource.cancel();
      }
      axiosCancelSource = await this.$axios.CancelToken.source();
      commit('setMessage', { result: null, drawId: null, msg: null });
      const formData = new FormData();
      formData.append('mode', mode);
      formData.append('drawtype', drawtype);
      formData.append('drawid', drawid);
      formData.append('sellPrice', sellprice);
      // formData.append('id', id);

      const response = await this.$axios.$post(
        '/api/trade/proc.php',
        formData,
        {
          cancelToken: axiosCancelSource.token,
        }
      );
      const { result, msg } = response;
      commit('setMessage', { result, drawId: drawid, msg });
    } catch (e) {
      if (this.$axios.isCancel(e)) {
        return;
      }
      commit(TRADES_SELL_GET_LIST_DETAIL, { success: false, error: e });
    }
  },
  async clearAll({ commit }) {
    try {
      if (axiosCancelSource !== null) {
        await axiosCancelSource.cancel();
      }
    } finally {
      commit('clearAll');
    }
  },
};

export default {
  namespaced: true,
  state,
  mutations,
  getters,
  actions,
};
