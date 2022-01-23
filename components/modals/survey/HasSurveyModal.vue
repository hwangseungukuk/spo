<template>
  <div class="modal-container default-ctn">
    <div class="header flex">
      <div class="image spolive logo no-text">
        <span>Spolive Logo No Text</span>
      </div>
      <span>스포라이브</span>
      <div class="spacer"></div>
      <i class="icon-svg close" @click="$emit('close')"></i>
    </div>
    <p v-if="message !== null" class="message" v-html="message"></p>
    <img class="survey" :src="image" alt="survey image" />
    <p class="description" v-html="description"></p>
    <div class="button-group flex">
      <div class="spacer"></div>
      <b-btn variant="info" class="btn-confirm" @click="onConfirmClick">
        <p>{{ onConfirmText }}</p>
      </b-btn>
      <b-btn variant="light" class="btn-cancel" @click="onCancelClick">
        <p>{{ onCancelText }}</p>
      </b-btn>
      <div class="spacer"></div>
    </div>
    <b-checkbox v-if="false" v-model="noDisplayMsgToday">
      <p style="color: #888888">오늘 하루 동안 보지 않기</p>
    </b-checkbox>
  </div>
</template>

<script>
export const COOKIE_KEY_NO_DISPLAY_SURVEY_TODAY = 'NO_DISPLAY_SURVEY_TODAY';

export const MODAL_OPTIONS = {
  name: 'has-survey-modal',
  height: 'auto',
  width: 600,
  adaptive: true,
  clickToClose: false,
};

export default {
  props: {
    image: { type: String, default: null },
    message: { type: String, default: null },
    description: { type: String, default: 'description' },
    onConfirm: { type: Function, default: () => {} },
    onConfirmText: { type: String, default: '참여' },
    onCancelText: { type: String, default: '취소' },
  },
  data() {
    return {
      noDisplayMsgToday: false,
    };
  },
  watch: {
    noDisplayMsgToday(v) {
      this.$cookies.set(COOKIE_KEY_NO_DISPLAY_SURVEY_TODAY, v, {
        maxAge: 60 * 60 * 24,
      });
    },
  },
  methods: {
    onConfirmClick() {
      this.onConfirm();
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
  width: 500px;
  padding: 0 0 32px;
}

.header {
  background-color: #3eb2c0;
  align-items: center;
  color: white;
  font-weight: 700;
  font-size: 16px;
  padding: 8px 16px;
  border-radius: 10px 10px 0 0;
}

.header .icon-svg.close {
  width: 18px;
  height: 18px;
  background-color: white;
  opacity: 1;
}

.header .icon-svg.close:hover {
  cursor: pointer;
}

p.description {
  font-size: 16px;
  color: #888888;
}

div.image.spolive.logo {
  width: 18px;
  height: 18px;
  margin-right: 10px;
}

div.image.spolive.logo > * {
  display: none;
}

img.survey {
  width: 600px;
  margin-left: -30px;
  padding: 32px 32px 16px;
}

div.button-group {
  position: initial;
  bottom: 0;
  margin: 30px auto;
}
</style>
