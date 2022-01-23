<template>
  <div class="qa-list-page white_cover">
    <div class="list-container default-ctn">
      <div class="qna-list">
        <div class="header flex">
          <p style="width: 60px">번호</p>
          <p style="width: 100px">구분</p>
          <p style="flex: 1">제목</p>
          <p style="width: 140px">상태</p>
          <p style="width: 135px">작성일</p>
        </div>
        <template v-if="loading">
          <div class="spinner"></div>
        </template>
        <template v-else>
          <template v-if="items.length > 0">
            <qna-item
              v-for="(item, index) in items"
              :id="item.qa_id"
              :key="`qa-items-${item.qa_id}_${index}`"
              :number="item.num"
              :category="item.qa_category"
              :title="item.subject"
              :status="item.qa_status"
              :date="item.qa_datetime"
              :has-attachments="item.hasFiles"
              :has-bets="item.qa_score.length > 0"
              @click="
                ({ id }) =>
                  $router.push({
                    name: 'mypage-customer-qna-id',
                    params: { id },
                    query: { ...$route.query },
                  })
              "
            ></qna-item>
          </template>
          <template v-else>
            <div class="flex no-has-items">
              <p v-if="hasQuerySearch">검색된 문의 내역이 없습니다.</p>
              <p v-else>문의 내역이 없습니다.</p>
            </div>
          </template>
        </template>
      </div>
      <div class="bottom-group flex">
        <form
          name="search-form"
          class="form search-field"
          @submit.prevent="onSearchClick"
        >
          <input
            id="search-field"
            v-model="search"
            type="text"
            name="search-field"
            placeholder="검색어를 입력해 주세요."
          />
          <b-btn size="sm" variant="info" type="submit">
            <i class="icon-svg search"></i>
          </b-btn>
        </form>
        <div class="spacer"></div>
        <nuxt-link
          tag="button"
          class="btn btn-info do-question"
          :to="{ name: 'mypage-customer-qawrite' }"
        >
          <span>문의하기</span>
        </nuxt-link>
      </div>
      <d-pagination
        v-show="totalItems > 0"
        :num="totalItems"
        :m-page="page"
        :list="pageSize"
        :block="10"
        @change="(v) => (page = v)"
      ></d-pagination>
    </div>
  </div>
</template>

<script>
import { createNamespacedHelpers } from 'vuex';

import QnaItem from '~/components/mypage/customer/qna/QnaItem';
import DPagination from '~/components/common/dPagination';

const {
  mapState: qaListState,
  mapActions: qaListActions,
} = createNamespacedHelpers('mypage/customer/qna');

export default {
  components: {
    QnaItem,
    DPagination,
  },
  data() {
    return {
      search: '',
      page: 1,
      pageSize: 20,
    };
  },
  computed: {
    ...qaListState([
      'success',
      'message',
      'error',
      'items',
      'categories',
      'totalItems',
      'loading',
    ]),
    hasQuerySearch() {
      const { query } = this.$route;
      if (!query) {
        return false;
      }
      if (!query.search) {
        return false;
      }
      return true;
    },
  },
  watch: {
    page(v, old) {
      if (v === old) {
        return;
      }
      this.$router.push({ name: 'mypage-customer-qna', query: { page: v } });
    },
    async $route(nRoute, oRoute) {
      console.log('watch route');
      console.log('watch nRoute', nRoute);
      if (nRoute.query.page === undefined) {
        this.page = 1;
      }
      this.search = nRoute.query.search;
      this.clearQaList();
      this.$router.push({
        name: nRoute.name,
        params: { ...nRoute.params },
        query: { ...nRoute.query, page: nRoute.query.page || 1 },
      });
      await this._load();
    },
  },
  beforeMount() {
    this.search = this.$route.query.search || null;
  },
  async mounted() {
    await this._load();
  },
  beforeDestroy() {
    this.clearQaList();
  },
  methods: {
    ...qaListActions({ getQaList: 'getList', clearQaList: 'clear' }),
    async _load() {
      await this.getQaList({ page: this.page, search: this.search });
    },
    onSearchClick() {
      if (this.search === null || this.search.length <= 0) {
        this.showSingleButtonModal({
          message: '검색어를 입력해 주세요.',
        });
        return;
      }
      this.$router.push({
        name: this.$route.name,
        query: { search: this.search, page: 1 },
      });
    },
  },
};
</script>

<style scoped>
.white_cover {
  padding: 20px 20px 40px;
}

.bottom-group {
  margin-bottom: 20px;
}

.search-field input {
  width: 200px;
  height: 30px;
  border: 1px solid #d9d9d9;
  color: #444444;
  border-radius: 5px;
  margin-right: 10px;
  padding: 0 10px 0;
  font-family: 'NanumBarunGothic', sans-serif;
}

.search-field input::placeholder {
  color: #999999;
}

.search-field input:focus {
  outline: unset;
  box-shadow: unset;
}

.search-field button {
  width: 30px;
  height: 30px;
  padding: 3px;
}

.search-field button i.icon-svg {
  width: 20px;
  height: 20px;
  background-color: white;
}

.qna-list {
  margin-bottom: 20px;
}

.qna-list .header {
  align-items: center;
  background-color: #f2f2f2;
  color: #444444;
  font-weight: 700;
  height: 40px;
  justify-content: center;
  margin-top: 10px;
  text-align: center;
}

.qna-list .header p {
  margin-bottom: 0;
}

.qna-list .no-has-items {
  width: 100%;
  height: 200px;
  background-color: transparent;
}

.qna-list .no-has-items {
  display: flex;
  align-items: center;
  min-height: 350px;
  margin-top: 10px;
  width: 100%;
  height: 450px;
}

.qna-list .no-has-items p {
  width: 100%;
  text-align: center;
  font-weight: 700;
}

.btn.do-question {
  width: 100px;
  height: 30px;
  border: 1px solid #3eb2c0;
  font-size: 14px;
  font-weight: 700;
  border-radius: 5px;
  padding: 0;
}

.list-container >>> .b-pagination {
  margin-bottom: 0;
}

.pagination-container {
  display: flex;
}
</style>
