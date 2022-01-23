<template>
  <div>
    <news-board-container
      :is-admin="false"
      :page="currentPage"
      :total-items="totalItems"
      :loading="loading"
      :hide-header="!loading && items.length <= 0"
      @select-all="onSelectAllChange"
      @page="({ page }) => (currentPage = page)"
    >
      <template v-if="loading">
        <news-board-item-skeleton
          v-for="index in 10"
          :key="`${path}_board_item_sk_${currentPage}_${index}`"
        ></news-board-item-skeleton>
      </template>
      <template v-else>
        <template v-if="items.length > 0 && !loading">
          <news-board-item
            v-for="(item, index) in items"
            :id="item.wr_id"
            :key="`${path}_board_item_${item.id}_${index}`"
            :is-admin="false"
            :is-writer-admin="item.user_admin"
            :is-notice="item.is_notice"
            :is-new="item.icon_new.length > 0"
            :title="item.subject"
            :writer="item.name"
            :date="item.datetime"
            :read="item.hits"
            :has-attachments="item.files > 0"
            @click="
              ({ id }) =>
                $router.push({
                  name: 'news-path-id',
                  params: { path, id },
                  query: { ...$route.query },
                })
            "
          ></news-board-item>
        </template>
        <template v-else-if="items.length <= 0 && !loading">
          <div class="search-none"><p>검색된 게시글이 없습니다.</p></div>
        </template>
      </template>
      <div class="search-container">
        <div class="spacer"></div>
        <search-field
          :field="search.field"
          :word="search.word"
          :items="filter"
          :placeholder="'검색어를 입력해 주세요.'"
          :path="path"
          @search="onSearchSubmit"
        ></search-field>
      </div>
    </news-board-container>
  </div>
</template>

<script>
import { createNamespacedHelpers } from 'vuex';
import SearchField from '~/components/common/SearchField';

import NewsBoardContainer from '~/components/news/NewsBoardContainer';
import NewsBoardItem from '~/components/news/NewsBoardItem';
import NewsBoardItemSkeleton from '~/components/news/NewsBoardItemSkeleton';

const { mapState: newsMenuState } = createNamespacedHelpers('news/menu');

const {
  mapState: newsListState,
  mapActions: newsListActions,
} = createNamespacedHelpers('news/list');

export default {
  auth: false,
  components: {
    SearchField,
    NewsBoardContainer,
    NewsBoardItem,
    NewsBoardItemSkeleton,
  },
  props: {
    path: { type: String, default: 'notice' },
  },
  data() {
    return {
      // path: null,
      search: {
        field: null,
        word: null,
      },
      currentPage: 1,
    };
  },
  computed: {
    ...newsMenuState(['filter']),
    ...newsListState([
      'success',
      'message',
      'loading',
      'error',
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
    async $route(nRoute, oRoute) {
      if (nRoute.query.page === undefined) {
        this.currentPage = 1;
      }
      this.search.field = nRoute.query.field;
      this.search.word = nRoute.query.word;
      // this.path = nRoute.params.path;
      await this.getBoards({
        path: nRoute.params.path,
        field: nRoute.query.field,
        word: nRoute.query.word,
        page: parseInt(nRoute.query.page) || 1,
      });
    },
  },
  beforeMount() {
    // this.path = this.$route.params.path;
    this.search.field = this.$route.query.field || null;
    this.search.word = this.$route.query.word || null;
    const page = this.$route.query.page;
    if (page) {
      this.currentPage = parseInt(page);
    }
  },
  async mounted() {
    const { path, currentPage } = this;
    await this.getBoards({
      path,
      field: this.$route.query.field,
      word: this.$route.query.word,
      page: this.currentPage,
    });
  },
  methods: {
    ...newsListActions(['getBoards', 'clear']),
    onSelectAllChange(v) {
      console.log('onSelectAllChange', v);
    },
    onSearchSubmit({ field, word }) {
      const { path } = this;
      this.$router.push({
        name: this.$route.name,
        params: { path },
        query: { field, word, page: 1 },
      });
      // await this.getBoards({
      //   path: this.path,
      //   field,
      //   word,
      //   page: 1,
      // });
    },
  },
};
</script>

<style scoped>
div.search-container {
  margin-bottom: 10px;
  padding-top: 20px;
  width: 355px;
  margin: 0 auto 20px;
}

div.pagination-container {
  margin-top: 5px;
  text-align: center;
  margin-bottom: 20px;
}

div.search-none {
  display: flex;
  align-items: center;
  min-height: 350px;
  width: 100%;
  height: 450px;
  border-bottom: 1px solid #e6e6e6;
}
div.search-none p {
  width: 100%;
  text-align: center;
}
</style>
