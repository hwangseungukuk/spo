<template>
  <div class="white_cover">
    <div class="date-term inline-flex default-ctn">
      <select v-model="order" class="selectbox">
        <option value="1">총폴더</option>
        <option value="2">적중폴더</option>
        <option value="3">베팅골드</option>
        <option value="4">총배당</option>
        <option value="5">당첨예상골드</option>
        <option value="6">판매골드</option>
        <option value="7">남은시간</option>
        <option value="8">적중전적</option>
        <option value="9">등록시간</option>
      </select>
      <select v-model="align" class="selectbox">
        <option value="1">오름차순</option>
        <option value="2">내림차순</option>
      </select>
      <!-- <select v-model="sportid" class="selectbox">
        <option value="">종목선택</option>
        <option value="1">축구</option>
        <option value="2">농구</option>
        <option value="3">야구</option>
      </select> -->
      <div class="spacer"></div>
      <select v-model="searchType" class="selectbox">
        <option value="">검색 선택</option>
        <option value="1">총폴더</option>
        <option value="2">적중폴더</option>
        <option value="3">베팅골드</option>
        <option value="4">총배당</option>
        <option value="5">당첨예상골드</option>
        <option value="6">판매골드</option>
        <!-- <option value="7">남은시간</option> -->
        <option value="8">적중전적</option>
        <option value="9">등록시간</option>
      </select>
      <div v-show="searchType !== '9'" class="calenderBox">
        <b-form-input
          v-model="fromdata"
          class="inputbox"
          placeholder="[숫자]시작"
        />
        <span>~</span>
        <b-form-input
          v-model="todata"
          class="inputbox"
          placeholder="[숫자]종료"
        />
      </div>
      <div v-show="searchType === '9'" class="calenderBox">
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
      </div>

      <b-btn variant="info" @click="onSearchClick">조회하기</b-btn>
    </div>
    <div class="trades-list">
      <template v-if="bHLoading">
        <div class="spinner"></div>
      </template>
      <template v-else>
        <template v-if="tradeses.length > 0">
          <trades-list-head :headers="menus[2].thead"></trades-list-head>
          <trades-list-item-mysell
            v-for="(trades, index) in tradeses"
            :id="parseInt(trades.MarketId)"
            :key="`trades_${currentPage}_${index}_${trades.MarketId}`"
            :trade-no="trades.TradeNo"
            :folder="`${trades.SucFolder}/${trades.TotFolder}`"
            :bet-gold="parseInt(trades.BetGold)"
            :tot-odds="trades.TotOdds"
            :win-gold="parseInt(trades.WinGold)"
            :sell-price="parseInt(trades.SellPrice)"
            :stats-time="trades.Stats"
            :last-time="trades.LastTime"
            :left-time="trades.LeftTime"
            :hit-rate="trades.HitRate"
            :write-time="trades.WriteTime"
            :expected="parseInt(trades.ExpectedWinSpoGold)"
            :is-canceled="trades.RefundingByUser === 1"
            :games="getDrawIdItemDetails(parseInt(trades.MarketId))"
            :loading="bHFetching"
            @cancel="
              onSaleClick({
                mode: 'cancel',
                drawtype: trades.GameType,
                marketid: trades.MarketId,
                id: trades.trno,
                tradeNo: trades.TradeNo,
              })
            "
          ></trades-list-item-mysell>
        </template>
        <template v-else>
          <div class="no-has-items default-ctn flex">
            <p>판매 내역이 없습니다.</p>
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
import Vue from 'vue';
import { createNamespacedHelpers } from 'vuex';

import DatePicker from '~/components/common/DatePicker';
import DPagination from '~/components/common/dPagination';
import TradesListHead from '~/components/trades/TradesListHead';
import TradesListItemMysell from '~/components/trades/TradesListItemMysell';

import dateTermsMixin from '~/mixins/date-term-mixin';

const { mapActions: chattingActions } = createNamespacedHelpers('chatting');

const { mapGetters: bettingStatTypeGetters } = createNamespacedHelpers(
  'mapper/betting-stat-type'
);

const { mapState: tradesTheadState } = createNamespacedHelpers('trades/menu');

const {
  mapState: bettingHistoryState,
  mapGetters: bettingHistoryGetters,
  mapActions: bettingHistoryActions,
} = createNamespacedHelpers('trades/mysell');

const {
  mapState: bettingCancelState,
  mapActions: bettingCancelActions,
} = createNamespacedHelpers('gamecenter/betting/cancel');

export default {
  components: {
    DatePicker,
    DPagination,
    TradesListHead,
    TradesListItemMysell,
  },
  mixins: [dateTermsMixin],
  data() {
    return {
      order: '7',
      align: '2',
      sportid: '',
      searchType: '',
      fromdata: '',
      todata: '',

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
      tradeNo: 'tradeNo',
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
        this.order = 7;
        this.align = 2;
        this.searchType = '';
        this.fromdata = '';
        this.todata = '';
      }

      this.path = nRoute.params.path;
      if (nRoute.params.path === oRoute.params.path) {
        const page = this.$route.query.page || 1;
        if (page) {
          this.currentPage = parseInt(page);
        }
        this.load();

        return;
      }
      this.clear();
      this.$router.push({
        name: nRoute.name,
        params: { ...nRoute.params },
        query: { ...nRoute.query, page: nRoute.query.page || 1 },
      });
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
    result(v) {
      if (v === 'OK') {
        this.showSingleButtonModal({
          message: '처리 되었습니다.',
          onConfirm: () => {
            this.onUpdateClick({ id: this.tradeNo });
          },
        });
      } else if (v === 'FAIL') {
        this.showSingleButtonModal({
          message: this.message,
        });
      }
    },
    fromdata(newValue) {
      const result = newValue.replace(/\D/g, '').replace(/(^0+)/, '');
      Vue.nextTick(() => (this.fromdata = result));
    },
    todata(newValue) {
      const result = newValue.replace(/\D/g, '').replace(/(^0+)/, '');
      Vue.nextTick(() => (this.todata = result));
    },
    searchType(v) {
      this.fromdata = '';
      this.todata = '';
    },
  },
  beforeMount() {
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
      tradesCancel: 'tradesCancel',
      clearAll: 'clearAll',
    }),
    load() {
      const {
        order,
        align,
        sportid,
        searchType,
        fromdata,
        todata,
        currentPage,
        pageRowNum,
      } = this;
      this.getTradeses({
        order,
        align,
        sportid,
        searchType,
        fromdata:
          searchType !== '9'
            ? fromdata
            : this.$moment(this.startAt).format('YYYY-MM-DD'),
        todata:
          searchType !== '9'
            ? todata
            : this.$moment(this.endAt).format('YYYY-MM-DD'),
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
    onSaleClick(v) {
      this.showDoubleButtonsModal({
        message: '선택한 베팅내역을 등록 취소하시겠습니까?',
        buttonConfirmText: '등록취소',
        buttonCancelText: '닫기',
        onConfirm: () => {
          this.tradesCancel({
            mode: v.mode,
            drawtype: v.drawtype,
            drawid: v.marketid,
            id: v.id,
            tradeNo: v.tradeNo,
          });
        },
      });
    },
    onUpdateClick(v) {
      const idx = this.tradeses.findIndex((item) => {
        return item.TradeNo === v.id;
      });
      console.log('onUpdateClick:', v.id, idx);
      this.tradeses[idx].Stats = '2';
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

.selectbox {
  width: 118px;
}
.inputbox {
  width: 108px;
}

.calenderBox {
  display: flex;
  align-items: center;
}
.calenderBox span {
  margin: 0 10px;
}
</style>
