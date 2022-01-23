<template>
  <div class="modal-container default-ctn">
    <p class="message">새로운 쪽지가 있습니다. 지금 확인하시겠습니까?</p>
    <div class="button-group flex">
      <div class="spacer"></div>
      <b-btn variant="info" class="btn-confirm" @click="onConfirmClick">
        <p>확인</p>
      </b-btn>
      <b-btn variant="light" class="btn-cancel" @click="onCancelClick">
        <p>취소</p>
      </b-btn>
      <div class="spacer"></div>
    </div>
    <b-checkbox v-model="noDisplayMsgToday">
      <p style="color: #888888">오늘 하루 동안 보지 않기</p>
    </b-checkbox>
  </div>
</template>

<script>
export const COOKIE_KEY_NO_DISPLAY_NEW_MESSAGE_TODAY =
  'COOKIE_KEY_NO_DISPLAY_NEW_MESSAGE_TODAY';

export const MODAL_OPTIONS = {
  height: 'auto',
  width: 500,
  adaptive: true,
  clickToClose: false,
};

export default {
  data() {
    return {
      noDisplayMsgToday: false,
    };
  },
  watch: {
    noDisplayMsgToday(v) {
      this.$cookies.set(COOKIE_KEY_NO_DISPLAY_NEW_MESSAGE_TODAY, v, {
        maxAge: 60 * 60 * 24,
      });
    },
  },
  methods: {
    onConfirmClick() {
      this.openMessagesPopup();
      this.$emit('close');
    },
    onCancelClick() {
      this.$emit('close');
    },
  },
};
</script>

<style scoped>
@import url(~assets/css/modal.css);

.modal-container {
  padding: 40px;
}

div.button-group {
  position: initial;
  bottom: 0;
  margin: 30px auto;
}
</style>
