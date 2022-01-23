<template>
  <div class="modal-container default-ctn">
    <p class="message">본 아이템을 구매취소 하시겠습니까?</p>
    <div class="accentTypeBg">
      <dl>
        <dt>상품명</dt>
        <dd>{{ itName }}</dd>
      </dl>
      <dl>
        <dt>선택 수량</dt>
        <dd>
          <select
            id="select-quantity"
            v-model="mField"
            name="select-quantity"
            class="selectbox"
          >
            <option
              v-for="quant in Number(itCnt)"
              :key="`search-quantity-option-${quant}`"
              :value="quant"
            >
              {{ quant }}
            </option>
          </select>
        </dd>
      </dl>
      <dl class="blue">
        <dt>상품 가격</dt>
        <dd>{{ totalPrice.toLocaleString() }}원</dd>
      </dl>
    </div>
    <div class="button-group flex">
      <div class="spacer"></div>
      <b-btn variant="info" class="btn-confirm" @click="onConfirmClick">
        <p>구매취소</p>
      </b-btn>
      <b-btn variant="light" class="btn-cancel" @click="onCancelClick">
        <p>닫기</p>
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
    itName: { type: String, default: '' },
    itCnt: { type: String, default: '' },
    itemPrice: { type: String, default: '' },
    onConfirm: { type: Function, default: () => {} },
    onCancel: { type: Function, default: () => {} },
  },
  data() {
    return {
      mField: this.itCnt,
      totalPrice: this.itemPrice * this.itCnt,
    };
  },
  watch: {
    mField(v) {
      this.totalPrice = this.itemPrice * v;
    },
  },
  methods: {
    onConfirmClick() {
      this.onConfirm({ mField: this.mField });
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
  text-align: center;
  align-items: center;
  margin: 5px auto;
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

.accentTypeBg p span {
  color: #444444;
}
.accentTypeBg .desc {
  display: inline-flex;
  align-items: center;
  margin-top: 5px;
}
.accentTypeBg span.coin {
  color: #3eb2c0;
}

.accentTypeBg .spolive-coin {
  width: 16px;
  height: 16px;
  background-color: #3eb2c0;
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

.blue * {
  color: #3eb2c0;
}
select[name='select-quantity'] {
  width: 118px;
}
</style>
