import { createNamespacedHelpers } from 'vuex';

const { mapActions: _wsChattingActions } = createNamespacedHelpers('chatting');

export default {
  methods: {
    ..._wsChattingActions({
      _shareBettingHistory: 'shareBettingHistory',
      _sendChattingMessage: 'sendMessage',
      _setNotifyEnterUser: 'notifyEnterUser',
      _joinRoom: 'join',
      _requestOneOnOne: 'requestOneOnOne',
      _receiveOneOnOne: 'receiveOneOnOne',
      _rejectOneOnOne: 'rejectOneOnOne',
      _disconnectChatWs: 'disconnect',
    }),
  },
};
