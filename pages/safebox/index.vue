<template>
  <div class="default-ctn">
    <h5 class="title">금고</h5>
    <div class="table">
      <div class="flex">
        <div class="label">
          <p>소지 골드</p>
        </div>
        <div class="value">
          <p>
            {{ gold.toLocaleString() }}
            <span>골드</span>
          </p>
        </div>
      </div>
      <div class="flex">
        <div class="label">
          <p>금고 보유 골드</p>
        </div>
        <div class="value">
          <p>
            {{ safebox.toLocaleString() }}
            <span>골드</span>
          </p>
        </div>
      </div>
    </div>
    <div class="button-group flex">
      <button
        :class="`btn ${mode === MODE_DEPOSIT ? 'on' : ''}`"
        :disabled="requesting"
        @click="mode = MODE_DEPOSIT"
      >
        <p>입금</p>
      </button>
      <button
        :class="`btn ${mode === MODE_WITHDRAW ? 'on' : ''}`"
        :disabled="requesting"
        @click="mode = MODE_WITHDRAW"
      >
        <p>출금</p>
      </button>
    </div>
    <div class="input-group flex">
      <input id="gold" v-model="mGold" type="hidden" name="gold" />
      <b-input
        ref="mGoldClon"
        v-model="mGoldClon"
        type="text"
        name="gold"
        :placeholder="getPlaceHolder"
        style="font-size: 12px"
        @keyup.prevent="mGoldKeyup"
      />
      <b-btn size="sm" class="max" @click="onMaxClick">
        <p>max</p>
      </b-btn>
      <b-btn size="sm" @click="(mGold = 0), (mGoldClon = null)">
        <p>초기화</p>
      </b-btn>
    </div>
    <p class="message">{{ getMessage }}</p>
    <div class="bottom-buttons flex">
      <b-btn :disabled="requesting" variant="info" size="lg" @click="update">
        <p>{{ mode === MODE_WITHDRAW ? '출금하기' : '입금하기' }}</p>
      </b-btn>
      <button class="btn btn-lg" @click="onCloseClick">
        <p>닫기</p>
      </button>
    </div>
  </div>
</template>

<script>
import Vue from 'vue';
import { createNamespacedHelpers } from 'vuex';

const MODE_WITHDRAW = 'MODE_WITHDRAW';
const MODE_DEPOSIT = 'MODE_DEPOSIT';

const {
  mapState: safeboxState,
  mapActions: safeboxActions,
} = createNamespacedHelpers('user/safebox');

export default {
  layout: 'popup',
  data() {
    return {
      MODE_WITHDRAW,
      MODE_DEPOSIT,
      mode: null,
      mGold: 0,
      mGoldClon: null,
    };
  },
  computed: {
    ...safeboxState([
      'success',
      'message',
      'error',
      'gold',
      'safebox',
      'limited',
      'requesting',
    ]),
    getPlaceHolder() {
      if (this.mode === MODE_WITHDRAW) {
        return '출금하실 골드를 입력해 주세요.';
      } else {
        return '입금하실 골드를 입력해 주세요.';
      }
    },
    getMessage() {
      if (this.mGold > this.limited) {
        return '금고 보유한도를 초과하였습니다.';
      } else {
        return '금고 보유한도는 50,000,000,000 골드 입니다.';
      }
    },
  },
  watch: {
    mGoldClon(v) {
      Vue.nextTick(() => {
        if (v === null || v.length <= 0) {
          this.mGold = 0;
        } else {
          this.mGold = parseInt(v.replace(/,/g, '').replace(/[^0-9]+/g, ''));
        }

        if (isNaN(this.mGold)) {
          this.mGold = 0;
        }

        if (this.mode === MODE_DEPOSIT) {
          if (this.mGold > this.gold) {
            this.mGold = this.gold;
          }
        } else if (this.mode === MODE_WITHDRAW) {
          if (this.mGold > this.safebox) {
            this.mGold = this.safebox;
          }
        }

        if (this.mGold > this.limited) {
          this.mGold = this.limited;
        }

        this.mGoldClon = this.mGoldComma(this.mGold);
      });
    },
    mode(v) {
      this.mGold = 0;
      this.mGoldClon = null;
      this.$refs.mGoldClon.value = null;
    },
    success(v) {
      if (!v) {
        return;
      }
      this.showSingleButtonModal({
        message:
          '<p><span style="color: #3eb2c0">' +
          parseInt(this.mGold).toLocaleString() +
          '골드</span>를 <span style="color: #3eb2c0">' +
          (this.mode === MODE_WITHDRAW ? '출금' : '입금') +
          '</span>하였습니다.</p>',
        small: true,
        onConfirm: async () => {
          await this.loadSafebox();
          opener.postMessage(
            { from: 'safebox', safebox: this.safebox, gold: this.gold },
            window.location.origin
          );
          this.mGold = 0;
          this.mGoldClon = null;
          this.$refs.mGoldClon.value = null;
        },
      });
    },
    message(v) {
      if (v === null) {
        return;
      }
      this.showSingleButtonModal({
        message: v.replace('\\n', '<br/>'),
        small: true,
        onConfirm: () => {
          this.changeRequesting(false);
        },
      });
    },
  },
  async beforeMount() {
    this.mode = MODE_DEPOSIT;
    await this.loadSafebox();
  },
  methods: {
    ...safeboxActions({
      loadSafebox: 'load',
      updateSafebox: 'update',
      changeRequesting: 'changeRequesting',
    }),
    onMaxClick() {
      console.log('this.mode', this.mode);
      console.log('this.safebox', this.safebox);
      console.log('this.limited', this.limited);
      console.log('this.gold', this.gold);
      if (this.mode === MODE_WITHDRAW) {
        this.mGold = this.safebox;
        this.mGoldClon = this.mGoldComma(this.safebox);
        this.$refs.mGoldClon.value = this.mGoldClon;
        // console.log('part1', this.mGoldClon);
        return;
      }
      if (this.gold >= this.limited) {
        this.mGold = this.limited;
        this.mGoldClon = this.mGoldComma(this.limited);
        this.$refs.mGoldClon.value = this.mGoldClon;
        // console.log('part2', this.mGoldClon);
      } else {
        this.mGold = this.gold;
        this.mGoldClon = this.mGoldComma(this.gold);
        this.$refs.mGoldClon.value = this.mGoldClon;
        // console.log('part3', this.mGoldClon);
      }
    },
    onCloseClick() {
      window.close();
    },
    async update() {
      const { mode, mGold } = this;
      if (mGold <= 0) {
        this.showSingleButtonModal({
          message: '골드를 입력해 주세요',
        });
        return;
      }
      await this.updateSafebox({
        mode: mode === MODE_DEPOSIT ? 'in' : 'out',
        gold: parseInt(mGold),
      });
    },
    mGoldComma(v) {
      return v
        .toString()
        .replace(/[^0-9]+/g, '')
        .replace(/(^0+)/, '')
        .replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    },
    mGoldKeyup(e) {
      const { value } = e.target;
      if (value === null || value.length <= 0) {
        this.mGold = 0;
      } else {
        this.mGold = parseInt(value.replace(/,/g, '').replace(/[^0-9]+/g, ''));
      }
      this.mGoldClon = this.mGoldComma(this.mGold);

      // v.target.value = this.mGoldComma(v.target.value);
      // this.mGoldClon = this.mGoldComma(v.target.value);
      // if (this.mGoldClon) {
      //   this.mGold = this.mGoldClon.replace(/[^0-9]+/g, '');
      // }
    },
  },
};
</script>

<style scoped>
div.default-ctn {
  width: 500px;
  height: 355px;
  border-radius: 0;
  padding: 20px;
}

p {
  margin-bottom: 0;
}

.title {
  font-size: 16px;
  font-weight: 800;
  color: #444444;
  margin-bottom: 15px;
}

div.table div.flex {
  height: 40px;
  font-weight: 800;
  color: #888888;
}

div.table div.flex:first-child {
  border-top: 2px solid #3eb2c0;
  border-bottom: 1px solid #e5e5e5;
}

div.table div.flex:last-child {
  border-bottom: 2px solid #3eb2c0;
}

div.table div.flex div.label {
  width: 100px;
  background-color: #f2f2f2;
  padding: 11px 0 0 15px;
  height: 100%;
}

div.table div.flex div.value {
  flex: 1;
  padding: 11px 15px 0 0;
  text-align: right;
}

div.table div.flex:last-child div.value {
  color: #3eb2c0;
}

div.button-group {
  border-radius: 10px;
  background-color: #f2f2f2;
  margin-bottom: 10px;
}

div.button-group .btn {
  flex: 1;
  font-size: 14px;
  font-weight: 700;
  color: #999999;
  border: 1px solid transparent;
}

div.button-group .btn.on {
  color: #3eb2c0;
  border: 1px solid #3eb2c0;
  background-color: #d8f0f2;
}

.input-group {
  height: 40px;
  border-bottom: 1px solid #e6e6e6;
  align-items: center;
  margin-bottom: 15px;
}

p.message {
  color: #3eb2c0;
  font-weight: 700;
  margin-bottom: 25px;
}

.input-group input {
  flex: 1;
  height: fit-content;
  padding: 0 10px;
  border: unset;
}

.input-group input:focus {
  outline: unset;
  box-shadow: unset;
}

.input-group input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

/* Firefox */
.input-group input[type='number'] {
  -moz-appearance: textfield;
}

.input-group * {
  margin-right: 10px;
}

.input-group *:last-child {
  margin-right: 0;
}

.input-group .btn {
  width: 90px;
  height: 20px;
  font-size: 12px;
  padding: 0;
  border: 1px solid #e6e6e6;
  color: #999999;
  background-color: #f2f2f2;
}

.input-group .btn.max {
  color: #3eb2c0;
  border: 1px solid #3eb2c0;
  background-color: #d8f0f2;
  text-transform: uppercase;
}

div.bottom-buttons {
  align-items: center;
  justify-content: center;
}

div.bottom-buttons .btn {
  width: 160px;
  height: 40px;
  font-weight: 700;
  font-size: 14px;
  border-radius: 25px;
}

div.bottom-buttons .btn:first-child {
  margin-right: 20px;
}

div.bottom-buttons .btn:last-child {
  border: 2px solid #3eb2c0;
  color: #3eb2c0;
}
</style>
