<template>
  <div class="modal-container default-ctn">
    <p class="message">{{ number }}을 구매하시겠습니까?</p>
    <p>{{ gold }}구매시 가 차감됩니다.</p>
    <p class="description">
      <span>
        * 거래소를 통해 구매한 베팅 내역은<br />
        구매취소가 불가하니 주의해주세요.
      </span>
    </p>
    <div class="button-group flex">
      <div class="spacer"></div>
      <b-btn variant="info" class="btn-confirm" @click="onConfirmClick">
        <p>구매</p>
      </b-btn>
      <b-btn variant="light" class="btn-cancel" @click="onCancelClick">
        <p>취소</p>
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
    number: { type: Number, default: 0 },
    gold: { type: Number, default: 0 },
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
