import io from 'socket.io-client';
import {
  WS_CHATTING_CONNECTED,
  WS_CHATTING_UPDATE,
  WS_CHATTING_RECEIVE_MESSAGE,
  WS_CHATTING_ENTER_USER,
  WS_CHATTING_PROCESS,
} from '~/store/mutation-types';

let socket = null;

const SOCKET_CONFIG = {
  path: process.env.CHATTING_WS_URL_PATH,
  transports: ['websocket'],
  EIO: [3],
  forceNew: true,
  reconnection: true,
  reconnectionDelay: 1000,
  reconnectionAttempts: 20,
};

const state = () => ({
  connected: false,
  notifyEnterUser: false,
  joinReady: [],
  items: [],
});

const getters = {
  chatItemCount: (state) => {
    return state.items.length;
  },
};

const mutations = {
  [WS_CHATTING_CONNECTED](state, { connected }) {
    state.connected = connected || false;
  },
  [WS_CHATTING_UPDATE](state, { items }) {
    state.items = [...items];
  },
  [WS_CHATTING_RECEIVE_MESSAGE](state, { item }) {
    state.items = [...state.items.splice(-99), item];
  },
  [WS_CHATTING_ENTER_USER](state, { item }) {
    if (!state.notifyEnterUser) {
      return;
    }
    state.items = [...state.items, item];
  },
  [WS_CHATTING_PROCESS](state, v) {
    state.joinReady = v;
  },
  notifyEnterUser(state, { notifyEnterUser }) {
    state.notifyEnterUser = notifyEnterUser;
  },
  clearItems(state) {
    state.items = [];
  },
};

const actions = {
  connect({ commit }) {
    try {
      const token = this.$auth.getToken('spolive');
      const errorHandler = (error) => {
        commit(WS_CHATTING_CONNECTED, { connected: false });
        return error;
      };
      if (socket === null) {
        socket = io.connect(process.env.CHATTING_WS_URL, {
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
        commit(WS_CHATTING_CONNECTED, { connected: true });
      });
      socket.on('InviteOneOnOneRoom', (v) => {
        // 요청 받을 때
        commit(WS_CHATTING_PROCESS, { ...v, part: 'InviteOneOnOneRoom' });
      });
      socket.on('InviteOneOnOneRoomUid', (v) => {
        // 요청 할 때
        commit(WS_CHATTING_PROCESS, { ...v, part: 'InviteOneOnOneRoomUid' });
      });
      socket.on('rejectOneOnOneRoom', (v) => {
        // 거절
        commit(WS_CHATTING_PROCESS, { ...v, part: 'rejectOneOnOneRoom' });
      });
      socket.on('acceptOneOnOneRoom', (v) => {
        // 수락했을 때
        commit(WS_CHATTING_PROCESS, { ...v, part: 'acceptOneOnOneRoom' });
      });

      socket.on('error', errorHandler);
      socket.on('connect_error', errorHandler);
      socket.on('connect_failed', (e) => {
        console.error(e);
      });
      socket.on('reconnect_error', errorHandler);
      socket.on('reconnect_failed', (e) => {
        console.error(e);
      });
      socket.on('disconnect', () => {
        commit(WS_CHATTING_CONNECTED, { connected: false });
      });
      socket.on('reconnect', (c) => {
        commit(WS_CHATTING_CONNECTED, { connected: true });
        socket.emit('JoinRoom', { room: process.env.CHATTING_ROOM_CHANNEL });
      });
      socket.on('ChatHistory', (result) => {
        commit(WS_CHATTING_UPDATE, {
          items: result.chatHistory.map((chat) => {
            return JSON.parse(chat);
          }),
        });
      });
      socket.on('RecvMsg', (item) => {
        commit(WS_CHATTING_RECEIVE_MESSAGE, { item });
      });
      socket.on('UserEnter', (item) => {
        console.log('UserEnter0', item);
        commit(WS_CHATTING_ENTER_USER, { item });
      });
    } catch (e) {
      commit(WS_CHATTING_CONNECTED, { connected: false });
      socket.disconnect();
      socket.close();
      socket.destroy();
      console.error(e);
    }
  },
  async join({ state, dispatch, commit }, room) {
    if (!state.connected) {
      await dispatch('connect');
    }
    socket.emit('JoinRoom', {
      room: room || process.env.CHATTING_ROOM_CHANNEL,
    });
  },
  async requestOneOnOne({ state, dispatch }, { id, nickname }) {
    if (!state.connected) {
      await dispatch('connect');
    }
    socket.emit('CreateOneOnOne', { inviteMbId: id, inviteMbNick: nickname });
  },
  async receiveOneOnOne({ state, dispatch }, { inviteid }) {
    if (!state.connected) {
      await dispatch('connect');
    }
    socket.emit('acceptOneOnOneRoom', { inviteid });
  },
  async rejectOneOnOne({ state, dispatch }, { inviteid }) {
    if (!state.connected) {
      await dispatch('connect');
    }
    socket.emit('rejectOneOnOneRoom', { inviteid });
  },
  sendMessage({ commit }, { message, callback }) {
    try {
      if (socket === null) {
        return;
      }
      if (message === undefined || message === null || message.length <= 0) {
        return;
      }
      socket.emit('SendMsg', { msg: message });
      if (callback) {
        callback();
      }
    } catch (error) {
      console.error(error);
    }
  },
  notifyEnterUser({ commit }, { notifyEnterUser }) {
    commit('notifyEnterUser', { notifyEnterUser });
  },
  shareBettingHistory({ commit }, target) {
    try {
      socket.emit('SendBetHistory', { bet: target });
    } catch (error) {
      console.error(error);
    }
  },
  disconnect({ commit }, destroy) {
    try {
      commit(WS_CHATTING_CONNECTED, { connected: false });
      socket.disconnect();
      socket.close();
      socket.destroy();
      socket = null;
      commit('clearItems');
    } catch (e) {
      console.error(e);
    }
  },
};

export default {
  namesapced: true,
  state,
  getters,
  mutations,
  actions,
};
