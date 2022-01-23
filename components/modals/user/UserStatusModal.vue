<template>
  <div class="modal-container default-ctn">
    <p class="message" :style="setMessageMarginTop" v-html="getMessage"></p>
    <div
      v-if="additionals !== null && additionals.length > 0"
      class="additionals"
    >
      <ul>
        <li
          v-for="(additional, index) in additionals"
          :key="`login-status-modal-additional-${index}`"
        >
          {{ additional }}
        </li>
      </ul>
    </div>
    <p
      v-if="description !== null"
      class="description"
      v-html="getDescription"
    ></p>
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
  minHeight: 350,
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
    additionals: {
      type: Array,
      default: null,
    },
    buttonText: { type: String, default: '확인' },
    onConfirm: { type: Function, default: () => {} },
  },
  computed: {
    setMessageMarginTop() {
      const { description, additionals } = this;
      const isMessageOnly = description === null && additionals === null;
      if (isMessageOnly) {
        return 'margin-top: 20px;';
      } else {
        return '';
      }
    },
    getMessage() {
      return this.message.replace('\\n', '<br />');
    },
    getDescription() {
      return this.description.replace('\\n', '<br />');
    },
  },
  methods: {
    onConfirmClick() {
      this.onConfirm();
      if (this.timer) {
        this.startTimerCount(0);
      }
      this.$emit('close');
    },
  },
};
</script>

<style scoped>
@import url(~assets/css/modal.css);

.modal-container {
  padding: 40px 0 80px;
}

.additionals {
  background-color: #f2f2f2;
  padding: 20px;
  margin-bottom: 10px;
  font-weight: 700;
  font-size: 14px;
  color: #444444;
}

.additionals ul {
  list-style: none;
  text-align: initial;
  min-width: 320px;
  width: fit-content;
  margin: 0 auto;
}

.additionals ul li::before {
  content: '-';
  display: inline-block;
  margin-right: 5px;
}

.additionals ul li:not(:last-of-type) {
  margin-bottom: 5px;
}

.description {
  font-size: 12px;
  font-weight: 700;
}
</style>
