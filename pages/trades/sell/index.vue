<template>
  <div class="white_cover">
    <div class="date-term inline-flex default-ctn">
      <div class="spacer"></div>
      <select v-model="term" class="selectbox term">
        <option
          v-for="(item, index) in DATE_TERMS"
          :key="`search-term-option-${index}`"
          :value="`${item.value}/${item.target}`"
        >
          {{ item.text }}
        </option>
      </select>
      <p>기간 설정</p>
      <date-picker
        :date="startAt"
        :max-at="endAt"
        @disabledDate="true"
        @closed="term = '-1/none'"
        @change="onStartAtChange"
      ></date-picker>
      <span>~</span>
      <date-picker
        :date="endAt"
        :min-at="startAt"
        @disabledDate="true"
        @closed="term = '-1/none'"
        @change="onEndAtChange"
      ></date-picker>
      <b-btn variant="info" @click="onSearchClick">조회하기</b-btn>
    </div>
    <div class="trades-list">
      <template v-if="bHLoading">
        <div class="spinner"></div>
      </template>
      <template v-else>
        <template v-if="tradeses.length > 0">
          <trades-list-head :headers="menus[1].thead"></trades-list-head>
          <trades-list-item-sell
            v-for="(trades, index) in tradeses"
            :id="Number(trades.DrawId)"
            :key="`trades_${currentPage}_${index}_${trades.DrawId}`"
            :type="getBettingType(trades.DrawType).text"
            :date="$moment(trades.DateDrawn, $moment.ISO_8601).toDate()"
            :golds="Number(trades.SpoGold)"
            :rate="trades.Odd"
            :expected="Number(trades.ExpectedWinSpoGold)"
            :is-canceled="trades.RefundingByUser === 1"
            :games="getDrawIdItemDetails(parseInt(trades.DrawId))"
            :loading="bHFetching"
            @sell="
              onSellClick({
                type: trades.DrawType,
                id: trades.DrawId,
                rate: trades.Odd,
                golds: Number(trades.SpoGold),
                expected: Number(trades.ExpectedWinSpoGold),
              })
            "
            @cancel="
              onCancelClick({ type: trades.DrawType, id: trades.DrawId })
            "
          ></trades-list-item-sell>
        </template>
        <template v-else>
          <div class="no-has-items default-ctn flex">
            <p>판매 가능한 내역이 없습니다.</p>
          </div>
        </template>
      </template>
    </div>
    <d-pagination
      v-show="Number(totalTradeses) > 0"
      :num="Number(totalTradeses)"
      :m-page="currentPage"
      :list="pageRowNum"
      :block="10"
      @change="(v) => (currentPage = v)"
    ></d-pagination>
  </div>
</template>

<script>
import { createNamespacedHelpers } from 'vuex';

import DatePicker from '~/components/common/DatePicker';
import DPagination from '~/components/common/dPagination';
import TradesListHead from '~/components/trades/TradesListHead';
import TradesListItemSell from '~/components/trades/TradesListItemSell';

import dateTermsMixin from '~/mixins/date-term-mixin';

const { mapState: tradesTheadState } = createNamespacedHelpers('trades/menu');

const { mapActions: chattingActions } = createNamespacedHelpers('chatting');

const { mapGetters: bettingStatTypeGetters } = createNamespacedHelpers(
  'mapper/betting-stat-type'
);

const {
  mapState: bettingHistoryState,
  mapGetters: bettingHistoryGetters,
  mapActions: bettingHistoryActions,
} = createNamespacedHelpers('trades/sell');

const {
  mapState: bettingCancelState,
  mapActions: bettingCancelActions,
} = createNamespacedHelpers('gamecenter/betting/cancel');

export default {
  components: {
    DatePicker,
    DPagination,
    TradesListHead,
    TradesListItemSell,
  },
  mixins: [dateTermsMixin],
  data() {
    return {
      status: null,
      term: null,
      startAt: new Date(),
      endAt: new Date(),

      currentPage: 1,
      pageRowNum: 20,
    };
  },
  computed: {
    ...tradesTheadState({ menus: 'menus' }),
    ...bettingCancelState({
      isCanceled: 'success',
      cancelMessage: 'message',
      cancelError: 'error',
      cancelItems: 'items',
    }),
    ...bettingStatTypeGetters({
      getSearchStatusList: 'getSearchStatusList',
      getBettingType: 'getType',
    }),
    ...bettingHistoryState({
      hasHistories: 'hasList',
      isFetched: 'success',
      result: 'result',
      drawId: 'drawId',
      message: 'message',
      error: 'error',
      tradeses: 'items',
      totalTradeses: 'totalItems',
      bHLoading: 'loading',
      bHFetching: 'fetching',
    }),
    ...bettingHistoryGetters({
      getDrawIdItemDetails: 'getDrawIdItemDetails',
    }),
  },
  watch: {
    currentPage(v) {
      this.$router.push({
        name: this.$route.name,
        params: { ...this.$route.params },
        query: { ...this.$route.query, page: v },
      });
    },
    $route(nRoute, oRoute) {
      if (nRoute.query.page === undefined) {
        this.currentPage = 1;
      }

      if (nRoute.query.search === undefined) {
        this.term = '7/days';
        this.startAt = this.$moment(this.endAt).add(-7, 'days').toDate();
      }

      if (nRoute.query.page !== oRoute.query.page) {
        this.currentPage = nRoute.query.page;
        this.load();
      }
    },
    isCanceled(v) {
      if (!v) {
        return;
      }
      const failed = this.cancelItems.find((item) => {
        return !item.success;
      });
      if (failed) {
        this.showSingleButtonModal({
          message: '선택한 게임은 취소할 수 없습니다.',
          description:
            '베팅 취소 조건에 부합하지 않는 경기가 포함되어 있습니다.',
        });
      } else {
        this.showSingleButtonModal({
          message: '선택한 게임의 베팅이 취소되었습니다.',
        });
      }
    },
    async hasHistories(v) {
      if (!v) {
        return;
      }
      await this.fetchHistory();
    },
    term(v) {
      const termArr = v.split('/');
      if (termArr[0] < 0) {
        return;
      }
      this.endAt = new Date();
      this.startAt = this.$moment(this.endAt)
        .add(-1 * termArr[0], termArr[1] || 'days')
        .toDate();
    },
    status(v) {
      this.page = 1;
      this.load();
    },
    result(v) {
      if (v === 'OK') {
        this.showSingleButtonModal({
          message: '처리 되었습니다.',
        });
        this.onDeleteClick(this.drawId);
      } else if (v === 'FAIL') {
        if (this.message.includes('관리자에게 문의 바랍니다.')) {
          this.showSingleButtonModal({
            message: '판매등록이 불가한 건입니다.',
            onConfirm: () => {
              this.onDeleteClick(this.drawId);
            },
          });
        } else {
          this.showSingleButtonModal({
            message: this.message,
          });
        }
      }
    },
    totalTradeses(v) {
      const thisPage = Math.ceil(Number(v) / this.pageRowNum);
      if (thisPage !== Number(this.$route.query.page)) {
        this.$router.push({
          name: this.$route.name,
          params: { ...this.$route.params },
          query: {
            ...this.$route.query,
            page: Number(this.$route.query.page) - 1 || 1,
          },
        });
      }
    },
  },
  beforeMount() {
    this.term = '7/days';
    this.startAt = this.$moment(this.endAt).add(-7, 'days').toDate();
    // this.load();
    const page = this.$route.query.page || 1;
    if (page) {
      this.currentPage = parseInt(page);
    }
  },
  mounted() {
    this.load();
  },
  beforeDestroy() {
    this.clearCancelBettingState();
    this.clearAll();
  },
  methods: {
    ...bettingCancelActions({
      cancelBettingItems: 'cancelItems',
      clearCancelBettingState: 'clear',
    }),
    ...chattingActions({
      shareBettingHistory: 'shareBettingHistory',
    }),
    ...bettingHistoryActions({
      getTradeses: 'getList',
      fetchHistory: 'fetch',
      tradesSell: 'tradesSell',
      clearAll: 'clearAll',
    }),
    load() {
      const { startAt, endAt, currentPage, pageRowNum } = this;

      this.getTradeses({
        searchDate: 'custom',
        searchStart: this.$moment(startAt).format('YYYY-MM-DD'),
        searchEnd: this.$moment(endAt).format('YYYY-MM-DD'),
        page: currentPage,
        pageRowNum,
      });
    },
    onStartAtChange(v) {
      if (v.getTime() > this.endAt.getTime()) {
        const d = new Date();
        d.setHours(0);
        d.setMinutes(0);
        d.setSeconds(0);
        d.setUTCMilliseconds(0);
        this.startAt = d;
        return;
      }
      this.startAt = v;
    },
    onEndAtChange(v) {
      if (v.getTime() < this.startAt.getTime()) {
        const d = new Date();
        d.setHours(0);
        d.setMinutes(0);
        d.setSeconds(0);
        d.setUTCMilliseconds(0);
        this.endAt = d;
        return;
      }
      this.endAt = v;
    },
    onSearchClick() {
      this.load();
      this.$router.push({
        name: this.$route.name,
        params: { ...this.$route.params },
        query: { ...this.$route.query, page: undefined, search: 'on' },
      });
    },
    onSellClick(v) {
      console.log('onSellClick:', v.type, v.id, v.rate, v.golds, v.expected);
      this.showSaleButtonsModal({
        message: '판매골드를 입력해 주세요.',
        buttonConfirmText: '판매등록',
        rate: v.rate,
        golds: v.golds,
        expected: v.expected - 10,
        onConfirm: (sellprice) => {
          sellprice = Number(sellprice.replace(/\D/g, ''));
          this.showDoubleButtonsModal({
            message:
              '판매 등록을 하시겠습니까?<br />판매되면 수수료를 제외한 골드가 충전됩니다.',
            buttonConfirmText: '등록',
            buttonCancelText: '취소',
            onConfirm: () => {
              const mode = 'sell';
              const drawtype = v.type;
              const drawid = v.id;
              const id = null;
              this.tradesSell({
                mode,
                drawtype,
                drawid,
                sellprice,
                id,
              });
            },
          });
        },
      });
    },
    onCancelClick(v) {
      this.showDoubleButtonsModal({
        message: '베팅을 취소하시겠습니까?',
        buttonConfirmText: '베팅취소',
        buttonCancelText: '닫기',
        onConfirm: () => {
          this.cancelBettingItems({
            type: v.type,
            items: [`${v.type}|${v.id}`],
          });
        },
      });
    },
    onDeleteClick(no) {
      // const idx = this.tradeses.findIndex((item) => {
      //   return item.DrawId === no;
      // });
      // this.tradeses.splice(idx, 1);
      this.load();
    },
  },
};
</script>

<style scoped>
div.date-term {
  width: 100%;
  height: 30px;
  align-items: center;
  justify-content: flex-end;
  margin-bottom: 20px;
}

div.date-term > * {
  margin-right: 10px;
}

div.date-term > *:last-child {
  margin-right: 0;
}

div.date-term p {
  margin-bottom: 0;
}

button.btn.btn-info {
  width: 75px;
  height: 30px;
  font-size: 12px;
  border-radius: 5px;
}

button.btn.btn-info,
button.btn.btn-info:hover,
button.btn.btn-info:focus,
button.btn.btn-info:active {
  border: unset;
  background-color: #3eb2c0;
}

button.btn.btn-info:focus,
button.btn.btn-info:active {
  outline: unset;
  box-shadow: 0 0 0 2px #3eb2c0aa;
}

div.trades-list {
  margin-bottom: 20px;
}

.pagination-cc {
  align-items: center;
  justify-content: center;
}
</style>
