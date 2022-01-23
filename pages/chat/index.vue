<template>
  <div>
    <div>
      <span>{{ connected }}</span>
      <b-btn @click="enterOneOnOne('liveTest11', 'liveTest11')">채팅신청</b-btn>
      <b-btn @click="enterRoom('58b57e30-35ee-11eb-ae2c-85a95460a143')"
        >채팅방 입장</b-btn
      >
    </div>
    <one-on-one-chat-container
      :is-logged-in="$auth.loggedIn"
      @chat="
        ({ message, callback }) => _sendChattingMessage({ message, callback })
      "
    >
      <template v-for="(item, index) in chattingItems">
        <one-on-one-chat-item
          v-if="item.loginId !== undefined && item.loginId !== null"
          :key="`chat_item_${index}_${item.userNick}`"
          :user-id="item.loginId"
          :nickname="item.userNick"
          :message="item.msg"
          :is-admin="item.sysLevel > 5"
          :selected="selectedChatIndex === index"
        ></one-on-one-chat-item>
      </template>
    </one-on-one-chat-container>
  </div>
</template>

<script>
import { createNamespacedHelpers } from 'vuex';
import OneOnOneChatContainer from '~/components/chat/OneOnOneChatContainer';
import OneOnOneChatItem from '~/components/chat/OneOnOneChatItem';

const { mapState: chattingState } = createNamespacedHelpers('chatting');

export default {
  layout: 'popup',
  components: {
    OneOnOneChatContainer,
    OneOnOneChatItem,
  },
  data() {
    return {
      selectedChatIndex: null,
    };
  },
  computed: {
    ...chattingState({ connected: 'connected', chattingItems: 'items' }),
  },
  watch: {
    chattingItems(v) {
      this.scrollDown();
    },
  },
  methods: {
    scrollDown() {
      this.$jquery('div.chat-container div.chat-content div.chat-list')
        .stop()
        .animate(
          {
            scrollTop: this.$jquery(
              'div.chat-container div.chat-content div.chat-list'
            )[0].scrollHeight,
          },
          800
        );
    },
    enterOneOnOne(id, nickname) {
      this._createOneOnOne({ id, nickname });
    },
    enterRoom(v) {
      this._joinRoom(v);
    },
  },
};
</script>

<style scoped></style>
