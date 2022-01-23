<template>
  <div class="messages-board-detail-container">
    <messages-board-detail-contents
      :loading="loading"
      :path="path"
      :sender-id="loading ? '' : data ? data.me_send_mb_id : ''"
      :sender-nickname="loading ? '' : data ? data.me_send_mb_nick : ''"
      :receiver-id="loading ? '' : data ? data.me_recv_mb_id : ''"
      :receiver-nickname="loading ? '' : data ? data.me_recv_mb_nick : ''"
      :message="loading ? '' : data ? data.me_memo : ''"
      :me-send-datetime="loading ? '' : data ? data.me_send_datetime : ''"
      :me-read-datetime="loading ? '' : data ? data.me_read_datetime : ''"
    ></messages-board-detail-contents>
    <div class="footer">
      <div class="item prev">
        <b-btn
          class="paging"
          variant="light"
          :disabled="getPrev === null"
          @click="
            $router.push({
              name: 'messages-path-id',
              params: { path, id: parseInt(getPrev.me_id) },
              query: { ...$route.query },
            })
          "
        >
          <i class="icon-svg board-pagination-prev"></i>
        </b-btn>
      </div>
      <div class="spacer" />
      <b-btn
        v-if="path === 'recv'"
        variant="info"
        :to="{
          name: 'messages-write',
          query: { me_id: id },
        }"
        >답장하기</b-btn
      >
      <nuxt-link
        tag="a"
        class="btn btn-light list"
        :to="{
          name: 'messages-path',
          params: { path },
          query: { ...$route.query },
        }"
        >목록</nuxt-link
      >
      <div class="spacer" />
      <div class="item next">
        <b-btn
          class="paging"
          variant="light"
          :disabled="getNext === null"
          @click="
            $router.push({
              name: 'messages-path-id',
              params: { path, id: parseInt(getNext.me_id) },
              query: { ...$route.query },
            })
          "
        >
          <i class="icon-svg board-pagination-next"></i>
        </b-btn>
      </div>
    </div>
  </div>
</template>

<script>
import { createNamespacedHelpers } from 'vuex';

import MessagesBoardDetailContents from '~/components/messages/detail/MessagesBoardDetailContents';

const {
  mapState: messagesDetailState,
  mapActions: messagesDetailActions,
} = createNamespacedHelpers('user/messages/detail');

export default {
  components: {
    MessagesBoardDetailContents,
  },
  data() {
    return {
      path: null,
      id: null,
      nick: null,
    };
  },
  computed: {
    ...messagesDetailState(['success', 'message', 'error', 'data', 'loading']),
    getPrev() {
      const { data } = this;
      if (data === null) {
        return null;
      }
      const { prev } = data;
      console.log('watch: prev:', prev);
      return prev;
    },
    getNext() {
      const { data } = this;
      if (data === null) {
        return null;
      }
      const { next } = data;
      console.log('watch: next:', next);
      return next;
    },
  },
  watch: {
    path(v, oldV) {
      if (v === null) {
        this.path = oldV;
      }
      console.log('watch:path', this.path);
    },
    id(v, oldV) {
      if (v === null) {
        this.id = oldV;
      }
      console.log('watch:id', this.id);
    },
    async $route(nRoute, oRoute) {
      const rPath = nRoute.params.path;
      this.path = rPath === null ? oRoute.params.path : rPath;
      this.id = nRoute.params.id;
      console.log('watch:rPath', this.path, this.id);
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
    ...messagesDetailActions(['getDetail', 'clear']),
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

.footer {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
}
.footer > button,
.footer > a {
  width: 95px;
  height: 35px;
  font-size: 14px;
  font-weight: 700;
  border-radius: 10px;
  transition: all 0.3s;
  margin: 0 3px;
}
.footer > a.list {
  color: #999;
  background: #e6e6e6;
  border: 1px solid #e6e6e6;
}
.footer > a.list:hover {
  background: #d6d6d6;
  border: 1px solid #d6d6d6;
}
.footer .paging {
  width: 35px;
  height: 35px;
  background: #f2f2f2;
}
.footer button i {
  width: 11px;
  height: 12px;
  background-color: #999;
}

.footer .spacer {
  flex: 1;
}
</style>
