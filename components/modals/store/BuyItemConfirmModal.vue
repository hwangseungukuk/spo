<template>
  <div class="modal-container default-ctn">
    <p class="message">선택한 내용으로 구매하시겠습니까?</p>
    <div class="accentTypeBg">
      <!-- <p class="item">선택상품 : {{ itemName }} | 수량 : {{ itemCount }}개</p>
      <p v-if="spoGold > 0" class="gold">
        지급 스포골드 : {{ (spoGold * itemCount).toLocaleString() }}
      </p>
      <p class="price">
        총 구매 금액 :
        <span>{{ (itemCount * itemPrice).toLocaleString() }}</span>
        <i class="pmang-cash-store"></i>
      </p> -->
      <dl>
        <dt>선택 상품</dt>
        <dd>{{ itemName }}</dd>
      </dl>
      <dl>
        <dt>구매 수량</dt>
        <dd>{{ itemCount }}개</dd>
      </dl>
      <dl v-show="spoGold > 0" class="bold">
        <dt>총 지급 골드</dt>
        <dd>{{ (spoGold * itemCount).toLocaleString() }} 스포골드</dd>
      </dl>
      <dl class="bold color">
        <dt>총 구매 금액</dt>
        <dd>{{ (itemCount * itemPrice).toLocaleString() }} 스포코인</dd>
      </dl>
    </div>
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
export const MODAL_OPTIONS = {
  height: 'auto',
  width: 500,
  adaptive: true,
  clickToClose: false,
};

export default {
  props: {
    itemName: { type: String, default: 'item-name' },
    itemCount: { type: Number, default: 0 },
    itemPrice: { type: Number, default: 0 },
    spoGold: { type: Number, default: 0 },
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

.accentTypeBg p {
  font-size: 14px;
}

.accentTypeBg dl {
  display: flex;
  width: 300px;
  margin: auto;
  color: #444;
  line-height: 23px;
  font-size: 14px;
}
.accentTypeBg dl.bold {
  font-weight: 800;
}
.accentTypeBg dl.color {
  color: #3eb2c0;
}
.accentTypeBg dl dt {
  flex-grow: 0.5;
  text-align: left;
}
.accentTypeBg dl.bold dt {
  font-weight: 800;
}
.accentTypeBg dl dd {
  flex-grow: 0.5;
  text-align: right;
  margin-bottom: 0px;
}

p.item {
  margin: 5px 0 15px;
  color: #444444;
}

p.gold {
  color: #aaaaaa;
}

p.price {
  color: #444444;
}

p.price > span {
  color: #3eb2c0;
}
</style>
