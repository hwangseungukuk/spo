<template>
  <div class="comment-board">
    <div class="comment-writer d-flex">
      <textarea
        ref="comment"
        class="mr-2"
        name="comment-message"
        :disabled="!$auth.loggedIn"
        :placeholder="
          $auth.loggedIn ? '댓글을 입력해 주세요.' : '로그인이 필요합니다.'
        "
      ></textarea>
      <b-btn variant="info" :disabled="!$auth.loggedIn" @click="commentWrite">
        <span>댓글 등록</span>
      </b-btn>
    </div>
    <div class="comment-count">
      <dl>
        <dt>{{ `댓글 ${comments}개` }}</dt>
        <dd v-if="comments.length <= 0">등록된 댓글이 없습니다</dd>
      </dl>
    </div>
    <div class="comment-list">
      <slot></slot>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    comments: { type: Number, default: 0 },
  },
  data() {
    return {};
  },
  methods: {
    commentWrite() {
      if (!this.$auth.loggedIn) {
        this.showPleaseLoginModal();
        return;
      }
      this.$emit('comment-write', {
        wr_content: this.$refs.comment.value,
        comment_id: '',
        w: 'c',
      });
      this.$refs.comment.value = '';
    },
  },
};
</script>

<style scoped>
/* comment */
.comment-board * {
  margin: 0px;
  padding: 0px;
}
.comment-writer {
  display: flex;
  justify-content: space-between;
  border-top: 2px solid #e5e5e5;
  background: #f2f2f2;
  padding: 10px;
}
.comment-writer textarea {
  flex: 1;
  height: 80px;
  border: 0px;
  border-radius: 10px;
  padding: 10px;
  resize: none;
  border: 1px solid #fff;
  transition: all 0.3s;
  margin-right: 10px;
  font-family: 'NanumBarunGothic', sans-serif;
}
.comment-writer textarea:focus {
  outline: none !important;
  border: 1px solid #3eb2c0;
  background: #f1fcfd;
}
.comment-writer button {
  width: 148px;
  height: 80px;
}
.comment-count dl {
  display: flex;
  margin-top: 25px;
}
.comment-count dl dt {
  padding-right: 25px;
  font-weight: 800;
}
.comment-count dl dd {
  color: #ababab;
}

.comment-list {
  margin-bottom: 20px;
}

textarea:disabled {
  background-color: #fafafa;
}

textarea:disabled::placeholder {
  color: #cccccc;
}
</style>
