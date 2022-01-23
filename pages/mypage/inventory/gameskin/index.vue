<template>
  <div class="white_cover">
    <button-tabs
      :items="labelTabs"
      :value="status"
      @change="(v) => (status = v)"
    ></button-tabs>
    <div class="history-list">
      <div class="store-content default-ctn">
        <inventory-board-container
          :page="currentPage"
          :total-items="totalItems"
          :loading="loading"
          @page="({ page }) => (currentPage = page)"
        >
          <template v-if="items.length > 0 && !loading">
            <inventory-board-item
              v-for="(item, index) in items"
              :id="item.it_id"
              :key="`board_item_${item.it_id}_${index}`"
              :skin-index="item.skinIndex"
              :ca-id2="item.ca_id2"
              :it-name="item.it_name"
              :ct-qty="item.ct_qty"
              :it-img1="item.it_img1"
              :is-using="item.is_using"
              @click="onChange"
            ></inventory-board-item>
          </template>
          <template v-else-if="items.length <= 0 && !loading">
            <div class="no-has-items default-ctn flex">
              <p>보유한 스킨이 없습니다.</p>
            </div>
          </template>
          <template v-else>
            <inventory-board-item-skeleton
              v-for="index in 10"
              :key="`board_item_sk_${currentPage}_${index}`"
            ></inventory-board-item-skeleton>
          </template>
        </inventory-board-container>
      </div>
    </div>
  </div>
</template>

<script>
import { createNamespacedHelpers } from 'vuex';

import ButtonTabs from '~/components/common/ButtonTabs';
import InventoryBoardContainer from '~/components/mypage/inventory/InventoryBoardContainer';
import InventoryBoardItem from '~/components/mypage/inventory/InventoryBoardItem';
import InventoryBoardItemSkeleton from '~/components/mypage/inventory/InventoryBoardItemSkeleton';

const {
  mapState: gameskinState,
  mapActions: gameskinActions,
} = createNamespacedHelpers('mypage/inventory/gameskin');

const {
  mapState: changeState,
  mapActions: changeActions,
} = createNamespacedHelpers('mypage/inventory/gameskin/change');

export default {
  components: {
    ButtonTabs,
    InventoryBoardContainer,
    InventoryBoardItem,
    InventoryBoardItemSkeleton,
  },
  data() {
    return {
      status: null,
      term: 0,
      startAt: new Date(),
      endAt: new Date(),
      page: 1,
      currentPage: 1,
      labelTabs: [
        // { label: '전체', value: '10' },
        { text: '축구', value: '1010' },
        { text: '농구', value: '1020' },
        { text: '야구', value: '1030' },
      ],
    };
  },
  computed: {
    ...gameskinState({
      items: 'items',
      totalItems: 'totalItems',
      loading: 'loading',
    }),
    ...changeState({
      isChanged: 'true',
      changeMessage: 'message',
    }),
  },
  watch: {
    currentPage(v) {
      console.log('currentPage:', v);
      this.load();
    },
    status(v) {
      this.currentPage = 1;
      this.load();
    },
    changeMessage(v) {
      if (v) {
        this.showSingleButtonModal({
          message: v,
          onConfirm: () => {
            this.load();
          },
        });
      }
    },
  },
  beforeMount() {
    if (this.$route.query.status) this.status = this.$route.query.status;
    else this.status = this.labelTabs[0].value;
  },
  beforeDestroy() {
    this.clear();
    this.changeClear();
  },
  methods: {
    ...gameskinActions({
      getBoards: 'getBoards',
      clear: 'clear',
    }),
    ...changeActions({
      changeGameskins: 'changeGameskins',
      changeClear: 'clear',
    }),
    load() {
      const { status, currentPage } = this;
      this.getBoards({
        status,
        page: currentPage,
        listRow: 12,
      });
    },
    onChange(v) {
      this.changeClear();
      this.changeGameskins({
        mode: v.isUsing ? '0' : '1',
        caId: v.caId2,
        skinIndex: v.skinIndex,
      });
    },
  },
};
</script>

<style scoped>
.button-tabs {
  margin-bottom: 20px;
}

div.search-container {
  margin-bottom: 10px;
}

div.pagination-container {
  margin-top: 5px;
  text-align: center;
  margin-bottom: 20px;
}
</style>
