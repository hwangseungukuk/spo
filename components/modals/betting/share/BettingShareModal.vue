<template>
  <div class="modal-container default-ctn">
    <div class="header flex">
      <h5 class="nickname">{{ nickname }} 님의 베팅내역</h5>
      <div class="spacer"></div>
      <i class="icon-svg close" @click="onClose"></i>
    </div>
    <div class="history-list">
      <template v-if="loading">
        <div class="spinner hitgame"></div>
      </template>
      <template v-else>
        <template v-if="bet.startsWith('5::')">
          <history-item
            v-for="(history, index) in betHistories"
            :id="history.DrawId"
            :key="`bet-history-${index}-${history.DrawId}`"
            :status="getBettingStatus(history.DrawState)"
            :type-name="getBettingType(history.DrawType).text"
            :type="history.DrawType"
            :date="$moment(history.DateDrawn, $moment.ISO_8601).toDate()"
            :golds="history.SpoGold"
            :rate="history.Odd"
            :expected="history.ExpectedWinSpoGold"
            :is-canceled="history.RefundingByUser === 1"
            :expanded="true"
            :disabled="true"
            :no-buttons="true"
            :games="history.details"
          ></history-item>
        </template>
        <template v-else>
          <history-casual-item
            v-for="(history, index) in betHistories"
            :id="history.index"
            :key="`bet-history-${index}-${history.index}`"
            :succeeded="history.succeeded"
            :inning="history.inning"
            :name="getCasualWithBets(bet).name"
            :eng="getCasualWithBets(bet).eng"
            :date="history.insertDT"
            :golds="history.spoGold"
            :rate="history.winRate"
            :user-selected="history.forecastValue"
            :result="history.resultValue"
            :getting="history.winSpoGold"
            :status="history.status"
            :no-buttons="true"
          ></history-casual-item>
        </template>
      </template>
    </div>
  </div>
</template>

<script>
import { createNamespacedHelpers } from 'vuex';

import HistoryItem from '~/components/hitgame/history/HistoryItem';
import HistoryCasualItem from '~/components/hitgame/history/HistoryCasualItem';

export const MODAL_OPTIONS = {
  width: 920,
  minHeight: 155,
  height: 'auto',
  maxHeight: 530,
  adaptive: true,
  clickToClose: false,
};

const {
  mapState: _betsState,
  mapActions: _betsActions,
} = createNamespacedHelpers('chatting/bets');

const { mapGetters: _bettingStatTypeGetters } = createNamespacedHelpers(
  'mapper/betting-stat-type'
);

const { mapGetters: _casualGamesGetters } = createNamespacedHelpers(
  'gamecenter/casual/menu'
);

export default {
  components: {
    HistoryItem,
    HistoryCasualItem,
  },
  props: {
    nickname: { type: String, default: null },
    bet: { type: String, default: null },
  },
  computed: {
    ..._bettingStatTypeGetters({
      getSearchStatusList: 'getSearchStatusList',
      getBettingStatus: 'getStatus',
      getBettingType: 'getType',
    }),
    ..._betsState({
      loading: 'loading',
      _hasBets: 'success',
      _betsMessage: 'message',
      _betsError: 'error',
      betHistories: 'items',
    }),
    ..._casualGamesGetters(['getCasualWithBets']),
  },
  beforeMount() {
    this.getBets(this.bet);
  },
  methods: {
    ..._betsActions({
      getBets: 'getDetails',
      clearBets: 'clear',
    }),
    onClose() {
      this.clearBets();
      this.$emit('close');
    },
  },
};
</script>

<style scoped>
div.modal-container {
  background-color: #f2f2f2;
  padding: 20px;
  width: 920px;
  margin: 0 auto;
}

div.modal-container .header {
  align-items: center;
  margin-bottom: 15px;
}

div.modal-container .history-list >>> .history-item,
div.modal-container .history-list >>> .history-casual-item {
  margin-bottom: 0;
  padding: 0 20px;
}

div.modal-container .history-list >>> .history-item .detail-info {
  max-height: 420px;
  overflow-y: auto;
  overflow-x: hidden;
}

.history-list >>> .history-item .detail-info .result p.result {
  width: 385px;
}

.history-list
  >>> .history-item
  .detail-info
  .result
  div.flex
  > div:not([class*='spacer']) {
  width: 125px;
}

.history-list >>> .history-item .detail-info .result div.flex > div.live {
  width: 100%;
}

.nickname {
  font-weight: 800;
  font-size: 17px; /*16px에서 폰트깨짐문제로 수정함*/
  margin-bottom: 0;
}

i.icon-svg.close {
  background-color: #cccccc;
  width: 16px;
  height: 16px;
  cursor: pointer;
}
</style>
