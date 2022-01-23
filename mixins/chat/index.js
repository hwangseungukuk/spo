import { createNamespacedHelpers } from 'vuex';

import ChattingContainer from '~/components/sidebar/chattings/ChattingContainer';
import ChatItem from '~/components/sidebar/chattings/ChatItem';
import ChatEnteredItem from '~/components/sidebar/chattings/ChatEnteredItem';
import ChatBettingItem from '~/components/sidebar/chattings/ChatBettingItem';

const {
  mapState: chattingState,
  mapGetters: chattingGetters,
} = createNamespacedHelpers('chatting');

const { mapGetters: chatFilterGetters } = createNamespacedHelpers(
  'chatting/filter'
);

const {
  mapState: idNickState,
  mapActions: idNickActions,
} = createNamespacedHelpers('user/idnick');

const COOKIE_KEY_NOTIFY_ENTER_USER = 'ls_notify_enter_user';
const COOKIE_KEY_SCROLL_LOCK = 'ls_scroll_lock';

export default {
  components: {
    ChattingContainer,
    ChatItem,
    ChatEnteredItem,
    ChatBettingItem,
  },
  data() {
    return {
      chat: {
        notifyEnterUser: false,
        scrollLock: false,
      },
      selectedChatIndex: null,
      oldChatItemCount: 0,
    };
  },
  computed: {
    ...idNickState({
      nickname: 'nickname',
    }),
    ...chattingState({
      connected: 'connected',
      chatItems: 'items',
      joinReady: 'joinReady',
    }),
    ...chattingGetters(['chatItemCount']),
    ...chatFilterGetters({
      isMessageVaild: 'isValid',
    }),
  },
  watch: {
    chatItems(v, o) {
      if (!this.chat.scrollLock) {
        this.scrollDown();
      }
      console.log('chatItems', v.length);
      if (this.oldChatItemCount < v.length) {
        this.oldChatItemCount = v.length;
        console.log('oldChatItemCount', this.oldChatItemCount);
        return;
      }
      console.log('oldChatItemCount', this.oldChatItemCount);
      if (this.selectedChatIndex - 1 < 0) {
        this.selectedChatIndex = null;
      } else {
        this.selectedChatIndex = this.selectedChatIndex - 1;
      }
      console.log('selectedChatIndex', this.selectedChatIndex);
    },
    async joinReady(v) {
      if (v.part === 'InviteOneOnOneRoomUid') {
        this.showSingleButtonModal({
          message:
            v.mb_nick +
            '님께 1:1 채팅을 요청했습니다.<br />상대방이 수락 시 채팅창이 자동으로 열립니다.',
          description: null,
          accent: '대기시간',
          timer: true,
          onConfirm: () => {
            console.log('...');
          },
        });
      } else if (v.part === 'acceptOneOnOneRoom') {
        console.log('openChatPopup::', this.$auth.user.mb_id, v.to_id);
        let toid = '';
        if (this.$auth.user.mb_id !== v.to_id) {
          toid = v.to_id;
        }
        // 무한 팝업 차단
        if (this.userChatRooms !== v.inviteid) {
          await this.getNickname({ id: toid });
          this.openChatPopup(v.inviteid, this.nickname ? this.nickname : toid);
          this.$jquery('.btn-confirm').trigger('click');
        }
        this.userChatRooms = v.inviteid;
      } else if (v.part === 'InviteOneOnOneRoom') {
        await this.getNickname({ id: v.createMbId });
        this.showDoubleButtonsModal({
          message: `${
            this.nickname ? this.nickname : v.createMbId
          }님으로부터 1:1채팅을 요청받았습니다.<br />수락하시겠습니까?`,
          description: null,
          accent: '제한시간',
          timer: true,
          buttonConfirmText: '수락',
          buttonCancelText: '거절',
          onConfirm: () => {
            console.log('요청 수락');
            const { inviteid } = v;
            this._receiveOneOnOne({ inviteid });
          },
          onCancel: () => {
            // 내가 거절 하기
            this._rejectOneOnOne(v);
          },
        });
      } else if (v.part === 'rejectOneOnOneRoom') {
        if (v.to_id !== this.$auth.user.mb_id) {
          // 대화신청 중 상대방이 거절을 클릭
          if (v.msg === '거절 되었습니다.') {
            this.$jquery('.btn-confirm').trigger('click');
          }
          this.showSingleButtonModal({
            message: v.msg,
            description: null,
            accent: null,
          });
        }
      } else {
        this.$jquery('.btn-confirm').trigger('click');
      }
    },
  },
  mounted() {
    this._joinRoom();
  },
  beforeMount() {
    this.chat.notifyEnterUser =
      this.$cookies.get(COOKIE_KEY_NOTIFY_ENTER_USER) || false;
    this.chat.scrollLock = this.$cookies.get(COOKIE_KEY_SCROLL_LOCK) || false;
    this._setNotifyEnterUser({ notifyEnterUser: this.chat.notifyEnterUser });
  },
  methods: {
    ...idNickActions({
      getNickname: 'getNickname',
    }),
    onBettingDetailClick(v) {
      this.showBettingShareModal(v);
    },
    onShareClick() {
      if (!this.$auth.loggedIn) {
        this.showPleaseLogInModal();
        return;
      }
      this.showSelectHistoriesModal({
        isShareMode: true,
        onSelected: (v, close) => {
          this._shareBettingHistory(v);
        },
      });
    },
    onMessageClick(v) {
      this.selectedChatIndex = null;
      if (v.isAdmin) {
        this.showSingleButtonModal({
          message: '관리자에게는 쪽지를 전송하실 수 없습니다.',
        });
        return;
      }
      this.openMessagesPopup(v.nickname);
    },
    onNicknameClick(v) {
      if (v.selected) {
        this.selectedChatIndex = null;
      } else {
        this.selectedChatIndex = v.index;
      }
    },
    onAllowChatChange(v) {
      this.updateDeny({ chat: v, memo: this.$auth.mb_deny_memo === '1' });
    },
    onAllowMessageChange(v) {
      this.updateDeny({ chat: this.$auth.user.mb_deny_chat === '1', memo: v });
    },
    onChattingClick(v) {
      this.selectedChatIndex = null;
      if (v.isAdmin) {
        this.showSingleButtonModal({
          message: '관리자에게는 1:1신청을 하실 수 없습니다.',
        });
        return;
      }
      this.showDoubleButtonsModal({
        message: `${v.nickname} 님께 1:1 채팅을 신청하시겠습니까?`,
        buttonConfirmText: '신청',
        onConfirm: () => {
          const { id, nickname } = v;
          this._requestOneOnOne({ id, nickname });
        },
      });
    },
    sendChattingMessage({ message, callback }) {
      if (this.isMessageVaild(message)) {
        this.showSingleButtonModal({
          message: '금칙어는 입력 할 수 없습니다.',
        });
        return;
      }
      this._sendChattingMessage({ message, callback });
    },
    onNotifyChange(v) {
      this.$cookies.set(COOKIE_KEY_NOTIFY_ENTER_USER, v, {
        maxAge: 60 * 60 * 24,
      });
      this._setNotifyEnterUser({ notifyEnterUser: v });
    },
    onScrollLockChange(v) {
      this.$cookies.set(COOKIE_KEY_SCROLL_LOCK, v, {
        maxAge: 60 * 60 * 24,
      });
      this.chat.scrollLock = v;
    },
    scrollDown() {
      const chatList = this.$jquery(
        'div.chat-container div.chat-content div.chat-list'
      );
      chatList.animate(
        {
          scrollTop:
            chatList[0].scrollHeight === chatList[0].clientHeight
              ? 9999
              : chatList[0].scrollHeight,
        },
        100
      );
    },
  },
};
