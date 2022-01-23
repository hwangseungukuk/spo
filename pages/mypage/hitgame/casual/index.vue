<template>
  <div class="white_cover">
    <button-tabs
      :items="[
        ...getCasualGamesForHistory.map((game) => ({
          text: game.name,
          value: game.code,
        })),
      ]"
      @change="(v) => (game = v)"
    ></button-tabs>
    <div class="history-list">
      <template v-if="loading">
        <div class="spinner"></div>
      </template>
      <template v-else>
        <template v-if="items.length > 0">
          <history-casual-item
            v-for="(item, index) in items"
            :id="item.index"
            :key="`casual-history-${game}_${index}_${item.index}`"
            :succeeded="item.succeeded"
            :inning="item.inning"
            :name="getCasualDataWithCode(game).name"
            :eng="getCasualDataWithCode(game).eng"
            :date="item.insertDT"
            :golds="item.spoGold"
            :rate="item.winRate"
            :user-selected="item.forecastValue"
            :result="item.resultValue"
            :getting="item.winSpoGold"
            :status="item.status"
            @share="onShareClick"
          ></history-casual-item>
        </template>
        <template v-else>
          <div class="no-has-items default-ctn flex">
            <p>베팅 내역이 없습니다.</p>
          </div>
        </template>
      </template>
    </div>
    <d-pagination
      v-show="totalItems > 0"
      :num="totalItems"
      :m-page="page"
      :list="20"
      :block="10"
      @change="(v) => (page = v)"
    ></d-pagination>
  </div>
</template>

<script>
import { createNamespacedHelpers } from 'vuex';

import ButtonTabs from '~/components/common/ButtonTabs';

import HistoryCasualItem from '~/components/hitgame/history/HistoryCasualItem';

import DPagination from '~/components/common/dPagination';

const { mapGetters: casualGamesGetters } = createNamespacedHelpers(
  'gamecenter/casual/menu'
);

const { mapActions: chattingActions } = createNamespacedHelpers('chatting');

const { mapGetters: bettingStatTypeGetters } = createNamespacedHelpers(
  'mapper/betting-stat-type'
);

const {
  mapState: casualHistoriesState,
  mapActions: casualHistoriesActions,
} = createNamespacedHelpers('mypage/hitgame/casual');

export default {
  components: {
    HistoryCasualItem,
    ButtonTabs,
    DPagination,
  },
  data() {
    return {
      game: null,
      page: 1,
    };
  },
  computed: {
    ...casualHistoriesState([
      'success',
      'message',
      'error',
      'items',
      'loading',
      'totalItems',
    ]),
    ...casualGamesGetters({
      getCasualDataWithCode: 'getCasualDataWithCode',
      getCasualWithBets: 'getCasualWithBets',
      getCasualGamesForHistory: 'getGamesForHistory',
    }),
    ...bettingStatTypeGetters({
      getSearchStatusList: 'getSearchStatusList',
      getBettingStatus: 'getStatus',
      getBettingType: 'getType',
    }),
  },
  watch: {
    game(v) {
      this.page = 1;
      this.load();
    },
    page(v) {
      this.load();
    },
  },
  beforeMount() {
    this.game = this.getCasualGamesForHistory[0].code;
  },
  async mounted() {
    await this.load();
  },
  methods: {
    ...casualHistoriesActions(['getList', 'clear']),
    ...chattingActions({
      shareBettingHistory: 'shareBettingHistory',
    }),
    async load() {
      const { game, page } = this;
      await this.getList({ code: game, page });
    },
    onShareClick({ id }) {
      this.showDoubleButtonsModal({
        message: '선택한 베팅내역을 채팅창에 공유하시겠습니까?',
        buttonConfirmText: '공유',
        onConfirm: () => {
          this.shareBettingHistory(`3:${this.game}:${id}`);
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
  margin-top: 10px;
  margin-bottom: 10px;
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

.button-tabs {
  margin-bottom: 20px;
}

.pagination-cc {
  align-items: center;
  justify-content: center;
}
</style>
