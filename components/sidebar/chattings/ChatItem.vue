<template>
  <div :class="`chat-item ${isCurrentUser ? 'current-user' : ''}`">
    <p :class="isAdmin ? 'admin' : ''">
      <span
        v-show="userId !== 'sysadmin'"
        :class="selected ? 'selected' : ''"
        @click="onNicknameClick"
      >
        <i v-if="isAdmin" class="icon-svg admin"></i>
        {{ nickname }}
      </span>
      <span v-show="userId !== 'sysadmin'">&nbsp;:&nbsp;</span>
      {{ message }}
    </p>
    <div :class="`menu flex ${selected ? 'on' : ''}`">
      <button @click="onMessageClick">쪽지보내기</button>
      <button @click="onChattingClick">1:1 채팅신청</button>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    selected: { type: Boolean, default: false },
    userId: { type: String, default: 'userId' },
    isAdmin: { type: Boolean, default: false },
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
  mounted() {
    document.addEventListener('click', this.onDocumentClick);
  },
  beforeDestroy() {
    document.removeEventListener('click', this.onDocumentClick);
  },
  methods: {
    onNicknameClick() {
      if (this.isCurrentUser) {
        return;
      }
      this.$emit('on-nickname-click', { selected: this.selected });
    },
    onChattingClick() {
      const { userId, nickname, isAdmin } = this;
      this.$emit('chatting', { id: userId, nickname, isAdmin });
    },
    onMessageClick() {
      const { userId, nickname, isAdmin } = this;
      this.$emit('message', { id: userId, nickname, isAdmin });
    },
    onDocumentClick(e) {
      if (
        e.target.className !== 'menu flex on' &&
        e.target.className !== 'selected'
      ) {
        this.$emit('reset');
      }
    },
  },
};
</script>

<style scoped></style>
