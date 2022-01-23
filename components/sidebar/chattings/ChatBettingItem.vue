<template>
  <div class="chat-item">
    <div
      class="shared-bet-item gradient-bg flex"
      @click="$emit('detail', { nickname, bet: parseBet(bet) })"
    >
      <p>
        <span @click="onNickNameClick">
          {{ nickname }}
        </span>
        &nbsp;:&nbsp;{{ message }}
      </p>
      <div class="spacer"></div>
      <i class="icon-svg plus"></i>
    </div>
    <div :class="`menu flex ${selected ? 'on' : ''}`">
      <button @click="onMessageClick">쪽지보내기</button>
      <button @click="onChattingClick">1:1 채팅신청</button>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    userId: { type: String, default: 'userId' },
    selected: { type: Boolean, default: false },
    bet: { type: String, default: null },
    nickname: { type: String, default: 'nickname' },
    message: { type: String, default: 'message' },
  },
  computed: {
    isCurrentUser() {
      if (!this.$auth.user) {
        return false;
      }
      return this.$auth.user.mb_id === this.userId;
    },
  },
  methods: {
    onNickNameClick(e) {
      e.stopPropagation();
      if (this.isCurrentUser) {
        return;
      }
      this.$emit('on-nickname-click', { selected: this.selected });
    },
    onChattingClick() {
      const { userId, nickname } = this;
      this.$emit('chatting', { id: userId, nickname });
    },
    onMessageClick() {
      const { userId, nickname } = this;
      this.$emit('message', { id: userId, nickname });
    },
    parseBet(bet) {
      const regEx = /(\d{1}:(\d{1,})?:([a-zA-Z]{1,})?\/?\d{1,})/;
      return bet.match(regEx)[0];
    },
  },
};
</script>

<style scoped>
.chat-item div.menu {
  top: 4px;
}
</style>
