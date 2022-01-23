<template>
  <div>
    <slot name="attachments"></slot>
    <div class="community-board detail contents">
      <div v-if="!loading" class="html-contents" v-html="contents"></div>
      <b-skeleton-img v-if="loading" aspect="3:1"></b-skeleton-img>
      <b-skeleton v-if="loading" :width="`${getWidth}px`"></b-skeleton>
      <b-skeleton v-if="loading" :width="`${getWidth}px`"></b-skeleton>
      <b-skeleton v-if="loading" :width="`${getWidth}px`"></b-skeleton>
    </div>
    <slot name="bets"></slot>
    <div v-if="userWrite" class="detail-buttons flex">
      <b-btn
        v-if="isOwner"
        variant="info"
        class="modify"
        @click="$emit('modify')"
      >
        수정
      </b-btn>
      <b-btn v-if="isOwner" @click="$emit('delete')">삭제</b-btn>
      <b-btn variant="" class="reply" @click="$emit('reply')">답변</b-btn>
      <div class="spacer"></div>
      <b-btn variant="info" class="write" @click="$emit('write')">글쓰기</b-btn>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    loading: { type: Boolean, default: false },
    contents: { type: String, default: null },
    isOwner: { type: Boolean, default: false },
    userWrite: { type: Boolean, default: false },
    replyCnt: { type: Number, default: 0 },
  },
  computed: {
    getWidth() {
      return Math.random() * (800 - 200) + 200;
    },
  },
};
</script>

<style scoped>
div.detail.contents {
  padding: 0 20px 10px;
  margin-bottom: 10px;
  min-height: 110px;
}

div.html-contents {
  word-break: break-word;
}
div.html-contents >>> p {
  margin: 0;
}

.b-aspect,
.b-skeleton {
  margin-bottom: 10px;
}

.detail-buttons {
  margin-bottom: 20px;
}

.detail-buttons > *:not(:last-child) {
  margin-right: 5px;
}

.detail-buttons > button {
  width: 95px;
  height: 35px;
  font-size: 14px;
  font-weight: 700;
  border-radius: 10px;
  transition: all 0.3s;
}

.detail-buttons > button.move {
  color: white;
  border: 1px solid #3eb2c0;
  background-color: #3eb2c0;
}

.detail-buttons > button.move:hover {
  color: #3eb2c0;
  background-color: #d8f0f2;
}

.detail-buttons > button.reply {
  background-color: #547097;
  border: 0px;
}
.detail-buttons > button.reply:hover {
  background-color: #3b567b;
}

.detail-buttons > button.write {
  width: 160px;
  color: #3eb2c0;
  border: 1px solid #3eb2c0;
  background-color: #d8f0f2;
}

.detail-buttons > button.write:hover {
  color: white;
  border: 1px solid #3eb2c0;
  background-color: #3eb2c0;
}

.detail-buttons > button.write:focus,
.detail-buttons > button.write:active {
  outline: unset;
  border: 1px solid #3eb2c0;
}
</style>
