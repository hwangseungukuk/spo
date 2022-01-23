<template>
  <div class="white_cover">
    <button-tabs
      :items="[
        { text: '전체', value: 0 },
        ...categories.map((category) => ({
          text: category.text,
          value: category.code,
        })),
      ]"
      :value="status"
      @change="onStatusChange"
    ></button-tabs>
    <div class="faq-list">
      <div class="faq-content default-ctn">
        <faq-board-container
          :page="currentPage"
          :total-items="totalItems"
          :loading="loading"
          :has-categories="0"
          @page="({ page }) => (currentPage = page)"
        >
          <template v-if="loading">
            <faq-board-item-skeleton
              v-for="index in 10"
              :key="`board_item_sk_${currentPage}_${index}`"
            ></faq-board-item-skeleton>
          </template>
          <template v-else>
            <template v-if="items.length > 0">
              <div class="accordion" role="tablist">
                <faq-board-item
                  v-for="(item, index) in items"
                  :id="item.fa_id"
                  :key="`board_item_${item.fa_id}_${index}`"
                  :fa-subject="item.fa_subject"
                  :fm-subject="item.fm_subject"
                  :fa-content="item.fa_content"
                ></faq-board-item>
              </div>
            </template>
            <template v-else>
              <div class="no-has-items default-ctn flex">
                <p>검색된 게시글이 없습니다.</p>
              </div>
            </template>
          </template>
          <div class="search-container">
            <form class="search-field flex" @submit.prevent="onSearchSubmit">
              <input
                id="word"
                v-model="search.word"
                placeholder="무엇을 도와드릴까요?"
                name="word"
                type="text"
              />
              <button type="submit">
                <i class="icon-svg search"></i>
              </button>
            </form>
          </div>
        </faq-board-container>
      </div>
    </div>
  </div>
</template>

<script>
import { createNamespacedHelpers } from 'vuex';

import ButtonTabs from '~/components/common/ButtonTabs';

import FaqBoardContainer from '~/components/mypage/customer/faq/FaqBoardContainer';
import FaqBoardItem from '~/components/mypage/customer/faq/FaqBoardItem';
import FaqBoardItemSkeleton from '~/components/mypage/customer/faq/FaqBoardItemSkeleton';

const { mapState: faqState, mapActions: faqActions } = createNamespacedHelpers(
  'mypage/customer/faq'
);

const { mapState: faqCategoriesState } = createNamespacedHelpers(
  'mypage/customer/faq/categories'
);

export default {
  components: {
    ButtonTabs,
    FaqBoardContainer,
    FaqBoardItem,
    FaqBoardItemSkeleton,
  },
  data() {
    return {
      status: null,
      page: 1,
      currentPage: 1,
      search: {
        field: null,
        word: null,
      },
    };
  },
  computed: {
    ...faqCategoriesState(['categories']),
    ...faqState({
      items: 'items',
      totalItems: 'totalItems',
      loading: 'loading',
    }),
  },
  watch: {
    currentPage(v) {
      this.load();
    },
  },
  beforeMount() {
    this.status = 0;
  },
  mounted() {
    this.load();
  },
  beforeDestroy() {
    this.clearFaqs();
  },
  methods: {
    ...faqActions({
      getFaqs: 'getFaqs',
      clearFaqs: 'clear',
    }),
    load() {
      const { status, search, currentPage } = this;
      this.getFaqs({
        status,
        stx: search.word,
        page: currentPage,
      });
    },
    onStatusChange(v) {
      this.status = v;
      this.currentPage = 1;
      this.search.word = null;
      this.load();
    },
    onSearchSubmit() {
      const { word } = this.search;
      if (word === null || word === '') {
        this.showSingleButtonModal({
          message: '검색어를 입력해 주세요.',
        });
        return;
      }
      this.status = 0;
      this.currentPage = 1;
      this.load();
    },
  },
};
</script>

<style scoped>
.button-tabs {
  width: 720px;
  margin: 0 auto 20px;
}

.button-tabs >>> .button-group .btn {
  width: 120px;
}

.no-has-items {
  border-top: 1px solid #e6e6e6;
  border-radius: unset;
}

div.search-container {
  margin-bottom: 10px;
  margin-top: 10px;
}

div.pagination-container {
  margin-top: 5px;
  text-align: center;
  margin-bottom: 20px;
}

form.search-field {
  align-items: center;
  justify-content: center;
}

form.search-field > * {
  margin-right: 5px;
}

form.search-field > *:last-child {
  margin-right: 0;
}

.search-field input#word {
  width: 260px;
  height: 30px;
  border: 1px solid #d9d9d9;
  font-size: 12px;
  background-color: white;
  border-radius: 5px;
  padding: 0 10px;
  color: #444444;
  font-family: 'NanumBarunGothic', sans-serif;
}

.search-field input#word:focus,
.search-field input#word:active {
  outline: unset;
  box-shadow: unset;
}

.search-field button,
.search-field button .icon-svg {
  transition: all 0.3s;
}

.search-field button {
  width: 30px;
  height: 30px;
  background-color: #3eb2c0;
  border-radius: 5px;
  border: 1px solid #3eb2c0;
  padding: 4px;
}

.search-field button .icon-svg.search {
  background-color: white;
  width: 20px;
  height: 18px;
}

.search-field button:hover {
  background-color: #ffffffaa;
}

.search-field button:hover .icon-svg {
  background-color: #3eb2c0aa;
}

.search-field button:focus {
  outline: unset;
  box-shadow: unset;
}
</style>
