<template>
  <div class="white_cover">
    <div class="date-term inline-flex default-ctn">
      <select v-model="status" class="selectbox status">
        <option
          v-for="(tab, index) in labelTabs"
          :key="`option-${tab.value}-${index}`"
          :value="tab.value"
        >
          {{ tab.label }}
        </option>
      </select>
      <div class="spacer"></div>
      <p>검색 기간</p>
      <select
        id="select-term"
        v-model="term"
        name="select-term"
        class="selectbox term"
        style="margin-right: 20px"
      >
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
    <div class="history-list">
      <template v-if="bHLoading">
        <div class="spinner"></div>
      </template>
      <template v-else>
        <template v-if="histories.length > 0">
          <history-item
            v-for="(history, index) in histories"
            :id="history.DrawId"
            :key="`history_${page}_${index}_${history.DrawId}`"
            :status="getBettingStatus(history.DrawState)"
            :type-name="getBettingType(history.DrawType).text"
            :type="history.DrawType"
            :date="$moment(history.DateDrawn, $moment.ISO_8601).toDate()"
            :golds="history.SpoGold"
            :rate="history.Odd"
            :expected="history.ExpectedWinSpoGold"
            :is-canceled="history.RefundingByUser === 1"
            :games="getDrawIdItemDetails(history.DrawId)"
            :loading="bHFetching"
            @share="
              onShareClick({ type: history.DrawType, id: history.DrawId })
            "
            @cancel="
              onCancelClick({ type: history.DrawType, id: history.DrawId })
            "
          ></history-item>
        </template>
        <template v-else>
          <div class="no-has-items default-ctn flex">
            <p>베팅 내역이 없습니다.</p>
          </div>
        </template>
      </template>
    </div>
    <d-pagination
      v-show="totalHistories > 0"
      :num="totalHistories"
      :m-page="page"
      :list="20"
      :block="10"
      @change="(v) => (page = v)"
    ></d-pagination>
  </div>
</template>

<script>
import { createNamespacedHelpers } from 'vuex';

import DatePicker from '~/components/common/DatePicker';
import HistoryItem from '~/components/hitgame/history/HistoryItem';

import DPagination from '~/components/common/dPagination';

import dateTermsMixin from '~/mixins/date-term-mixin';

const { mapActions: chattingActions } = createNamespacedHelpers('chatting');

const { mapGetters: bettingStatTypeGetters } = createNamespacedHelpers(
  'mapper/betting-stat-type'
);

const {
  mapState: bettingHistoryState,
  mapGetters: bettingHistoryGetters,
  mapActions: bettingHistoryActions,
} = createNamespacedHelpers('mypage/hitgame');

const {
  mapState: bettingCancelState,
  mapActions: bettingCancelActions,
} = createNamespacedHelpers('gamecenter/betting/cancel');

export default {
  components: {
    DatePicker,
    HistoryItem,
    DPagination,
  },
  mixins: [dateTermsMixin],
  data() {
    return {
      status: null,
      term: null,
      startAt: new Date(),
      endAt: new Date(),
      page: 1,
      labelTabs: [],
    };
  },
  computed: {
    ...bettingCancelState({
      isCanceled: 'success',
      cancelMessage: 'message',
      cancelError: 'error',
      cancelItems: 'items',
    }),
    ...bettingStatTypeGetters({
      getSearchStatusList: 'getSearchStatusList',
      getBettingStatus: 'getStatus',
      getBettingType: 'getType',
    }),
    ...bettingHistoryState({
      hasHistories: 'hasList',
      isFetched: 'success',
      message: 'message',
      error: 'error',
      histories: 'items',
      totalHistories: 'totalItems',
      bHLoading: 'loading',
      bHFetching: 'fetching',
    }),
    ...bettingHistoryGetters({
      getDrawIdItemDetails: 'getDrawIdItemDetails',
    }),
  },
  watch: {
    page(v) {
      this.load();
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
      this.startAt = new Date();
      this.endAt = new Date();

      this.startAt = this.$moment(this.endAt)
        .add(-1 * termArr[0], termArr[1] || 'days')
        .toDate();
    },
    status(v) {
      this.load();
    },
  },
  beforeMount() {
    this.labelTabs = [
      { label: '전체', value: null },
      ...this.getSearchStatusList.map((stat) => ({
        label: stat.text,
        value: stat.code,
      })),
    ];
    this.startAt = this.$moment(this.endAt).add(-15, 'days').toDate();
    this.term = '15/days';
    this.status = this.labelTabs[0].value;
    this.load();
  },
  beforeDestroy() {
    this.clearCancelBettingState();
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
      getHistories: 'getList',
      fetchHistory: 'fetch',
    }),
    load() {
      const { startAt, endAt, status, page } = this;
      this.getHistories({
        type: 'Special',
        startAt,
        endAt,
        page,
        status,
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
    },
    onShareClick(v) {
      console.log(v);
      this.showDoubleButtonsModal({
        message: '선택한 베팅내역을 채팅창에 공유하시겠습니까?',
        buttonConfirmText: '공유',
        onConfirm: () => {
          this.shareBettingHistory(`5::${v.type}/${v.id}`);
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

div.history-list {
  margin-bottom: 20px;
  border-top: 1px solid #e6e6e6;
}

.pagination-cc {
  align-items: center;
  justify-content: center;
}
</style>
