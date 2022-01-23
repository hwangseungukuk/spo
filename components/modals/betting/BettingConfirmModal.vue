<template>
  <div class="modal-container betting-confirm default-ctn">
    <p class="message">선택한 내용으로 베팅을 진행하시겠습니까?</p>
    <div class="bet-info">
      <p>
        {{ `선택폴더 : ${size.toLocaleString()} 폴더` }}
        <span class="separate"></span>
        {{ `배당률 : ${rate}` }}
      </p>
      <p class="gold">
        {{ `총 베팅골드 : ${gold.toLocaleString()}` }}
      </p>
      <p class="expected">
        {{ `예상 당첨골드 : ${getExpected.toLocaleString()}` }}
      </p>
    </div>
    <p class="alert">
      <i class="icon-svg exclamation outline"></i>
      저장된 베팅은 수정이 불가능합니다.
    </p>
    <form class="button-group flex" @submit.prevent="onConfirmClick">
      <div class="spacer"></div>
      <b-btn type="submit" variant="info" class="btn-confirm">
        <p>진행</p>
      </b-btn>
      <b-btn variant="light" class="btn-cancel" @click="onCancelClick">
        <p>취소</p>
      </b-btn>
      <div class="spacer"></div>
    </form>
  </div>
</template>

<script>
export const MODAL_OPTIONS = {
  height: 'auto',
  width: 500,
  minHeight: 340,
  adaptive: true,
  clickToClose: false,
};

export default {
  props: {
    size: { type: Number, default: 0 },
    rate: { type: Number, default: 0 },
    gold: { type: Number, default: 0 },
    onConfirm: { type: Function, default: () => {} },
    onCancel: { type: Function, default: () => {} },
  },
  computed: {
    getExpected() {
      return this.rate * this.gold;
    },
  },
  methods: {
    onConfirmClick() {
      this.onConfirm();
      this.$emit('close');
    },
    onCancelClick() {
      this.onCancel();
      this.$emit('close');
    },
  },
  mounted() {
    setTimeout(() => {
      this.$jquery('.modal-container.betting-confirm .btn.btn-confirm').focus();
    }, 100);
  },
};
</script>

<style scoped>
@import url(~assets/css/modal.css);

div.modal-container {
  padding: 40px 0 80px;
}

div.bet-info {
  width: 100%;
  height: 115px;
  background-color: #f2f2f2;
  margin-bottom: 20px;
  padding: 20px 0;
  font-size: 14px;
  font-weight: 800;
  color: #444444;
}

div.bet-info > p:first-child {
  margin-bottom: 15px;
}

.bet-info span.separate {
  margin-left: 8px;
  border-left: 2px solid #d6d6d6;
  margin-right: 12px;
}

div.bet-info .gold,
div.bet-info .expected {
  color: #3eb2c0;
}

div.bet-info p {
  margin-bottom: 0;
}

p.alert {
  color: #444444;
  padding: 0;
  margin-bottom: 20px;
}

p.alert i.icon-svg {
  width: 20px;
  height: 20px;
  margin-bottom: -5px;
  margin-right: 10px;
  background-color: #444444;
}
</style>
