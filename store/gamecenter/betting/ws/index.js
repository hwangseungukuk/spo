/* eslint-disable camelcase */
import io from 'socket.io-client';
import moment from 'moment';

import {
  WS_BETTING_CONNECTED,
  WS_BETTING_SPORTS_STATUS,
  CART_REQ_BETTING_GAMES,
  MY_PAGE_BETTING_GET_HISTORIES,
  GAME_CENTER_BETTING_GET_HISTORIES,
  TRADES_SELL_GET_LIST,
  MODAL_BETTING_GET_HISTORIES,
  GET_CANCELABLE_CART_ITEMS,
  FETCH_CANCELABLE_CART_ITEMS,
} from '~/store/mutation-types';

let socket = null;

const SOCKET_STATUS_CONNECTED = 'SOCKET_STATUS_CONNECTED';
const SOCKET_STATUS_CONNECTING = 'SOCKET_STATUS_CONNECTING';
const SOCKET_STATUS_DISCONNECTED = 'SOCKET_STATUS_DISCONNECTED';

const EMIT_KEY_GET_MAIN_GAME = 'FullMnMMainFixtureList';
const EMIT_KEY_GET_SRS_GAME = 'FullMnMFixtureList';
const EMIT_KEY_GET_SPECIAL_GAME = 'FullMnMSpecialFixtureList';

const EMIT_KEY_SUBSCRIBE = 'subscribe';

const ON_KEY_MNM = 'MnM';
const ON_KEY_MNM_MAIN = 'MnMMain';
const ON_KEY_MNM_SPECIAL = 'MnMSpecial';

const ON_KEY_GET_LIVE_GAMES = 'lobby';
const ON_KEY_GET_LIVE_GAME = 'detail';

const EMIT_GET_GAME_LIST_TIME = '+09:00';

const SOCKET_CONFIG = {
  path: process.env.BETTING_WS_URL_PATH,
  transports: ['websocket'],
  EIO: [3],
  reconnection: true,
  forceNew: true,
  reconnectionDelay: 1000,
  upgrade: false,
};

const state = () => ({
  status: SOCKET_STATUS_DISCONNECTED,
  callHistoryFrom: null,
  currentDate: null,
});

const mutations = {
  [WS_BETTING_CONNECTED](state, { status }) {
    state.status = status || false;
  },
  initCurrentDate(state) {
    state.currentDate = new Date();
  },
  setCallHistoryFrom(state, { from }) {
    state.callHistoryFrom = from || 'history';
  },
  updateUserGold(state, gold) {
    if (!this.$auth.loggedIn) {
      return;
    }
    this.$auth.user.spoGold = gold;
  },
};

const getters = {
  isConnected: (state) => {
    return state.status === SOCKET_STATUS_CONNECTED;
  },
  isConnecting: (state) => {
    return state.status === SOCKET_STATUS_CONNECTING;
  },
  isDisconnected: (state) => {
    return state.status === SOCKET_STATUS_DISCONNECTED;
  },
};

const actions = {
  connect({ state, getters, commit, rootGetters }) {
    if (getters.isConnected || getters.isConnecting) {
      return;
    }
    try {
      const token = this.$auth.getToken('spolive');
      const errorHandler = (error) => {
        commit(WS_BETTING_CONNECTED, {
          status: SOCKET_STATUS_DISCONNECTED,
        });
        console.error(error);
        return error;
      };
      commit(WS_BETTING_CONNECTED, {
        status: SOCKET_STATUS_CONNECTING,
      });
      if (socket === null) {
        socket = io.connect(process.env.BETTING_WS_URL, {
          ...SOCKET_CONFIG,
          query: {
            token,
          },
        });
      } else {
        socket.io.opts.query = `token=${token}`;
        socket.connect();
      }
      socket.on('connect', () => {
        commit(WS_BETTING_CONNECTED, { status: SOCKET_STATUS_CONNECTED });

        socket.on('error', errorHandler);
        socket.on('connect_error', errorHandler);
        socket.on('connect_failed', errorHandler);
        socket.on('reconnect_error', errorHandler);
        socket.on('reconnect_failed', errorHandler);
        socket.on('SpoGold', (gold) => {
          commit('updateUserGold', gold);
        });
        socket.on('disconnect', () => {
          commit(WS_BETTING_CONNECTED, { status: SOCKET_STATUS_DISCONNECTED });
          socket.removeAllListeners();
        });
        socket.on('DrawSRSResult', (v) => {
          commit(`gamecenter/betting/cart/${CART_REQ_BETTING_GAMES}`, v, {
            root: true,
          });
        });
        socket.on('DrawLiveOddsResult', (v) => {
          commit(`gamecenter/betting/cart/${CART_REQ_BETTING_GAMES}`, v, {
            root: true,
          });
        });
        socket.on('DrawHistoryGameType', (code, data) => {
          const hasList = code === 200;
          const result = {
            hasList,
            totalItems: data ? data.Count : 0,
            items: data ? data.Data : [],
          };
          if (state.callHistoryFrom === 'gamecenter') {
            commit(
              `gamecenter/history/${GAME_CENTER_BETTING_GET_HISTORIES}`,
              result,
              { root: true }
            );
            return;
          }
          if (state.callHistoryFrom === 'mypage') {
            commit(`mypage/hitgame/${MY_PAGE_BETTING_GET_HISTORIES}`, result, {
              root: true,
            });
            return;
          }
          if (state.callHistoryFrom === 'trades') {
            commit(`trades/sell/${TRADES_SELL_GET_LIST}`, result, {
              root: true,
            });
            return;
          }
          commit(`user/history/srs/${MODAL_BETTING_GET_HISTORIES}`, result, {
            root: true,
          });
        });
        socket.on('DrawHistoryCart', (code, data) => {
          const hasList = code === 200;
          commit(
            `gamecenter/betting/cart/cancel/${GET_CANCELABLE_CART_ITEMS}`,
            {
              hasList,
              items: data ? data.Data : [],
            },
            { root: true }
          );
        });
        socket.on('DrawHistoryDetail', (code, info, items) => {
          const hasDetail = code === 200;
          commit(
            `gamecenter/betting/cart/cancel/${FETCH_CANCELABLE_CART_ITEMS}`,
            {
              hasDetail,
              details: items,
            },
            { root: true }
          );
        });
      });
    } catch (e) {
      commit(WS_BETTING_CONNECTED, { status: SOCKET_STATUS_DISCONNECTED });
      if (socket !== null) {
        socket.disconnect();
        socket.close();
        socket.destroy();
      }
      console.error(e);
    }
  },
  disconnect({ commit }) {
    try {
      if (socket === undefined || socket === null) {
        return;
      }
      socket.disconnect();
      socket.close();
      socket.destroy();
      socket = null;
    } catch (e) {
      console.error(e);
    } finally {
      commit(WS_BETTING_CONNECTED, { status: SOCKET_STATUS_DISCONNECTED });
    }
  },
  draw({ state, dispatch }, { type, gold, items }) {
    if (state.status !== SOCKET_STATUS_CONNECTED) {
      dispatch('connect');
    }
    try {
      socket.emit(
        type || 'DrawSRS',
        [...items.map((item) => item.SRSMarketId)],
        [...items.map((item) => item.OutcomeId)],
        gold,
        0
      );
    } catch (e) {
      console.error(e);
    }
  },
  drawLive({ state, dispatch }, { gold, item }) {
    if (state.status !== SOCKET_STATUS_CONNECTED) {
      dispatch('connect');
    }
    console.log(item);
    const { MatchId, MarketId, OutcomeId, Rate, Specifiers } = item;
    try {
      socket.emit(
        'DrawLiveOdds',
        MatchId,
        MarketId,
        OutcomeId,
        Rate,
        Specifiers,
        gold,
        null
      );
    } catch (e) {
      console.error(e);
    }
  },
  getHistories(
    { state, dispatch, commit },
    { type, startAt, endAt, page, status, from, pageSize }
  ) {
    if (state.status !== SOCKET_STATUS_CONNECTED) {
      dispatch('connect');
    }
    try {
      commit('setCallHistoryFrom', { from });
      socket.emit(
        'DrawHistoryGameType',
        type,
        moment(startAt).format('YYYY-MM-DD'),
        moment(endAt).format('YYYY-MM-DD'),
        '+09:00',
        pageSize || 20,
        page,
        status
      );
    } catch (e) {
      console.error(e);
    }
  },
  getCartHistory({ state, dispatch, commit }, { date }) {
    if (state.status !== SOCKET_STATUS_CONNECTED) {
      dispatch('connect');
    }
    const dateStr = moment(date).format('YYYY-MM-DD');
    try {
      socket.emit('DrawHistoryCart', dateStr, dateStr, '+09:00', 9, 1, null);
    } catch (e) {
      console.error(e);
    }
  },
  getCartItemDetail({ state, dispatch, commit }, { type, id }) {
    if (state.status !== SOCKET_STATUS_CONNECTED) {
      dispatch('connect');
    }
    try {
      socket.emit('DrawHistoryDetailPro', type, id, 'cart');
    } catch (e) {
      console.error(e);
    }
  },
  subscribeMainGameList({ state, dispatch, commit }, listener) {
    if (state.status !== SOCKET_STATUS_CONNECTED) {
      dispatch('connect');
    }
    commit(`main/betting/loading`, null, { root: true });
    commit('initCurrentDate');
    try {
      socket.on(ON_KEY_MNM, listener);
      socket.emit(EMIT_KEY_GET_SRS_GAME, EMIT_GET_GAME_LIST_TIME);
      // socket.on(ON_KEY_MNM_MAIN, mainGameSubscibe);
      // socket.emit(EMIT_KEY_GET_MAIN_GAME, EMIT_GET_GAME_LIST_TIME);
    } catch (e) {
      console.error(e);
    }
  },
  unsubscribeMainGameList({ state }, listener) {
    if (state.status !== SOCKET_STATUS_CONNECTED || socket === null) {
      return;
    }
    socket.off(ON_KEY_MNM, listener);
    // socket.off(ON_KEY_MNM_MAIN, mainGameSubscibe);
  },
  subscribeSRSGameList({ state, dispatch, commit }, listener) {
    if (state.status !== SOCKET_STATUS_CONNECTED) {
      dispatch('connect');
    }
    commit(`gamecenter/betting/list/srs/loading`, null, { root: true });
    commit('initCurrentDate');
    try {
      socket.on(ON_KEY_MNM, listener);
      socket.emit(EMIT_KEY_GET_SRS_GAME, EMIT_GET_GAME_LIST_TIME);
    } catch (e) {
      console.error(e);
    }
  },
  unsubscribeSRSGameList({ state }, listener) {
    if (state.status !== SOCKET_STATUS_CONNECTED || socket === null) {
      return;
    }
    socket.off(ON_KEY_MNM, listener);
  },
  subscribeSpecialGameList({ state, dispatch, commit }, listener) {
    if (state.status !== SOCKET_STATUS_CONNECTED) {
      dispatch('connect');
    }
    commit(`gamecenter/betting/list/special/loading`, null, { root: true });
    commit('initCurrentDate');
    try {
      socket.on(ON_KEY_MNM_SPECIAL, listener);
      socket.emit(EMIT_KEY_GET_SPECIAL_GAME, EMIT_GET_GAME_LIST_TIME);
    } catch (e) {
      console.error(e);
    }
  },
  unsubscribeSpecialGameList({ state }, listener) {
    if (state.status !== SOCKET_STATUS_CONNECTED || socket === null) {
      return;
    }
    socket.off(ON_KEY_MNM_SPECIAL, listener);
  },
  subscribeLiveGameList({ state, commit, dispatch }, listener) {
    if (state.status !== SOCKET_STATUS_CONNECTED) {
      dispatch('connect');
    }
    commit(`gamecenter/betting/list/live/loading`, null, { root: true });
    try {
      socket.on(ON_KEY_GET_LIVE_GAMES, listener);
      socket.emit(EMIT_KEY_SUBSCRIBE, { MatchId: ON_KEY_GET_LIVE_GAMES });
    } catch (e) {
      console.error(e);
    }
  },
  unsubscribeLiveGameList({ state }, listener) {
    if (state.status !== SOCKET_STATUS_CONNECTED || socket === null) {
      return;
    }
    socket.off(ON_KEY_GET_LIVE_GAMES, listener);
  },
  subscribeLiveGameDetail({ state, commit, dispatch }, { listener, MatchId }) {
    if (state.status !== SOCKET_STATUS_CONNECTED) {
      dispatch('connect');
    }
    commit(`gamecenter/betting/list/live/detail/loading`, null, { root: true });
    try {
      socket.on(ON_KEY_GET_LIVE_GAME, listener);
      socket.emit(EMIT_KEY_SUBSCRIBE, { MatchId });
    } catch (e) {
      console.error(e);
    }
  },
  unsubscribeLiveGameDetail({ state }, listener) {
    if (state.status !== SOCKET_STATUS_CONNECTED || socket === null) {
      return;
    }
    socket.off(ON_KEY_GET_LIVE_GAME, listener);
  },
};

export default {
  namesapced: true,
  state,
  getters,
  mutations,
  actions,
};
