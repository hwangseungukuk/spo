<template>
  <div class="modal-container default-ctn">
    <p class="message" :style="setPaddingTopToMessage" v-html="message"></p>
    <p v-if="description !== null" class="description" v-html="description"></p>
    <p v-if="accent !== null" class="accent">
      {{ accent }} {{ timer ? timerCount + '초' : '' }}
    </p>
    <div v-if="accentTypeBg !== null" class="accentTypeBg">
      <p :class="`message ${accentPoint ? 'accentPoint' : ''}`">
        {{ accentTypeBg }}
      </p>
      <p v-if="accentPoint !== null" class="accentPoint">
        <i class="pmang-cash-store"></i>
        {{ accentPoint | comma }}
      </p>
    </div>
    <div class="button-group flex">
      <div class="spacer"></div>
      <b-btn variant="info" class="btn-confirm" @click="onConfirmClick">
        <p>
          {{ buttonConfirmText }}
        </p>
      </b-btn>
      <b-btn variant="light" class="btn-cancel" @click="onCancelClick">
        <p>
          {{ buttonCancelText }}
        </p>
      </b-btn>
      <div class="spacer"></div>
    </div>
  </div>
</template>

<script>
export const MODAL_OPTIONS = {
  height: 'auto',
  width: 500,
  adaptive: true,
  clickToClose: false,
};

export default {
  filters: {
    comma(val) {
      return String(val).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    },
  },
  props: {
    message: { type: String, default: 'prop:message' },
    description: {
      type: String,
      default: null,
    },
    accent: {
      type: String,
      default: null,
    },
    accentTypeBg: {
      type: String,
      default: null,
    },
    accentPoint: {
      type: String,
      default: null,
    },
    buttonConfirmText: { type: String, default: '확인' },
    buttonCancelText: { type: String, default: '취소' },
    onConfirm: { type: Function, default: () => {} },
    onCancel: { type: Function, default: () => {} },
    timer: { type: Boolean, default: false },
  },
  data() {
    return {
      timerCount: 0,
    };
  },
  computed: {
    setPaddingTopToMessage() {
      const { message, description, accent, accentTypeBg, accentPoint } = this;
      return description == null &&
        accent == null &&
        accentTypeBg == null &&
        accentPoint == null
        ? message.includes('br /')
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
      this.onConfirm();
      if (this.timer) {
        this.startTimerCount(0);
      }
      this.$emit('close');
    },
    onCancelClick() {
      this.onCancel();
      this.$emit('close');
    },
    startTimerCount(second) {
      this.timerCount = second;
      const interval = setInterval(() => {
        if (this.timerCount > 0) {
          this.timerCount--;
          console.log('timerCountModal:0:', this.timerCount);
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
