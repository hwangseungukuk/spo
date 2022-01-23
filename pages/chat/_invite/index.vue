<template>
  <div>
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

const {
  mapState: chattingState,
  mapActions: chattingActions,
} = createNamespacedHelpers('chatting');

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
  mounted() {
    this._joinRoom(this.$route.params.invite);
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
  },
};
</script>

<style scoped></style>
