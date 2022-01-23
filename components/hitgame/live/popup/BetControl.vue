<template>
  <div
    :class="`bet-control ${opened ? 'opened' : ''}`"
    @click="opened ? (e) => e.stopPropagation() : undefined"
  >
    <button class="btn btn-secondary btn-sm close" @click="$emit('toggle')">
      <i :class="`icon-svg arrow ${opened ? 'down' : 'up'} thin`"></i>
    </button>
    <b-form class="controls default-ctn" @submit.prevent="onSubmit">
      <div class="flex">
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
          <div class="expect-gold inline-flex">
            <p>예상 당첨골드</p>
            <div class="spacer"></div>
            <p class="accent">{{ expectedGold.toLocaleString() }}</p>
          </div>
        </div>
        <div class="bets">
          <div class="slot">
            <slot name="slot"></slot>
          </div>
          <b-btn
            type="submit"
            size="lg"
            variant="light"
            class="do-betting gradient-bg"
          >
            <p>
              {{ requestBetting ? '승부예측 중입니다.' : '승부예측' }}
            </p>
          </b-btn>
        </div>
      </div>
    </b-form>
    <div class="description">
      <p>
        라이브 게임은 승부예측이 즉시 반영되며, 베팅 취소가 불가하오니&nbsp;
        게임 플레이에 유의해주세요.
      </p>
    </div>
  </div>
</template>

<script>
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
  props: {
    opened: { type: Boolean, default: false },
    rate: { type: Number, default: 0 },
    myGold: { type: Number, default: 0 },
    requestBetting: { type: Boolean, default: false },
  },
  data() {
    return {
      MIN_BET_GOLD,
      MAX_BET_GOLD,
      MAX_EXPECTED_GOLD,
      ADD_BUTTON_GROUPS,
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
    opened(v) {
      if (v) {
        return;
      }
      this.goldStr = this.goldComma(MIN_BET_GOLD);
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
      const { gold, expectedGold, requestBetting } = this;
      if (requestBetting) {
        return;
      }
      this.$emit('betting', {
        gold,
        expected: expectedGold,
        isExpectedOver: expectedGold > MAX_EXPECTED_GOLD,
      });
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
.bet-control {
  position: absolute;
  bottom: 0;
  right: 0;
  left: 0;
  transform: translateY(90%);
  transition: all 0.3s;
  text-align: center;
}

.bet-control p {
  margin: 0;
}

.bet-control.opened {
  transform: translateY(0);
}

.bet-control .btn.close {
  float: unset;
  background-color: #aaaaaa;
  border-radius: 10px 10px 0 0;
  width: 70px;
  height: 26px;
  opacity: 1;
}

.bet-control .btn.close .icon-svg {
  width: 14px;
  height: 14px;
  float: unset;
  background-color: white;
  opacity: 1;
}

.bet-control .controls {
  height: 200px;
  padding: 15px 0;
  border-radius: unset;
  border-top: 1px solid #e6e6e6;
  border-left: unset;
  border-right: unset;
  border-bottom: unset;
}

.assets {
  width: auto;
  color: #888888;
  margin: 0 20px;
}

.assets > div {
  height: 45px;
  padding: 5px 0;
  border-bottom: 1px solid #e6e6e6;
  align-items: center;
  display: flex;
}

.assets > div:last-of-type {
  border-bottom: unset;
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
  display: inline-flex;
  height: 35px;
  width: 100%;
  border-bottom: unset;
}

.assets .input-field > p {
  min-width: 58px;
  margin-bottom: 0;
  text-align: left;
}

.assets .input-field input {
  flex: 1;
  margin-left: 5px;
  padding: 0 5px;
  text-align: right;
  border-radius: 5px;
  background-color: unset;
  transition: all 0.3s;
  width: 120px;
  color: #3eb2c0;
  border: 1px solid #e6e6e6;
  line-height: 20px;
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

.bet {
  flex: 1;
  margin-right: 20px;
}

.bet-control .description {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 35px;
  color: #aaaaaa;
  background-color: #f2f2f2;
}

.bet-control .description p {
  width: fit-content;
}

.btn.btn-light.do-betting {
  font-weight: 800;
  width: 350px;
  height: 60px;
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

.btn.btn-light.do-betting:hover {
  outline: unset;
  -webkit-box-shadow: inset 2px 3px 4px rgba(255, 255, 255, 0.4),
    inset -2px -4px 4px rgba(51, 154, 184, 0.8), 0 0 5px 1px #3eb2c055;
  -moz-box-shadow: inset 2px 3px 4px rgba(255, 255, 255, 0.4),
    inset -2px -4px 4px rgba(51, 154, 184, 0.8), 0 0 5px 1px #3eb2c055;
  box-shadow: inset 2px 3px 4px rgba(255, 255, 255, 0.4),
    inset -2px -4px 4px rgba(51, 154, 184, 0.8), 0 0 5px 1px #3eb2c055;
}

/* .btn.btn-light.do-betting:focus {
  outline: unset;
  -webkit-box-shadow: inset 2px 3px 4px rgba(255, 255, 255, 0.4),
    inset -2px -4px 4px rgba(51, 154, 184, 0.8), 0 0 5px 1px #3eb2c088;
  -moz-box-shadow: inset 2px 3px 4px rgba(255, 255, 255, 0.4),
    inset -2px -4px 4px rgba(51, 154, 184, 0.8), 0 0 5px 1px #3eb2c088;
  box-shadow: inset 2px 3px 4px rgba(255, 255, 255, 0.4),
    inset -2px -4px 4px rgba(51, 154, 184, 0.8), 0 0 5px 1px #3eb2c088;
} */

.btn.btn-light.do-betting:active {
  outline: unset;
  -webkit-box-shadow: inset 2px 3px 4px rgba(255, 255, 255, 0.4),
    inset -2px -4px 4px rgba(51, 154, 184, 0.8), 0 0 5px 1px #3eb2c0aa;
  -moz-box-shadow: inset 2px 3px 4px rgba(255, 255, 255, 0.4),
    inset -2px -4px 4px rgba(51, 154, 184, 0.8), 0 0 5px 1px #3eb2c0aa;
  box-shadow: inset 2px 3px 4px rgba(255, 255, 255, 0.4),
    inset -2px -4px 4px rgba(51, 154, 184, 0.8), 0 0 5px 1px #3eb2c0aa;
}
</style>
