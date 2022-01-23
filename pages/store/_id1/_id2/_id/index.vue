<template>
  <div v-if="item.it_id > 0" class="store-content default-ctn">
    <div class="itemInfo">
      <div class="item">
        <p class="image">
          <b-img :src="`${getImagePath}/data/cmitem/${item.it_img1}`" alt="" />
        </p>
      </div>
      <div class="info">
        <h1>
          <span
            v-if="item.it_type1 == 1 && item.it_name !== null"
            class="badge recommend"
            >추천</span
          >
          <span
            v-if="item.it_type2 == 1 && item.it_name !== null"
            class="badge hit"
            >히트</span
          >
          <span
            v-if="item.it_type3 == 1 && item.it_name !== null"
            class="badge new"
            >최신</span
          >
          <span class="title">{{ item.it_name }} {{ item.ca_name }}</span>
        </h1>
        <div class="dotted-slider"></div>
        <dl class="pmang">
          <dt>구매 금액</dt>
          <dd>
            <i class="icon-svg spolive-coin"></i>
            {{ Number(item.it_price).toLocaleString() }} 스포코인
          </dd>
        </dl>
        <dl v-if="$route.params.id1 == 10" class="spogold">
          <dt>지급 골드</dt>
          <dd>
            <i class="icon-svg spolive-gold"></i>
            {{ Number(item.it_goldrise).toLocaleString() }} 스포골드
          </dd>
        </dl>
        <div class="dotted-slider"></div>
        <dl class="quantity">
          <dt>
            구매 수량
            <span>최대 50개까지 선택 가능합니다.</span>
          </dt>
          <dd>
            <select
              id="select-quantity"
              v-model="mField"
              name="select-quantity"
              class="selectbox"
            >
              <option
                v-for="quant in 50"
                :key="`search-quantity-option-${quant}`"
                :value="quant"
              >
                {{ quant }}
              </option>
            </select>
          </dd>
        </dl>
        <div class="buyList">
          <nuxt-link
            tag="button"
            variant="info"
            class="btn btn-list"
            :to="{
              name: 'store-id1-id2',
              params: { id1: $route.params.id1, id2: $route.params.id2 },
              query: {
                ...$route.query,
              },
            }"
          >
            <p>목록</p>
          </nuxt-link>
          <b-btn type="button" class="btn gradient-bg" @click="purchase"
            >구매하기</b-btn
          >
        </div>
      </div>
    </div>
    <div class="itemDesc">
      <dl>
        <dt>상품설명</dt>
        <dd v-html="item.it_explan"></dd>
      </dl>
      <div class="dotted-slider"></div>
      <dl>
        <dt>아이템 사용방법</dt>
        <dd v-html="item.it_explan2"></dd>
      </dl>
      <div class="dotted-slider"></div>
      <dl>
        <dt>주의사항</dt>
        <dd v-html="item.it_explan3"></dd>
      </dl>
    </div>
  </div>
</template>

<script>
import { createNamespacedHelpers } from 'vuex';
// import StoreBoardItem from '~/components/store/StoreBoardItem';

import paymentMixin from '~/mixins/payment';

const {
  mapState: storeDetailState,
  mapActions: storeDetailActions,
} = createNamespacedHelpers('store/detail');

const {
  mapState: storeBuyState,
  mapActions: storeBuyActions,
} = createNamespacedHelpers('store/buy');

const {
  mapState: changeState,
  mapActions: changeActions,
} = createNamespacedHelpers('mypage/inventory/gameskin/change');

export default {
  components: {
    // StoreBoardItem,
  },
  mixins: [paymentMixin],
  data() {
    return {
      id: null,
      item: [],
      mField: 1,
      sumPrice: 0,
      sumGoldrise: 0,
    };
  },
  computed: {
    ...changeState({
      isChanged: 'true',
      changeMessage: 'message',
    }),
    ...storeDetailState([
      'success',
      'result',
      'message',
      'error',
      'data',
      'comment',
      'loading',
    ]),
    ...storeBuyState({
      buySuccess: 'success',
      buyResult: 'result',
      buyType: 'type',
      buyMsg: 'msg',
      buyData: 'data',
    }),
    getImagePath() {
      return process.env.STORE_IMAGE_URL;
    },
  },
  watch: {
    mField(v) {
      this.sumPrice = Number(this.item.it_price) * Number(v);
      this.sumGoldrise = Number(this.item.it_goldrise) * Number(v);
    },
    buyResult(v) {
      if (v === 'OK') {
        this.$auth.fetchUser();
        if (this.$route.params.id1 === '10') {
          this.showBuySkinSuccessfulModal({
            name: this.item.it_name,
            onConfirm: async () => {
              await this.changeGameskins({
                mode: '1',
                caId: this.$route.params.id2,
                skinIndex: this.item.skinIndex,
              });
            },
            onCancel: () => {
              console.log('onCancel');
              this.$router.push({
                name: 'mypage-inventory-gameskin',
                query: {
                  status: this.$route.params.id2,
                },
              });
            },
          });
        } else {
          this.showBuySuccessfulModal({
            name: this.item.it_name,
            onConfirm: () => {
              this.$router.push({
                name: 'mypage-inventory-item',
                query: {
                  status: this.$route.params.id2,
                },
              });
            },
          });
        }
        // this.$router.push({
        //   name: 'mypage-inventory',
        // });
      } else if (v === 'FAIL') {
        this.showSingleButtonModal({
          message: this.buyMsg,
        });
      }
    },
    changeMessage(v) {
      if (v === null) {
        return;
      }
      this.showSingleButtonModal({
        message: v,
        onConfirm: () => {
          this.$router.push({
            name: 'mypage-inventory-gameskin',
            query: {
              status: this.$route.params.id2,
            },
          });
        },
      });
    },
    message(v) {
      if (v === null) {
        return;
      }
      this.showSingleButtonModal({
        message: v.replace('\\n', '<br />'),
        onConfirm: () => {
          this.$router.push({
            name: 'store-id1-id2',
            params: {
              id1: this.$route.params.id1,
              id2: this.$route.params.id2,
            },
            query: {
              ...this.$route.query,
            },
          });
        },
      });
    },
  },
  beforeMount() {
    this.id = this.$route.params.id;
  },
  async mounted() {
    const { id } = this;
    await this.getDetail({ id });
    this.item = this.data;
    this.sumPrice = Number(this.item.it_price) * Number(this.mField);
    this.sumGoldrise = Number(this.item.it_goldrise) * Number(this.mField);
  },
  beforeDestroy() {
    this.changeClear();
    this.clearDetail();
    this.clearBuyItem();
  },
  methods: {
    ...changeActions({
      changeGameskins: 'changeGameskins',
      changeClear: 'clear',
    }),
    ...storeDetailActions({
      getDetail: 'getDetail',
      clearDetail: 'clear',
    }),
    ...storeBuyActions({
      buyItem: 'buyItem',
      clearBuyItem: 'clear',
    }),
    purchase() {
      if (!this.$auth.loggedIn) {
        this.showPleaseLogInModal();
        return;
      }
      if (this.$auth.user.spoCoin < this.sumPrice) {
        this.showSingleButtonModal({
          message: '보유 코인이 부족합니다.<br />충전 후 이용해 주세요.',
          description: null,
          onConfirm: () => {
            this._openChargePage();
          },
        });
        return;
      }
      this.showBuyConfirmModal({
        name: this.item.it_name,
        count: this.mField,
        price: parseInt(this.item.it_price),
        gold: parseInt(this.item.it_goldrise),
        onConfirm: async () => {
          await this.buyAction();
        },
      });
    },
    async buyAction() {
      await this.buyItem({ itId: this.id, qty: this.mField });
    },
  },
};
</script>

<style scoped>
div.store-content {
  padding: 20px;
  transform: skew(-0.03deg);
  border-radius: 0 0 10px 10px;
}
.dotted-slider {
  border-bottom: 1.5px dashed #ddd;
  margin: 20px 0;
}
.itemInfo {
  display: flex;
  padding-bottom: 20px !important;
}
.itemInfo .item {
  width: 295px;
  height: 290px;
}
.itemInfo .item .image {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 275px;
  height: 290px;
  border: 1px solid #d9d9d9;
  border-radius: 10px;
}
.itemInfo .item .image img {
  height: 250px;
}
.itemInfo .info {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
}
.itemInfo .info h1 {
  font-size: 0px;
  margin-bottom: 0px;
}
.itemInfo .info h1 .title {
  font-size: 16px;
  font-weight: 800 !important;
  color: #3c577e;
}

.itemInfo .info .badge {
  width: 50px;
  height: 25px;
  line-height: 20px;
  border-radius: 5px;
  color: #fffb9b;
  font-size: 14px;
  font-weight: 400;
  margin-right: 10px;
}
.itemInfo .info .badge.recommend {
  background: #3c577e;
  z-index: 1;
}
.itemInfo .info .badge.hit {
  background: #3292c9;
  z-index: 2;
}
.itemInfo .info .badge.new {
  background: #3eada5;
  z-index: 3;
}

.itemInfo .info dl {
  display: flex;
  justify-content: space-between;
  height: 25px;
  align-items: center;
}
.itemInfo .info dl dt {
  font-weight: 800;
}
.itemInfo .info dl dt span {
  font-size: 12px;
  color: #888;
  margin-left: 25px;
  font-weight: 400;
}
.itemInfo .info dl dd {
  display: flex;
  align-items: center;
  font-weight: 800;
  color: #3eb2c0;
  margin-bottom: 0px;
}
.itemInfo .info .buyList {
  margin-top: 20px;
  display: flex;
  justify-content: space-between;
}
.itemInfo .info .buyList button.gradient-bg {
  flex: 1;
  border: 0px;
}
.btn.btn-list {
  width: 155px;
  height: 45px;
  background-color: #d8f0f2;
  color: #3eb2c0;
  border-radius: 10px;
  margin-right: 10px;
}

.btn.btn-list:focus {
  outline: unset;
  box-shadow: 0 0 0 3px #3eb2c088;
}

.btn.btn-list:hover,
.btn.btn-list:active {
  background-color: #3eb2c0;
  color: white;
  border-radius: 10px;
  border: 1px solid #3eb2c0;
}

.itemDesc {
  background-color: #f2f2f2;
  border-radius: 10px;
  padding: 20px;
}
.itemDesc dl {
  display: flex;
  margin-bottom: 20px;
}
.itemDesc dl dt {
  position: relative;
  width: 273px;
  font-size: 14px;
  font-weight: 800;
  color: #3eb2c0;
  padding-top: 15px;
}
.itemDesc dl dt::before {
  content: '';
  position: absolute;
  top: 0px;
  left: 0px;
  width: 50px;
  height: 5px;
  background: #3eb2c0;
}
.itemDesc dl dd {
  flex: 1;
}
.itemDesc dl dd h2 {
  font-size: 12px;
  color: #444;
  font-weight: 800;
  margin-bottom: 12px;
}
.itemDesc dl dd ul li {
  list-style: none;
  margin-bottom: 22px;
}
.itemDesc dl dd ul li:last-child {
  margin-bottom: 0px;
}
i.pmang-cash-store {
  width: 19px;
  height: 19px;
  display: inline-block;
  border: 1px solid #dfdfdf;
  border-radius: 19px;
  background-size: 17px;
  margin-left: 10px;
}
.icon-svg {
  width: 16px;
  height: 16px;
  background-color: #3eb2c0;
  margin-right: 5px;
}
select[name='select-quantity'] {
  width: 118px;
}
</style>
