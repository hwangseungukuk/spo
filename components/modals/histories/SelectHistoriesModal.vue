<template>
  <div class="select-history default-ctn">
    <p class="title">나의 베팅내역</p>
    <select-histories-modal-header
      :items="TAB_ITEMS"
      @change="onChangeType"
    ></select-histories-modal-header>
    <div
      :class="`filter default-ctn flex ${type === 'casual' ? '' : 'flex-end'}`"
    >
      <template v-if="type === 'casual'">
        <button-tabs
          :items="
            getGamesForHistory.map((item) => ({
              text: item.name,
              value: item.code,
            }))
          "
          @change="(v) => (selectedCasual = v)"
        ></button-tabs>
      </template>
      <template v-else>
        <select
          id="status"
          v-model="status"
          name="status"
          class="selectbox"
          @change="onStatusChange"
        >
          <option
            v-for="(status, index) in getStatus"
            :key="`option_${index}-status-${status.value}`"
            :value="status.value"
            :selected="index === 0"
          >
            {{ status.text }}
          </option>
        </select>
        <div class="spacer"></div>
        <p>검색 기간</p>
        <select
          id="search-term"
          v-model="term"
          name="search-term"
          class="selectbox"
        >
          <option
            v-for="(term, index) in DATE_TERMS"
            :key="`option_${index}-search-term-${term.value}-${term.target}`"
            :value="`${term.value}/${term.target}`"
            :selected="index === 0"
          >
            {{ term.text }}
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
        <b-btn class="load" variant="info" size="sm" @click="onSearchClick">
          <p>조회하기</p>
        </b-btn>
      </template>
    </div>
    <div class="history-list">
      <template v-if="type === 'casual'">
        <template v-if="casualLoading">
          <div class="spinner"></div>
        </template>
        <template v-else>
          <template v-if="casualItems.length > 0">
            <history-casual-item
              v-for="(item, index) in casualItems"
              :id="item.index"
              :key="`casual-history-${selectedCasual}_${index}_${item.index}`"
              :succeeded="item.succeeded"
              :inning="item.inning"
              :name="getCasualDataWithCode(selectedCasual).name"
              :eng="getCasualDataWithCode(selectedCasual).eng"
              :date="item.insertDT"
              :golds="item.spoGold"
              :rate="item.winRate"
              :user-selected="item.forecastValue"
              :result="item.resultValue"
              :getting="item.winSpoGold"
              :status="item.status"
              :selectable="true"
              :selected="selected.some((sItem) => sItem.id === item.index)"
              @select="
                (v) =>
                  onSelectClick({
                    ...v,
                    type: 'casual',
                    code: selectedCasual,
                    id: item.index,
                  })
              "
            ></history-casual-item>
          </template>
          <template v-else>
            <div class="no-has-items default-ctn flex">
              <p>베팅 내역이 없습니다.</p>
            </div>
          </template>
        </template>
      </template>
      <template v-else>
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
              :selectable="true"
              :selected="selected.some((item) => item.id === history.DrawId)"
              @select="
                (v) =>
                  onSelectClick({
                    ...v,
                    type: history.DrawType,
                    id: history.DrawId,
                  })
              "
            ></history-item>
          </template>
          <template v-else>
            <div class="no-has-items default-ctn flex">
              <p>베팅 내역이 없습니다.</p>
            </div>
          </template>
        </template>
      </template>
    </div>
    <div class="button-group flex">
      <b-btn variant="info" class="load-bet-items" @click="onLoadClick">
        <p>{{ isShareMode ? '공유하기' : '불러오기' }}</p>
      </b-btn>
    </div>
    <d-pagination
      :num="type === 'casual' ? casualTotalItems : totalHistories"
      :m-page="page"
      :list="8"
      :block="10"
      @change="(v) => (page = v)"
    ></d-pagination>
    <i class="icon-svg close" @click="$emit('close')"></i>
  </div>
</template>

<script>
import DPagination from '~/components/common/dPagination';
import SelectHistoriesModalHeader from '~/components/modals/histories/SelectHistoriesModalHeader';

import getHistoryMixin from '~/mixins/get-history-modal-mixin';

export const MODAL_OPTIONS = {
  width: 920,
  height: 800,
  adaptive: true,
  clickToClose: false,
};

export default {
  components: {
    DPagination,
    SelectHistoriesModalHeader,
  },
  mixins: [getHistoryMixin],
  data() {
    return {
      casualCode: null,
      selected: [],
    };
  },
  watch: {
    async selectedCasual(v) {
      if (this.type !== 'casual') {
        return;
      }
      this.selected = [];
      this.page = 1;
      this.clearCasualHistories();
      await this._loadCasual();
    },
    page(v) {
      this.onPageChange(v);
    },
  },
  methods: {
    async onStatusChange(e) {
      this.selected = [];
      const { value } = e.target;
      if (value === null || value.length <= 0) {
        this.status = null;
      } else {
        this.status = value;
      }
      await this._load();
    },
    async onChangeType(v) {
      this.selected = [];
      await this._onChangeType(v);
    },
    onLoadClick() {
      const { isShareMode, type, selectedCasual, selected } = this;
      if (selected.length <= 0) {
        this.showSingleButtonModal({
          message: `선택 후 ${
            isShareMode ? '공유하기' : '불러오기'
          }가 가능합니다.`,
        });
        return;
      }
      if (isShareMode) {
        const item = this.selected[0];
        console.log(item);
        if (type === 'casual') {
          this.onSelected(`3:${item.code}:${item.id}`);
        } else {
          this.onSelected(`5::${item.type}/${item.id}`);
        }
      } else {
        this.onSelected({
          type,
          casual: type === 'casual' ? selectedCasual : null,
          list: selected,
        });
      }
      this.$emit('close');
    },
    onSearchClick() {
      this.selected = [];
      this.page = 1;
      this._load();
    },
    onSelectClick(v) {
      if (v.selected) {
        this.selected = this.selected.filter((select) => select.id !== v.id);
        return;
      }
      if (!this.isShareMode) {
        this.selected = [...this.selected, v];
        return;
      }
      if (this.selected.length > 0) {
        this.showSingleButtonModal({
          message: `1개의 베팅내역만 선택 가능합니다.`,
          onConfirm: () => {
            this.selected = [v];
          },
        });
      } else {
        this.selected = [v];
      }
    },
    async onPageChange(v) {
      console.log('onPageChange:', v, this.type);
      this.selected = [];
      if (this.type === 'casual') {
        await this._loadCasual(v);
      } else {
        this._load(v);
      }
    },
  },
};
</script>

<style scoped>
div.select-history .history-list {
  height: 485px;
  margin-bottom: 20px;
}

.history-list .history-item:last-child >>> .head,
.history-list .history-casual-item:last-child {
  border-bottom: unset;
}

div.select-history .history-list.casual {
  height: 425px;
}

.button-group {
  align-items: center;
  justify-content: center;
}

.btn.load-bet-items {
  width: 150px;
  height: 35px;
  padding: 0;
}

div.select-history div.no-has-items {
  height: 480px;
}

div.select-history div.no-has-items.casual {
  height: 422px;
}

.pagination {
  margin-top: 20px;
}

.history-list >>> .history-item .history-detail-item p.result {
  width: 385px;
}

.history-list >>> .history-item .history-detail-item div.flex > div:not(.live) {
  width: 125px;
}

.history-list >>> .history-item .history-detail-item div.flex > div.live {
  width: 100%;
}
</style>
