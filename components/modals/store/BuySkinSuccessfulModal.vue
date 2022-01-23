<template>
  <div class="modal-container default-ctn">
    <p class="message">
      스킨구매가 완료되었습니다. <br />
      구매한 스킨을 적용 하시겠습니까?
    </p>
    <div class="accentTypeBg">
      <p class="item">{{ itemName }}</p>
    </div>
    <div class="button-group flex">
      <div class="spacer"></div>
      <b-btn variant="info" class="btn-confirm" @click="onConfirmClick">
        <p>적용</p>
      </b-btn>
      <b-btn variant="info" class="btn-cancel" @click="onCancelClick">
        <p>취소</p>
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
  props: {
    itemName: { type: String, default: 'item-name' },
    onConfirm: { type: Function, default: () => {} },
    onCancel: { type: Function, default: () => {} },
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
};
</script>

<style scoped>
@import url(~assets/css/modal.css);

.modal-container {
  padding: 40px 0 80px;
}

i.pmang-cash-store {
  width: 19px;
  height: 19px;
  display: inline-block;
  border: 1px solid #dfdfdf;
  border-radius: 19px;
  background-size: 17px;
  margin-bottom: -5px;
}

.accentTypeBg {
  padding: 5px 0;
}
.accentTypeBg p {
  font-size: 16px;
  font-weight: 800;
}

p.item {
  margin: 10px 0;
  color: #3eb2c0;
}
</style>
