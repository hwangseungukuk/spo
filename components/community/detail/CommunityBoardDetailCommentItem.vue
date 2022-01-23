<template>
  <div>
    <div
      :class="`wrapper ${commentDepth > 0 ? 'child' : ''}`"
      :style="setMarginWithCommentDepth"
    >
      <div class="comment">
        <div class="comment-user">
          <p class="wr_name">
            <i v-if="commentDepth > 0" class="icon-svg reply"></i>
            {{ wrName }}
          </p>
          <p class="wr_datetime">
            {{ $moment(wrDatetime).format('YYYY.MM.DD HH:mm') }}
          </p>
        </div>
        <div class="comment-content">
          <div class="wr_content">
            <p
              v-if="!isEditMode"
              ref="modify_comment_print"
              v-html="getContent()"
            ></p>
            <div v-if="isEditMode" class="modify-area">
              <textarea
                ref="modify_comment"
                v-model="mComment"
                placeholder="댓글을 입력해주세요."
              ></textarea>
              <div class="comment-buttons">
                <b-btn class="cancel" @click="onCancelClick">
                  <span>취소</span>
                </b-btn>
                <b-btn variant="info" class="save" @click="updateComment()">
                  <span>저장</span>
                </b-btn>
              </div>
            </div>
          </div>
        </div>
        <div v-if="!isEditMode" class="comment-buttons">
          <b-btn v-if="isDel" class="delete" @click="$emit('comment-delete')">
            <span>삭제</span>
          </b-btn>
          <b-btn
            v-if="isEditable"
            class="modify"
            variant="info"
            @click="onEditClick"
          >
            <span>수정</span>
          </b-btn>
          <b-btn v-if="isReply" class="reply" @click="$emit('replyWriteClick')">
            <span>답변</span>
          </b-btn>
        </div>
      </div>
      <div :class="`comment-reply ${isWriteOpen ? 'replyActive' : ''}`">
        <div class="comment-writer d-flex">
          <textarea
            :ref="`comment_${wrId}`"
            v-model="newComment"
            class="mr-2 w-100 border-0 rounded-lg p-2"
            name="reply-message"
            placeholder="댓글을 입력해 주세요."
            style="resize: none"
          ></textarea>
          <b-btn variant="info" @click="writeComment">댓글 등록</b-btn>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    wrCommentReply: { type: String, default: null },
    wrName: { type: String, default: null },
    wrDatetime: { type: Date, default: () => new Date() },
    wrContent: { type: String, default: null },
    wrId: { type: String, default: null },
    isReply: { type: Boolean, default: false },
    isEditable: { type: Boolean, default: false },
    isDel: { type: Boolean, default: false },
    isMy: { type: Boolean, default: false },
    isWriteOpen: { type: Boolean, default: false },
  },
  data() {
    return {
      isEditMode: false,
      toggleModify: false,
      mComment: null,
      newComment: null,
    };
  },
  computed: {
    commentDepth() {
      return this.wrCommentReply.length;
    },
    setMarginWithCommentDepth() {
      const { commentDepth } = this;
      if (commentDepth <= 0) {
        return '';
      }
      return `margin-left: ${10 * (commentDepth - 1)}px`;
    },
  },
  watch: {
    isWriteOpen(v) {
      if (v) {
        setTimeout(() => {
          this.$refs[`comment_${this.wrId}`].focus();
        }, 100);
        this.$nuxt.$emit('comment-edit', null);
        return;
      }
      this.newComment = null;
    },
  },
  beforeMount() {
    this.mComment = this.wrContent;
    this.$nuxt.$on('comment-edit', (id) => {
      if (id === this.wrId) {
        return;
      }
      this.mComment = '';
      this.isEditMode = false;
    });
  },
  methods: {
    onEditClick() {
      this.$emit('edit-click');
      this.$nuxt.$emit('comment-edit', this.wrId);
      this.isEditMode = true;
      this.mComment = this.wrContent;
      setTimeout(() => {
        this.$refs.modify_comment.focus();
      }, 100);
    },
    onCancelClick() {
      this.isEditMode = false;
      this.mComment = '';
    },
    updateComment() {
      // 수정
      this.isEditMode = false;
      this.$emit('comment-write-reply', {
        wr_content: this.mComment,
        comment_id: this.wrId,
        w: 'cu',
      });
      this.$refs.modify_comment.value = '';
      this.toggleModify = false;
    },
    writeComment() {
      // 댓글
      this.$emit('comment-write-reply', {
        wr_content: this.newComment,
        comment_id: this.wrId,
        w: 'c',
      });
      this.newComment = '';
      this.$emit('replyWriteClick');
    },
    getContent() {
      return this.wrContent.split('\n').join('<br />');
    },
  },
};
</script>

<style scoped>
.comment-list .wrapper .comment {
  display: flex;
  flex-wrap: wrap;
  flex-direction: row;
  margin-bottom: 10px;
  min-height: 100px;
  border-top: 1px solid #e5e5e5;
  border-bottom: 1px solid #e5e5e5;
  color: #888888;
}

.comment-list .wrapper.child .modify-area {
  background-color: #ffffff !important;
}

.comment-list .wrapper .comment:first-child {
  margin-top: 10px;
}

.comment-list .wrapper .comment:last-child {
  margin-bottom: 0;
}

.comment-list .wrapper.child .comment {
  border-top: unset;
  border-bottom: unset;
}

.comment-list .wrapper.child div:not(.comment-user) {
  background-color: #f2f2f2;
  /* padding: 16px; */
}

.comment-list .wrapper .comment-user {
  width: 200px;
  max-width: 200px;
  padding-left: 30px;
  padding-top: 30px;
  background-color: #f2f2f2;
}

.comment-list .wrapper.child .comment-user {
  padding-left: 15px;
}

.comment-list .wrapper .comment-user .wr_name {
  position: relative;
  font-weight: 700;
  color: #444444;
  margin-bottom: 3px !important;
}

.comment-list .wrapper .comment-user .wr_name .icon-svg {
  width: 15px;
  height: 15px;
  background-color: #888888;
}

.comment-list .wrapper.child .comment-user .wr_datetime {
  padding-left: 18px;
}

.comment-list .wrapper .comment-content {
  display: flex;
  flex: 1;
  align-items: center;
}

.comment-list .wrapper .comment-content .wr_content {
  display: flex;
  flex-wrap: wrap;
  align-content: center;
  flex-basis: 100%;
  min-height: 60px;
  padding: 16px 10px 16px 16px;
}

.comment-list .wrapper.child .comment-content .wr_content {
  border-left: 1px solid #d9d9d9;
}

.comment-list .wrapper.child div.comment {
  padding: 16px 0 16px 16px;
}

.comment-list .wrapper.child .modify-area {
  background-color: #ffffff !important;
  margin-right: 0 !important;
}

.comment-list .wrapper.child .wr_content {
  padding: 16px 10px 16px 16px;
}

.comment-list .wrapper .comment-content .wr_content p {
  /* padding: 16px 0 16px 16px; */
  margin-bottom: 0 !important;
  font-family: 'NanumBarunGothic', sans-serif;
}

.comment-list .wrapper .comment-content .wr_content .modify-area {
  display: flex;
  flex-basis: 100%;
  background: #f2f2f2;
  /* margin-right: 10px; */
}

.comment-list .wrapper .comment-content .wr_content .modify-area textarea {
  width: 100%;
  padding: 10px;
  resize: none;
  outline: none !important;
  border: 0px;
  background: transparent;
  font-family: 'NanumBarunGothic', sans-serif;
  color: #444444;
}

.comment-list
  .wrapper
  .comment-content
  .wr_content
  .modify-area
  .comment-buttons {
  background: transparent;
}

.comment-list .modifyActive .wrapper .comment-content,
.comment-list .modifyActive .wrapper .comment-buttons {
  background: transparent;
}
.comment-list .modifyActive .wrapper .comment-content .wr_content {
  border-left: 0px;
}

.comment-list .wrapper .comment-buttons {
  display: flex;
  align-items: center;
}

.comment-list .wrapper .comment-buttons > button.reply {
  background: #fff;
}

/* comment depth-6 */
.comment-list .wrapper.depth-6 {
  margin-left: 100px;
}

/* comment button */
.comment-buttons > button {
  width: 49px;
  height: 30px;
  font-size: 12px;
  font-weight: 400;
  border-radius: 5px;
  transition: all 0.3s;
  margin-right: 10px;
}
.comment-buttons > button.delete {
  background: #aaa;
  border: 1px solid #aaa;
}
.comment-buttons > button.delete:hover {
  background: #888;
  border: 1px solid #888;
}
.comment-buttons > button.reply {
  background: #f2f2f2;
  border: 1px solid #e5e5e5;
  color: #4f4f4f;
}
.comment-buttons > button.reply:hover {
  background: #ccc;
  border: 1px solid #ccc;
}

/* comment reply writer */
.comment-reply {
  margin-top: 10px;
  display: none;
}
.comment-reply.replyActive {
  display: block;
  background-color: #f2f2f2 !important;
}
.comment-reply.replyActive .comment-writer {
  padding: 10px;
}
.comment-reply .comment-writer {
  border-top: 0px;
}
.comment-reply textarea {
  min-height: 80px;
}
.comment-reply .comment-writer textarea:focus {
  outline: none;
}
.comment-reply .comment-writer button {
  width: 115px;
  font-size: 14px;
}
</style>
