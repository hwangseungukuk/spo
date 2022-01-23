<template>
  <div :class="`modal-container default-ctn ${small ? 'small' : ''}`">
    <p class="message" :style="setPaddingTopToMessage" v-html="getMessage"></p>
    <p v-if="description !== null" class="description" v-html="description"></p>
    <p v-if="accent !== null" class="accent">
      {{ accent }} {{ timer ? timerCount + '초' : '' }}
    </p>
    <b-btn variant="info" class="btn-confirm" @click="onConfirmClick">
      <p>
        {{ buttonText }}
      </p>
    </b-btn>
  </div>
</template>

<script>
export const MODAL_OPTIONS = {
  height: 'auto',
  width: 500,
  adaptive: true,
  clickToClose: false,
};

export const MODAL_OPTIONS_SMALL = {
  height: 'auto',
  width: 450,
  adaptive: true,
  clickToClose: false,
};

export default {
  props: {
    message: { type: String, default: null },
    description: {
      type: String,
      default: null,
    },
    accent: {
      type: String,
      default: null,
    },
    buttonText: { type: String, default: '확인' },
    onConfirm: { type: Function, default: () => {} },
    small: { type: Boolean, default: false },
    timer: { type: Boolean, default: false },
  },
  data() {
    return {
      timerCount: 0,
    };
  },
  computed: {
    getMessage() {
      return this.message.replace(/(\\n|\r\n)/g, '<br />');
    },
    setPaddingTopToMessage() {
      const {
        getMessage,
        description,
        accent,
        accentTypeBg,
        accentPoint,
      } = this;
      return description == null &&
        accent == null &&
        accentTypeBg == null &&
        accentPoint == null
        ? getMessage.includes('br /')
          ? 'margin-top: 10px'
          : 'margin-top: 20px'
        : '';
    },
  },
  mounted() {
    if (this.timer) {
      this.startTimerCount(30);
    }
  },
  methods: {
    onConfirmClick() {
      if (this.timer) {
        this.startTimerCount(0);
      }
      this.onConfirm();
      this.$emit('close');
    },
    startTimerCount(second) {
      this.timerCount = second;
      const interval = setInterval(() => {
        if (this.timerCount > 0) {
          this.timerCount--;
          console.log('timerCountModal:1:', this.timerCount);
        } else {
          clearInterval(interval);
          this.$emit('close');
        }
      }, 1000);
    },
  },
};
</script>

<style scoped>
@import url(~assets/css/modal.css);
</style>
