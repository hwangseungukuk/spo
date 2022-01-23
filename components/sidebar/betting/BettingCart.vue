<template>
  <div class="betting-cart">
    <div class="white_cover">
      <div class="bet-mode button-group flex">
        <b-btn
          variant="light"
          :class="`${MODE_CART} ${mode === MODE_CART ? 'on' : ''}`"
          @click="mode = MODE_CART"
        >
          <p>선택 내역</p>
        </b-btn>
        <b-btn
          variant="light"
          :class="`${MODE_CANCEL} ${mode === MODE_CANCEL ? 'on' : ''}`"
          @click="mode = MODE_CANCEL"
        >
          <p>베팅취소</p>
        </b-btn>
      </div>
      <template v-if="mode === MODE_CART">
        <b-form @submit.prevent="onSubmit">
          <template v-if="isLiveGameLoading">
            <div class="spinner white"></div>
          </template>
          <template v-else>
            <template v-if="hasItems">
              <div class="bet-list">
                <slot name="cart"></slot>
              </div>
              <div class="assets">
                <div class="flex">
                  <div class="expected">
                    <p class="rate">
                      배당률
                      <span>{{ rate }}</span>
                    </p>
                  </div>
                  <div class="my-gold">
                    <p>
                      보유 골드
                      <span>{{ myGold.toLocaleString() }}</span>
                    </p>
                  </div>
                </div>
                <div class="input-field">
                  <p>베팅골드</p>
                  <input
                    id="gold"
                    v-model="goldStr"
                    type="text"
                    name="gold"
                    placeholder="골드를 입력해 주세요."
                    @keyup.prevent="goldKeyup"
                  />
                  <b-btn size="sm" @click="goldStr = goldComma(setMinGold())">
                    <p>MIN</p>
                  </b-btn>
                  <b-btn size="sm" @click="goldStr = goldComma(setMaxGold())">
                    <p>MAX</p>
                  </b-btn>
                </div>
                <div class="add-button-group flex">
                  <b-btn
                    v-for="(addButton, index) in ADD_BUTTON_GROUPS"
                    :key="`add-button-${index}-${addButton.value}`"
                    @click="goldStr = goldComma(gold + addButton.value)"
                  >
                    <span>{{ addButton.text }}</span>
                  </b-btn>
                </div>
                <div class="expect-gold flex">
                  <p>
                    예상 당첨골드
                    <span>{{ expectedGold.toLocaleString() }}</span>
                  </p>
                  <p>
                    중복
                    <span>{{ countSameBets }}</span>
                  </p>
                </div>
                <div class="flex">
                  <switch-comp
                    label="위치 고정"
                    @change="$emit('on-pinned', $event)"
                  ></switch-comp>
                  <switch-comp
                    :checked="holdFolders"
                    label="폴더 유지"
                    @change="$emit('on-hold-folders', $event)"
                  ></switch-comp>
                  <b-btn
                    :disabled="!hasItems"
                    variant="secondary"
                    class="reset"
                    size="sm"
                    @click="onResetClick"
                  >
                    <p>내역 초기화</p>
                  </b-btn>
                </div>
              </div>
              <button type="submit" class="btn btn-lg do-betting gradient-bg">
                <p>
                  {{ requestBetting ? '승부예측 중입니다.' : '승부예측' }}
                </p>
              </button>
            </template>
            <template v-else>
              <div class="default-ctn no-betting-items">
                <p>선택된 경기가 없습니다.</p>
                <p>경기를 선택해 주세요.</p>
              </div>
            </template>
          </template>
        </b-form>
      </template>
      <template v-else>
        <template v-if="hasCancelItems">
          <div class="cancel-container">
            <div class="custom-control custom-checkbox">
              <input
                id="_bet_cart_cancel_select_all_"
                type="checkbox"
                class="custom-control-input"
                :checked="checkedCancelableSelectAll"
                @click="onCheckClick"
              />
              <label
                for="_bet_cart_cancel_select_all_"
                class="custom-control-label"
              >
                <span>전체 선택</span>
              </label>
            </div>
            <slot name="cancel"></slot>
            <div class="button-group flex">
              <b-btn variant="info" @click="onCancelResetClick">
                <p>초기화</p>
              </b-btn>
              <b-btn variant="info" @click="$emit('cancel-items')">
                <p>베팅 취소</p>
              </b-btn>
            </div>
          </div>
        </template>
        <template v-else>
          <div class="default-ctn no-betting-items">
            <p style="padding-top: 10px">취소 가능한 베팅내역이 없습니다.</p>
          </div>
        </template>
      </template>
    </div>
  </div>
</template>

<script>
import SwitchComp from '~/components/common/SwitchComp';

export const MODE_CART = 'cart';
export const MODE_CANCEL = 'cancel';

const MIN_BET_GOLD = 10000;
const MAX_BET_GOLD = 50000000;

const MAX_EXPECTED_GOLD = 30000000000;

const ADD_BUTTON_GROUPS = [
  {
    text: '100만',
    value: 1000000,
  },
  {
    text: '500만',
    value: 5000000,
  },
  {
    text: '1,000만',
    value: 10000000,
  },
  {
    text: '3,000만',
    value: 30000000,
  },
  {
    text: '5,000만',
    value: 50000000,
  },
];

export default {
  components: {
    SwitchComp,
  },
  props: {
    hasItems: { type: Boolean, default: false },
    hasCancelItems: { type: Boolean, default: false },
    rate: { type: Number, default: 0 },
    myGold: { type: Number, default: 0 },
    holdFolders: { type: Boolean, default: true },
    requestBetting: { type: Boolean, default: false },
    countSameBets: { type: Number, default: 0 },
    checkedCancelableSelectAll: { type: Boolean, default: false },
    isLiveGameLoading: { type: Boolean, default: false },
  },
  data() {
    return {
      MODE_CART,
      MODE_CANCEL,
      MIN_BET_GOLD,
      MAX_BET_GOLD,
      MAX_EXPECTED_GOLD,
      ADD_BUTTON_GROUPS,
      mode: MODE_CART,
      gold: 0,
      goldStr: '0',
    };
  },
  computed: {
    expectedGold() {
      const { rate, gold } = this;
      const result = rate * gold.toString().replace(/[^0-9]+/g, '');
      return Math.floor(result);
    },
  },
  watch: {
    $route() {
      this.mode = MODE_CART;
    },
    hasItems(v) {
      if (v) {
        return;
      }
      this.goldStr = this.goldComma(MIN_BET_GOLD);
    },
    mode(v) {
      this.$emit('mode', this.mode);
    },
    goldStr(v) {
      console.log('goldStr', v);
      let gold = 0;
      if (v.length <= 0 || v === null) {
        gold = 0;
      } else {
        gold = parseInt(v.replace(/,/g, ''));
      }
      this.gold = gold;

      if (gold > this.myGold) {
        this.goldStr = this.goldComma(this.setMaxGold());
        return;
      }
      if (gold > MAX_BET_GOLD) {
        this.goldStr = this.goldComma(MAX_BET_GOLD);
      }
    },
  },
  beforeMount() {
    this.goldStr = this.goldComma(MIN_BET_GOLD);
  },
  methods: {
    onSubmit() {
      const { requestBetting, gold, expectedGold } = this;
      if (requestBetting) {
        return;
      }
      this.$emit('betting', {
        gold,
        expected: expectedGold,
        isExpectedOver: expectedGold > MAX_EXPECTED_GOLD,
      });
    },
    onCheckClick({ target }) {
      this.$emit('select-all', target.checked);
    },
    onResetClick() {
      this.goldStr = this.goldComma(this.setMinGold());
      this.$emit('reset');
    },
    setMinGold() {
      if (this.myGold <= MIN_BET_GOLD) {
        return this.myGold;
      } else {
        return MIN_BET_GOLD;
      }
    },
    setMaxGold() {
      if (this.myGold > MAX_BET_GOLD) {
        return MAX_BET_GOLD;
      } else {
        return this.myGold;
      }
    },
    onCancelResetClick() {
      this.$emit('cancel-reset');
    },
    goldComma(v) {
      return v
        .toString()
        .replace(/[^0-9]+/g, '')
        .replace(/(^0+)/, '')
        .replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    },
    goldKeyup(v) {
      if (v.which >= 37 && v.which <= 40) return;
      this.goldStr = this.goldComma(v.target.value);
    },
  },
};
</script>

<style scoped>
div.betting-cart > div {
  margin-bottom: 5px;
}

div.betting-cart > div.flex {
  line-height: 27px;
}

div.betting-cart > div.flex .title {
  line-height: 27px;
}

.betting-cart {
  margin-bottom: 20px;
}

.title {
  font-size: 18px;
  font-weight: 800;
  margin-bottom: 0;
}

.bet-mode {
  background-color: #f2f2f2;
  border-radius: 10px;
  margin-bottom: 10px;
}

.bet-mode > .btn {
  background-color: transparent;
  border: 1px solid transparent;
  color: #999999;
  flex: 1;
  font-size: 14px;
  font-weight: 700;
}

.bet-mode > .btn:hover {
  background-color: unset;
  box-shadow: unset;
  color: #3eb2c0cc;
  outline: unset;
}

.bet-mode > .btn:focus,
.bet-mode > .btn:active {
  outline: unset;
  box-shadow: 0 0 0 2px #3eb2c055;
}

.bet-mode > .btn.on {
  background-color: #d8f0f2;
  box-shadow: unset;
  border: 1px solid #3eb2c0;
  color: #3eb2c0;
  outline: unset;
}

.assets {
  width: auto;
  color: #888888;
  border-top: 1px solid #e6e6e6;
}

.assets > div {
  height: 45px;
  padding: 5px 0;
  border-bottom: 1px solid #e6e6e6;
  align-items: center;
  display: flex;
}

.assets > div p {
  margin-bottom: 0;
  font-weight: 800;
  display: inline-block;
}

.assets > div p span {
  text-align: right;
  font-family: 'NanumSquare', 'NanumBarunGothic', sans-serif;
}

.assets .expected,
.assets .my-gold {
  display: inline-block;
}

.assets .expected {
  width: 125px;
  display: flex;
}
.assets .expected p {
  line-height: 16px;
}

.assets .expected p span {
  display: inline-block;
  color: #3eb2c0;
  padding-right: 8px;
  border-right: 1px solid #e6e6e6;
  width: 89px;
}

.assets .my-gold {
  margin-left: 8px;
}

.assets .my-gold p span {
  display: inline-block;
  width: 127px;
}

.assets .input-field {
  padding: 11px 0 0px;
  display: block;
  height: 35px;
  width: 100%;
  border-bottom: unset;
}

.assets .input-field > p {
  width: 45px;
  margin-bottom: 0;
}

.assets .input-field input {
  flex: 1;
  margin: 0 3px 0 7px;
  padding: 0 5px;
  text-align: right;
  border: unset;
  background-color: unset;
  transition: all 0.3s;
  width: 129px;
  color: #3eb2c0;
  border: 1px solid #e6e6e6;
  border-radius: 5px;
  line-height: 20px;
  height: 24px;
}

.assets .input-field input:focus {
  outline: unset;
  box-shadow: unset;
}

.assets .input-field input[type='number']::-webkit-inner-spin-button,
.assets .input-field input[type='number']::-webkit-outer-spin-button {
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
  margin-right: 5px;
}

.assets .input-field input::placeholder {
  color: #3eb2c0;
  font-size: 11px;
}

.assets .input-field .btn.btn-sm {
  background-color: #d8f0f2;
  border: 1px solid #3eb2c0;
  color: #3eb2c0;
  height: 24px;
  font-size: 11px;
  width: 58px;
  padding: 0;
  margin-left: 5px;
}

.assets .input-field .btn.btn-sm p {
  line-height: 24px;
  font-weight: 400;
}

.assets .input-field .btn.btn-sm:hover,
.assets .input-field .btn.btn-sm:active {
  background-color: #3eb2c0aa;
  color: #ffffff;
}

.assets .input-field .btn.btn-sm:focus,
.assets .input-field .btn.btn-sm:active {
  box-shadow: 0 0 0 2px #3eb2c055;
}

.assets .input-field .btn.btn-sm:active {
  background-color: #3eb2c0;
  color: white;
}

.assets .add-button-group .btn {
  display: inline-block;
  background: #aaa;
  color: #fff;
  line-height: 24px;
  height: 24px;
  width: 58px;
  border-radius: 5px;
  border: none;
  margin-right: 5px;
  font-size: 11px;
  flex: auto;
  padding: 0;
}

.assets .add-button-group .btn:last-child {
  margin-right: 0;
}

.assets .my-gold p:last-child {
  flex: 1;
  text-align: right;
}

.assets > div.expected p:first-child {
  width: 110px;
  margin-right: 10px;
}

.assets > div.expected p:last-child {
  flex: 1;
}

.assets > div.expected p > span {
  color: #3eb2c0;
  display: inline-block;
  text-align: right;
}

.assets > div.expected p:first-child > span {
  width: 65px;
}

.assets > div.expected p:last-child > span {
  width: 115px;
}

.expect-gold p {
  font-weight: 800;
}

.expect-gold p > span {
  display: inline-block;
  color: #3eb2c0;
  margin-left: 10px;
  min-width: 30px;
}

.expect-gold p:first-of-type {
  flex: 1;
}

.expect-gold p:first-of-type > span {
  width: 140px;
  max-width: 140px;
}

.expect-gold p:not(:first-of-type) {
  margin-left: 10px;
  padding-left: 10px;
  border-left: 1px solid #e6e6e6;
}

.assets + .flex {
  padding: 10px 0;
}

.assets > div:nth-last-of-type(1) > div {
  width: 93px;
}
.assets > div:nth-last-of-type(1) > div:nth-last-of-type(1) {
  left: 10px;
  position: relative;
}

.custom-switch.b-custom-control-lg {
  padding-left: 0;
}

.assets > div:nth-last-of-type(1) > div.switch-group {
  width: 92px;
  margin-right: 15px;
}

.assets > div:nth-last-of-type(1) > button {
  margin-left: 16px;
  width: 80px;
  font-size: 12px;
}

.assets > div:nth-last-of-type(1) > button p {
  font-weight: 400;
}

.no-betting-items {
  width: auto;
  height: 70px;
  padding-top: 15px;
  border: 1px solid #e6e6e6;
  background-color: #f2f2f2;
  font-weight: 700;
  font-size: 12px;
  color: #888888;
}

.no-betting-items p {
  margin-bottom: 0;
  text-align: center;
}

.btn.reset {
  background-color: #aaaaaa;
  color: white;
  font-size: 12px;
  font-weight: 700;
  border: unset;
  width: 100px;
  height: 25px;
}

.btn.reset:hover,
.btn.reset:focus,
.btn.reset:active {
  border: unset;
}

.btn.do-betting {
  margin-top: 10px;
  font-weight: 800;
  width: 100%;
  height: 50px;
  border: unset;
  color: white;
  font-size: 16px;
  -webkit-box-shadow: inset 2px 3px 4px rgba(255, 255, 255, 0.4),
    inset -2px -4px 4px rgba(51, 154, 184, 0.8);
  -moz-box-shadow: inset 2px 3px 4px rgba(255, 255, 255, 0.4),
    inset -2px -4px 4px rgba(51, 154, 184, 0.8);
  box-shadow: inset 2px 3px 4px rgba(255, 255, 255, 0.4),
    inset -2px -4px 4px rgba(51, 154, 184, 0.8);
  transition: all 0.3s;
}

.btn.do-betting:focus,
.btn.do-betting:hover {
  outline: unset;
  -webkit-box-shadow: inset 2px 3px 4px rgba(255, 255, 255, 0.4),
    inset -2px -4px 4px rgba(51, 154, 184, 0.8), 0 0 5px 1px #3eb2c055;
  -moz-box-shadow: inset 2px 3px 4px rgba(255, 255, 255, 0.4),
    inset -2px -4px 4px rgba(51, 154, 184, 0.8), 0 0 5px 1px #3eb2c055;
  box-shadow: inset 2px 3px 4px rgba(255, 255, 255, 0.4),
    inset -2px -4px 4px rgba(51, 154, 184, 0.8), 0 0 5px 1px #3eb2c055;
}

.btn.do-betting:active {
  outline: unset;
  -webkit-box-shadow: inset 2px 3px 4px rgba(255, 255, 255, 0.4),
    inset -2px -4px 4px rgba(51, 154, 184, 0.8), 0 0 5px 1px #3eb2c0aa;
  -moz-box-shadow: inset 2px 3px 4px rgba(255, 255, 255, 0.4),
    inset -2px -4px 4px rgba(51, 154, 184, 0.8), 0 0 5px 1px #3eb2c0aa;
  box-shadow: inset 2px 3px 4px rgba(255, 255, 255, 0.4),
    inset -2px -4px 4px rgba(51, 154, 184, 0.8), 0 0 5px 1px #3eb2c0aa;
}

.cancel-container .button-group .btn {
  flex: 1;
  font-size: 14px;
  font-weight: 700;
}

.cancel-container .button-group .btn:first-child {
  margin-right: 5px;
}

.cancel-container .button-group .btn:last-child {
  margin-left: 5px;
}
</style>
