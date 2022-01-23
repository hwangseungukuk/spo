<template>
  <div class="store-content default-ctn">
    <div class="search-container flex">
      <div class="spacer"></div>
      <select
        v-if="this.$route.params.id1 == 10"
        id="select-league"
        v-model="mField"
        name="select-league"
        class="selectbox"
      >
        <option :value="null">전체</option>
        <option
          v-for="(item, index) in categories"
          :key="`search-league-option-${index}`"
          :value="item.ca_id"
        >
          {{ item.ca_name }}
        </option>
      </select>
    </div>
    <store-board-container
      :page="currentPage"
      :total-items="totalItems"
      :loading="loading"
      :has-categories="categories.length > 0"
      @page="currentPageTo"
    >
      <template v-if="loading">
        <store-board-item-skeleton
          v-for="index in 9"
          :key="`${id1}_board_item_sk_${currentPage}_${index}`"
        ></store-board-item-skeleton>
      </template>
      <template v-else>
        <template v-if="items.length > 0">
          <store-board-item
            v-for="(item, index) in items"
            :id="item.it_id"
            :key="`${id1}_board_item_${item.it_id}_${index}`"
            :title="item.it_name"
            :id2="item.ca_id2"
            :it-price="item.it_price"
            :it-goldrise="item.it_goldrise"
            :it-type1="item.it_type1"
            :it-type2="item.it_type2"
            :it-type3="item.it_type3"
            :it-img1="item.it_img1"
            :show-spo-gold="$route.params.id1 == 10"
            view-type="list"
            @click="
              ({ id }) =>
                $router.push({
                  name: 'store-id1-id2-id',
                  params: {
                    id1: $route.params.id1,
                    id2: $route.params.id2,
                    id,
                  },
                })
            "
          ></store-board-item>
        </template>
        <template v-else>
          <div class="no-has-items flex">
            <p>등록된 상품이 없습니다.</p>
          </div>
        </template>
      </template>
    </store-board-container>
  </div>
</template>

<script>
import { createNamespacedHelpers } from 'vuex';

import StoreBoardContainer from '~/components/store/StoreBoardContainer';
import StoreBoardItem from '~/components/store/StoreBoardItem';
import StoreBoardItemSkeleton from '~/components/store/StoreBoardItemSkeleton';

const {
  mapState: storeMenuState,
  mapGetters: storeMenuGetters,
} = createNamespacedHelpers('store/menu');

const {
  mapState: storeListState,
  mapActions: storeListActions,
} = createNamespacedHelpers('store/list');

export default {
  components: {
    StoreBoardContainer,
    StoreBoardItem,
    StoreBoardItemSkeleton,
  },
  data() {
    return {
      search: {
        field: null,
        word: null,
      },
      currentPage: 1,
      mField: null,
      setWidth: 200,
      placeholder: null,
    };
  },
  computed: {
    ...storeMenuGetters(['getMenuByPath']),
    ...storeListState([
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
    categories(v) {
      // 셀렉트 박스에서 이하윤 포토카드 제거
      const index = this.categories.findIndex(
        (item) => item.ca_name === '이하윤 포토카드'
      );
      if (index > -1) {
        this.categories.splice(index, 1);
      }
    },
    mField(v) {
      // const page = this.$route.query.page;
      // if (page) {
      //   this.currentPage = parseInt(page);
      // }
      this.$route.query.page = 1;
      this.currentPage = 1;

      this.$router.push({
        name: this.$route.name,
        params: { ...this.$route.params },
        query: { ...this.$route.query, field: v },
      });
    },
    async $route(nRoute, oRoute) {
      // LNB클릭 셀랙트박스 초기화
      if (nRoute.query.field === undefined) {
        this.mField = null;
      }

      if (nRoute.params.id1 === oRoute.params.id1) {
        await this.getBoards({
          id1: nRoute.params.id1,
          id2: nRoute.params.id2,
          field: nRoute.query.field,
          page: parseInt(nRoute.query.page) || 1,
          listMod: 3,
          listRow: 4,
        });
        return;
      }
      this.clear();
      this.$router.push({
        name: nRoute.name,
        params: { ...nRoute.params },
        query: { ...nRoute.query, page: nRoute.query.page || 1 },
      });

      this.id1 = this.$route.params.id1;
      this.id2 = this.$route.params.id2;
    },
  },
  beforeMount() {
    this.id1 = this.$route.params.id1;
    this.id2 = this.$route.params.id2;
    const page = this.$route.query.page;
    if (page) {
      this.currentPage = parseInt(page);
    }
  },
  async mounted() {
    const { id1, id2, mField, currentPage } = this;
    await this.getBoards({
      id1,
      id2,
      field: this.$route.query.field,
      page: currentPage,
    });
  },
  methods: {
    ...storeListActions(['getBoards', 'clear']),
    onSelectAllChange(v) {
      console.log('onSelectAllChange', v);
    },
    currentPageTo(v) {
      this.$router.push({
        name: this.$route.name,
        params: { ...this.$route.params },
        query: { ...this.$route.query, page: v.page },
      });
    },
  },
};
</script>

<style scoped>
div.store-content {
  padding: 20px;
}
div.search-container select.selectbox {
  margin-bottom: 10px;
}

div.pagination-container {
  margin-top: 5px;
  text-align: center;
  margin-bottom: 20px;
}
</style>
