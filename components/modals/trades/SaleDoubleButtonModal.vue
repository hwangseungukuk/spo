<template>
  <div class="modal-container default-ctn">
    <p class="message">{{ message }}</p>
    <b-form-input
      ref="priceComma"
      v-model="priceComma"
      class="priceComma"
      :placeholder="message"
    />
    <p class="description">
      <span>수수료 : 0</span><span>배당 : {{ rate }}</span>
    </p>
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
import Vue from 'vue';
export const MODAL_OPTIONS = {
  height: 'auto',
  width: 500,
  adaptive: true,
  clickToClose: false,
};

export default {
  props: {
    message: { type: String, default: '' },
    description: { type: String, default: null },
    rate: { type: String, default: null },
    golds: { type: Number, default: 0 },
    expected: { type: Number, default: 0 },
    buttonConfirmText: { type: String, default: '' },
    buttonCancelText: { type: String, default: '취소' },
    onConfirm: { type: Function, default: () => {} },
    onCancel: { type: Function, default: () => {} },
  },
  data() {
    return {
      mMessage: '',
      priceComma: null,
    };
  },
  watch: {
    message(v) {
      this.mMessage = v;
    },
    priceComma(newValue) {
      const result = newValue
        .replace(/\D/g, '')
        .replace(/(^0+)/, '')
        .replace(/\B(?=(\d{3})+(?!\d))/g, ',');
      Vue.nextTick(() => (this.priceComma = result));
    },
  },
  mounted() {
    setTimeout(() => {
      this.$refs.priceComma.focus();
    });
  },
  methods: {
    onConfirmClick() {
      if (this.priceComma === null) this.priceComma = '0';
      const sellprice = Number(
        this.priceComma.trim().replace(/\D/g, '').replace(/(^0+)/, '')
      );
      console.log('sellprice', sellprice);

      if (sellprice < this.golds) {
        this.showSingleButtonModal({
          message:
            '최소 ' +
            this.golds.toLocaleString() +
            '골드 이상의<br />판매골드를 입력해 주세요.',
        });
        return;
      }
      if (sellprice > this.expected) {
        this.showSingleButtonModal({
          message:
            '판매 최대 골드는 ' +
            this.expected.toLocaleString() +
            '골드 입니다.<br />판매골드를 다시 입력해 주세요.',
          onConfirm: () => {
            this.priceComma = this.expected.toLocaleString();
          },
        });
        return;
      }

      this.onConfirm(this.priceComma);
      this.$emit('close');
    },
    onCancelClick() {
      this.onCancel();
      this.$emit('close');
    },
  },
};
</script>

<style scoped>
@import url(~assets/css/modal.css);
.priceComma {
  margin-bottom: 10px;
}
.description {
  margin-bottom: 37px !important;
}
.description span {
  color: #3eb2c0;
  padding: 0 18px;
}
.priceComma {
  text-align: center;
}
</style>
