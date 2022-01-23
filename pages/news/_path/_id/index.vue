<template>
  <div class="news-board-detail-container">
    <news-board-detail-header
      :loading="loading"
      :title="loading ? '' : data !== null ? data.wr_subject : ''"
      :writer="loading ? '' : data !== null ? data.wr_name : ''"
      :is-from-admin="loading ? false : data !== null ? data.user_admin : false"
      :date="loading ? null : data !== null ? data.datetime : new Date()"
      :hit="loading ? '' : data !== null ? data.wr_hit : ''"
    ></news-board-detail-header>
    <news-board-detail-contents
      :loading="loading"
      :contents="loading ? '' : data ? data.wr_content : ''"
    ></news-board-detail-contents>
    <template v-if="loading">
      <div class="list">
        <div class="item">
          <b-skeleton></b-skeleton>
        </div>
        <div class="item">
          <b-skeleton></b-skeleton>
        </div>
      </div>
    </template>
    <template v-else>
      <div class="list">
        <div v-if="getNext !== null" class="item next">
          <p
            @click="
              $router.push({
                name: 'news-path-id',
                params: { path, id: parseInt(getNext.wr_id) },
                query: { ...$route.query },
              })
            "
          >
            <span><i class="icon-svg up arrow"></i>다음</span>
            {{ getNext.wr_subject }}
          </p>
        </div>
        <div v-if="getPrev !== null" class="item prev">
          <p
            @click="
              $router.push({
                name: 'news-path-id',
                params: { path, id: parseInt(getPrev.wr_id) },
                query: { ...$route.query },
              })
            "
          >
            <span><i class="icon-svg down arrow"></i>이전</span>
            {{ getPrev.wr_subject }}
          </p>
        </div>
      </div>
    </template>
    <div class="flex">
      <div class="spacer"></div>
      <nuxt-link
        tag="button"
        variant="info"
        class="btn btn-info btn-list"
        :to="{
          name: 'news-path',
          params: { path: path !== null ? path : 'notice' },
          query: {
            ...$route.query,
          },
        }"
      >
        <p>목록</p>
      </nuxt-link>
      <div class="spacer"></div>
    </div>
  </div>
</template>

<script>
import { createNamespacedHelpers } from 'vuex';

import NewsBoardDetailHeader from '~/components/news/detail/NewsBoardDetailHeader';
import NewsBoardDetailContents from '~/components/news/detail/NewsBoardDetailContents';

const {
  mapState: newsDetailState,
  mapActions: newsDetailActions,
} = createNamespacedHelpers('news/detail');

export default {
  auth: false,
  components: {
    NewsBoardDetailHeader,
    NewsBoardDetailContents,
  },
  data() {
    return {
      path: null,
      id: null,
    };
  },
  computed: {
    ...newsDetailState(['success', 'message', 'error', 'data', 'loading']),
    getPrev() {
      const { data } = this;
      if (data === null) {
        return null;
      }
      const { prev } = data;
      return prev;
    },
    getNext() {
      const { data } = this;
      if (data === null) {
        return null;
      }
      const { next } = data;
      return next;
    },
  },
  watch: {
    message(v) {
      if (v === null) {
        return;
      }
      this.showSingleButtonModal({
        message: v.replace('\\n', '<br />'),
        onConfirm: () => {
          this.$router.push({
            name: 'news-path',
            params: { path: this.path !== null ? this.path : 'notice' },
            query: {
              ...this.$route.query,
            },
          });
        },
      });
    },
    path(v, oldV) {
      if (v === null) {
        this.path = oldV;
      }
    },
    id(v, oldV) {
      if (v === null) {
        this.id = oldV;
      }
    },
    async $route(nRoute, oRoute) {
      const rPath = nRoute.params.path;
      this.path = rPath === null ? oRoute.params.path : rPath;
      this.id = nRoute.params.id;

      this.clear();
      const { path, id } = this;
      await this.getDetail({ id, path });
    },
  },
  beforeMount() {
    this.path = this.$route.params.path;
    this.id = this.$route.params.id;
  },
  async mounted() {
    const { path, id } = this;
    await this.getDetail({ id, path });
  },
  methods: {
    ...newsDetailActions(['getDetail', 'clear']),
  },
};
</script>

<style scoped>
.btn.btn-list {
  width: 110px;
  height: 35px;
  background-color: #d8f0f2;
  color: #3eb2c0;
  border-radius: 10px;
  border: 1px solid #3eb2c0;
}

.btn.btn-list:focus {
  outline: unset;
  box-shadow: 0 0 0 3px #3eb2c088;
}

.btn.btn-list:hover,
.btn.btn-list:active {
  background-color: #3eb2c0;
  color: white;
  border-radius: 10px;
  border: 1px solid #3eb2c0;
}

.btn > p {
  margin-bottom: 0;
  font-size: 14px;
}

.b-skeleton {
  margin-bottom: 5px;
}

.b-skeleton:last-child {
  margin-bottom: 20px;
}

div.list {
  border-top: 2px solid #e5e5e5;
  border-bottom: 2px solid #e5e5e5;
  margin-bottom: 20px;
}

div.list .item {
  padding: 9px 20px;
  height: 35px;
  color: #999999;
}

div.list .item:first-child {
  border-bottom: 1px solid #e5e5e5;
}

div.list .item:last-child {
  border-bottom: unset;
}

div.list .item p {
  width: fit-content;
  margin-bottom: 0;
  max-width: 700px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-family: 'NanumBarunGothic', sans-serif;
}

div.list .item p:hover {
  cursor: pointer;
}

div.list .item p span {
  margin-right: 10px;
  color: #444444;
}

i.icon-svg {
  width: 9px;
  height: 7px;
  margin-right: 10px;
  background-color: #999999;
}
.news-board-detail-container {
  padding-bottom: 20px;
}
</style>
