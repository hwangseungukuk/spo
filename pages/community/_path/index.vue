<template>
  <div>
    <community-board-container
      :is-admin="false"
      :page="currentPage"
      :total-items="totalItems"
      :loading="loading"
      :controller-type="getMenuByPath(path).controller.type"
      :controller-part="getMenuByPath(path).controller.part"
      :page-size="getMenuByPath(path).controller.pagesize"
      :has-categories="categories.length > 0"
      :user-write="getMenuByPath(path).controller.userWrite"
      :hide-header="!loading && items.length <= 0"
      @select-all="onSelectAllChange"
      @page="({ page }) => (currentPage = page)"
      @write="onWriteClick"
    >
      <template v-if="loading">
        <community-board-item-skeleton
          v-for="index in 10"
          :key="`${path}_board_item_sk_${currentPage}_${index}`"
        ></community-board-item-skeleton>
      </template>
      <template v-else>
        <template v-if="items.length > 0">
          <community-board-item
            v-for="(item, index) in items"
            :id="item.wr_id"
            :key="`${path}_board_item_${item.id}_${index}`"
            :is-admin="false"
            :category="item.category"
            :is-writer-admin="item.user_admin"
            :is-notice="item.is_notice"
            :title="item.subject"
            :writer="item.name"
            :date="item.datetime"
            :read="item.hits"
            :has-attachments="item.files > 0"
            :comments="item.comment_cnt2"
            :controller-type="getMenuByPath(path).controller.type"
            :controller-part="getMenuByPath(path).controller.part"
            :has-bets="item.wr_10.length > 0"
            :thumb="item.thumb"
            :is-reply="item.isReply"
            :reply-position="item.wr_reply.length"
            @click="
              ({ id }) =>
                $router.push({
                  name: 'community-path-id',
                  params: { path, id },
                  query: { ...$route.query, page: currentPage },
                })
            "
          ></community-board-item>
        </template>
        <template v-else>
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
    </community-board-container>
  </div>
</template>

<script>
import { createNamespacedHelpers } from 'vuex';
import SearchField from '~/components/common/SearchField';

import CommunityBoardContainer from '~/components/community/CommunityBoardContainer';
import CommunityBoardItem from '~/components/community/CommunityBoardItem';
import CommunityBoardItemSkeleton from '~/components/community/CommunityBoardItemSkeleton';

const {
  mapState: communityMenuState,
  mapGetters: communityMenuGetters,
} = createNamespacedHelpers('community/menu');

const {
  mapState: communityListState,
  mapActions: communityListActions,
} = createNamespacedHelpers('community/list');

export default {
  auth: false,
  components: {
    SearchField,
    CommunityBoardContainer,
    CommunityBoardItem,
    CommunityBoardItemSkeleton,
  },
  props: {
    path: { type: String, default: 'notice' },
  },
  data() {
    return {
      search: {
        field: null,
        word: null,
      },
      currentPage: 1,
    };
  },
  computed: {
    ...communityMenuState(['filter']),
    ...communityMenuGetters(['getMenuByPath']),
    ...communityListState([
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
    async $route(nRoute, oRoute) {
      if (!nRoute.query || nRoute.query.page === undefined) {
        this.currentPage = 1;
      }
      const { query, params } = nRoute;
      this.search.field = query.field;
      this.search.word = query.word;
      await this.getBoards({
        path: this.path,
        field: this.search.field,
        word: this.search.word,
        page: parseInt(this.currentPage) || 1,
        pagesize: this.getMenuByPath(this.path).controller.pagesize,
      });
    },
  },
  beforeMount() {
    this.search.field = this.$route.query.field || null;
    this.search.word = this.$route.query.word || null;
    const page = this.$route.query.page || 1;
    if (page) {
      this.currentPage = parseInt(page);
    }
  },
  async mounted() {
    const { path, search, currentPage } = this;
    await this.getBoards({
      path,
      field: search.field,
      word: search.word,
      page: currentPage,
      pagesize: this.getMenuByPath(path).controller.pagesize,
    });
  },
  methods: {
    ...communityListActions(['getBoards', 'clear']),
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
    },
    onWriteClick() {
      if (!this.$auth.loggedIn) {
        this.showPleaseLogInModal();
        return;
      }
      this.$router.push({
        name: 'community-path-write',
        params: { ...this.$route.params },
        query: { ...this.$route.query },
      });
    },
  },
};
</script>

<style scoped>
div.search-container {
  margin-bottom: 20px;
  padding-top: 20px;
}
.gallery + div.search-container {
  width: 355px;
  margin: 0 auto 20px;
}

div.pagination-container {
  text-align: center;
  margin-bottom: 20px;
  height: 20px;
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
  font-weight: 700;
}
</style>
