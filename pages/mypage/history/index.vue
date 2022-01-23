<template>
  <div class="board-container">
    <history-board-container
      :page="currentPage"
      :total-items="totalItems"
      :loading="loading"
      :page-size="pageSize"
      @page="({ page }) => (currentPage = page)"
    >
      <template v-if="items.length > 0 && !loading">
        <history-board-item
          v-for="(item, index) in items"
          :key="`board_item_${index}`"
          :od-time="item.od_time"
          :od-settle-case="item.od_settle_case"
          :it-name="item.it_name"
          :price="item.price"
          :charge-gold="item.chargeGold"
        ></history-board-item>
      </template>
      <template v-else-if="items.length <= 0 && !loading">
        <div class="flex no-has-items">
          <p>구매 내역이 없습니다.</p>
        </div>
      </template>
      <template v-else>
        <history-board-item-skeleton
          v-for="index in pageSize"
          :key="`board_item_sk_${currentPage}_${index}`"
        ></history-board-item-skeleton>
      </template>
    </history-board-container>
  </div>
</template>

<script>
import { createNamespacedHelpers } from 'vuex';

import HistoryBoardContainer from '~/components/mypage/history/HistoryBoardContainer';
import HistoryBoardItem from '~/components/mypage/history/HistoryBoardItem';
import HistoryBoardItemSkeleton from '~/components/mypage/history/HistoryBoardItemSkeleton';

const {
  mapState: historyListState,
  mapActions: historyListActions,
} = createNamespacedHelpers('mypage/history/list');

export default {
  components: {
    HistoryBoardContainer,
    HistoryBoardItem,
    HistoryBoardItemSkeleton,
  },
  data() {
    return {
      currentPage: 1,
      pageSize: 20,
    };
  },
  computed: {
    ...historyListState([
      'success',
      'message',
      'loading',
      'error',
      'categories',
      'items',
      'totalItems',
    ]),
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
      // if (nRoute.query.page === undefined) {
      //   this.currentPage = 1;
      // }

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
  methods: {
    ...historyListActions(['getBoards', 'clear']),
    load() {
      const { currentPage, pageSize } = this;
      this.getBoards({
        type: 'use',
        page: currentPage,
        pageSize,
      });
    },
  },
};
</script>

<style scoped>
div.board-container {
  padding-top: 15px;
  margin-bottom: 40px;
}

div.search-container {
  padding-top: 10px;
}
div.search-container .haveMoney {
  display: flex;
  align-items: flex-end;
  height: 30px;
  font-size: 12px;
  color: #aaa;
}
div.pagination-container {
  margin-top: 5px;
  text-align: center;
  margin-bottom: 20px;
}

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
  width: 80px;
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
</style>
