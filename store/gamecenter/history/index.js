import moment from 'moment';
import {
  CANCEL_BETTING_FOLDER,
  GAME_CENTER_BETTING_GET_HISTORIES,
  GAME_CENTER_BETTING_GET_HISTORY_DETAIL,
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
  [GAME_CENTER_BETTING_GET_HISTORIES](
    state,
    { hasList, message, items, totalItems }
  ) {
    state.hasList = hasList || false;
    state.message = message || null;
    state.items = items || [];
    state.totalItems = totalItems || 0;
    state.loading = false;
  },
  [GAME_CENTER_BETTING_GET_HISTORY_DETAIL](
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
          Odd: 1,
          ExpectedWinSpoGold: sItem.SpoGold,
        };
      } else {
        return sItem;
      }
    });
    state.details = state.details.map((sDetail) => {
      const item = items.filter(
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
        from: 'gamecenter',
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
      commit(GAME_CENTER_BETTING_GET_HISTORY_DETAIL, {
        success,
        message: success ? null : msg,
        details: success
          ? data.data.map((item) => parseHitgameHistory(item))
          : [],
      });
      // commit(GAME_CENTER_BETTING_GET_HISTORY_DETAIL, {
      //   success,
      //   message: success ? null : msg,
      //   details: success
      //     ? data.data.map((item) => {
      //         return {
      //           ...item,
      //           DrawId: parseInt(item.DrawId),
      //           DateDrawn: moment(item.DateDrawn, dateFormat).toDate(),
      //           MatchDate: moment(item.MatchDate, dateFormat).toDate(),
      //           MatchDateKor: moment(item.MatchDate, dateFormat)
      //             .add(9, 'hours')
      //             .toDate(),
      //           AllottedValue:
      //             item.AllottedValue === 'None'
      //               ? null
      //               : parseFloat(item.AllottedValue),
      //           Odd_C: item.Odd_C === null ? null : parseFloat(item.Odd_C),
      //           Odd_L: parseFloat(item.Odd_L),
      //           Odd_R: parseFloat(item.Odd_R),
      //           SportId: parseInt(item.SportId),
      //           TournamentId: parseInt(item.TournamentId),
      //           MatchStatusCode: parseInt(item.MatchStatusCode),
      //           HomeTeam_Score: parseInt(item.HomeTeam_Score),
      //           AwayTeam_Score: parseInt(item.AwayTeam_Score),
      //         };
      //       })
      //     : null,
      // });
    } catch (error) {
      commit(GAME_CENTER_BETTING_GET_HISTORY_DETAIL, { success: false, error });
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
