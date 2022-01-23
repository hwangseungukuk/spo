<template>
  <div :class="`chat-item ${isCurrentUser ? 'current-user' : ''}`">
    <p :class="isAdmin ? 'admin' : ''">
      <span
        :class="selected ? 'selected' : ''"
        @click="$emit('on-nickname-click', { selected })"
      >
        <i v-if="isAdmin" class="icon-svg admin"></i>
        {{ nickname }}
      </span>
      &nbsp;:&nbsp;{{ message }}
    </p>
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
  methods: {},
};
</script>

<style scoped></style>
