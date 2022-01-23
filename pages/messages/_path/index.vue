<template>
  <div>
    <messages-board-container
      :page="currentPage"
      :item-ids="itemIds"
      :items-length="items.length"
      :path="path"
      @select-all="onSelectAllChange"
      @select-delete="onSelectDelete"
      @all-delete="onAllDelete"
      @write="
        $router.push({
          name: 'messages-path-write',
          params: { ...$route.params },
          query: { ...$route.query },
        })
      "
    >
      <template #messages>
        <template v-if="loading">
          <div class="align-items-center flex" style="height: 400px">
            <div class="spinner white"></div>
          </div>
        </template>
        <template v-else>
          <template v-if="items.length > 0">
            <div
              v-for="(item, index) in items"
              :key="`${path}_board_item_${item.id}_${index}`"
              :class="`board item flex ${
                item.me_read_datetime === '0000-00-00 00:00:00' ? '' : 'hasRead'
              }`"
            >
              <b-form-checkbox v-model="itemIds" :value="item.me_id" />
              <p :class="`label writer ${isAdmin(item.mb_id) ? 'admin' : ''}`">
                <i v-if="isAdmin(item.mb_id)" class="icon-svg admin"></i>
                {{ isAdmin(item.mb_id) ? '스포라이브' : item.name }}
              </p>
              <div class="label title flex" @click="messageDetail(item.me_id)">
                <p>{{ item.me_memo }}</p>
              </div>
              <p class="label date">
                {{ $moment(item.me_send_datetime).format('YY-MM-DD HH:mm:ss') }}
              </p>
            </div>
          </template>
          <template v-else>
            <div class="flex no-has-items">
              <p>{{ path === 'recv' ? '받은 ' : '보낸 ' }}쪽지가 없습니다.</p>
            </div>
          </template>
        </template>
      </template>
      <template #pagination>
        <div v-if="loading" style="height: 20px"></div>
        <d-pagination
          v-if="!loading"
          :num="totalItems"
          :m-page="currentPage"
          :list="10"
          :block="10"
          @change="(v) => (currentPage = v)"
        ></d-pagination>
      </template>
    </messages-board-container>
  </div>
</template>
<script>
import { createNamespacedHelpers } from 'vuex';

import MessagesBoardContainer from '~/components/messages/MessagesBoardContainer';
import DPagination from '~/components/common/dPagination';

const {
  mapState: messagesListState,
  mapActions: messagesListActions,
} = createNamespacedHelpers('user/messages/list');
export default {
  components: {
    MessagesBoardContainer,
    DPagination,
  },
  data() {
    return {
      path: null,
      search: {
        field: null,
        word: null,
      },
      currentPage: 1,
      itemIds: [],
    };
  },
  computed: {
    ...messagesListState([
      'success',
      'message',
      'loading',
      'error',
      'items',
      'totalItems',
    ]),
    isAdmin() {
      return (id) => {
        return id === 'game_admin' || id === 'sysadmin';
      };
    },
  },
  watch: {
    currentPage(v) {
      console.log('currentPage', v);
      this.$router.push({
        name: this.$route.name,
        params: { ...this.$route.params },
        query: { ...this.$route.query, page: v },
      });
    },
    async $route(nRoute, oRoute) {
      console.log('nRoute.query.page:', nRoute.query.page);
      if (nRoute.query.page === undefined) {
        this.currentPage = 1;
      }
      await this.getBoards({
        path: nRoute.params.path,
        page: parseInt(nRoute.query.page) || 1,
        pagesize: 10,
      });
      this.itemIds = [];
      this.path = nRoute.params.path;
    },
    // itemIds(v) {
    //   console.log('itemIds:', v.length);
    // },
  },
  beforeMount() {
    this.path = this.$route.params.path;
    const page = this.$route.query.page;
    if (page) {
      this.currentPage = parseInt(page);
    }
  },
  async mounted() {
    const { path, currentPage } = this;
    await this.getBoards({
      path,
      page: currentPage || 1,
      pagesize: 10,
    });
  },
  methods: {
    ...messagesListActions(['getBoards', 'selectDelete', 'allDelete', 'clear']),
    onSelectAllChange(v) {
      // console.log('onSelectAllChange', v);
      this.itemIds = [];
      if (v.checked === true) {
        for (this.item in this.items) {
          this.itemIds.push(this.items[this.item].me_id);
        }
      }
    },
    onSelectDelete() {
      this.showDoubleButtonsModal({
        message: '선택한 쪽지를 삭제하시겠습니까?',
        buttonConfirmText: '삭제',
        onConfirm: () => {
          const { path, itemIds } = this;
          this.selectDelete({
            path,
            ids: itemIds,
          });

          // 삭제후 리로드 임시
          this.itemIds = [];
          setTimeout(() => {
            this.getBoards({
              path,
              page: this.currentPage,
              pagesize: 10,
            });
          }, 1000);
        },
      });
    },
    onAllDelete() {
      this.showDoubleButtonsModal({
        message: '모든 쪽지를 삭제하시겠습니까?',
        buttonConfirmText: '삭제',
        onConfirm: () => {
          const { path, itemIds } = this;
          this.allDelete({
            path,
          });

          // 삭제후 리로드 임시
          this.itemIds = [];
          setTimeout(() => {
            this.getBoards({
              path,
              page: this.currentPage,
              pagesize: 10,
            });
          }, 1000);
        },
      });
    },
    // onChecked(v) {
    //   console.log('onChecked', v);
    // },
    onSearchSubmit({ field, word }) {
      const { path } = this;
      this.$router.push({
        name: this.$route.name,
        params: { path },
        query: { field, word, page: 1 },
      });
    },
    onButtonOneClick() {
      this.showSingleButtonModal({
        message: 'Hello world',
        description: null,
        buttonText: 'Confirm',
        onConfirm: () => {
          console.log('Bye Bye');
        },
      });
    },
    messageDetail(meId) {
      const { path, currentPage } = this;
      this.$router.push({
        name: 'messages-path-id',
        params: { path, id: parseInt(meId) },
        query: { page: currentPage },
      });
    },
  },
};
</script>
<style scoped>
div.search-container {
  margin-bottom: 10px;
}
div.pagination-container {
  margin-top: 5px;
  text-align: center;
  margin-bottom: 20px;
}

div.board.item {
  height: 40px;
  align-items: center;
}

.board.item.hasRead p {
  color: #ccc !important;
}
.board.item.hasRead p.admin {
  color: #3eb2c0 !important;
}

.label,
div.label > p {
  margin-bottom: 0;
  color: #888888;
  text-align: center;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

p.label.number,
p.label.part,
p.label.read {
  width: 80px;
  border: 1px solid red;
}

p.label.part {
  width: 100px;
}

p.label.notice {
  color: #3eb2c0;
  font-weight: 800;
}

.label.title {
  flex: 1;
  text-align: left;
  padding: 0 5px;
}

div.board.item:hover .label.title {
  cursor: pointer;
  font-weight: 700;
}

.label.title p {
  max-width: 450px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-family: NanumBarunGothic, sans-serif;
}

p.label.writer,
p.label.date {
  width: 125px;
}

p.label.writer.admin {
  color: #3eb2c0;
}

div.custom-checkbox {
  text-align: center;
  width: 60px;
  padding-top: 3px;
  padding-left: 30px;
}

i.icon-svg.attachment {
  width: 18px;
  height: 18px;
  background-color: #3eb2c0;
}

i.icon-svg.bet {
  width: 30px;
  height: 20px;
  margin-left: 5px;
  background-color: transparent;
}

.part {
  height: 20px;
  line-height: 20px;
}
.part span {
  display: inline-flex;
  color: #3eb2c0;
  height: 20px;
  line-height: 20px;
}

.part span i.icon-svg.baseball,
.part span i.icon-svg.soccer,
.part span i.icon-svg.basketball {
  width: 20px;
  height: 20px;
  background-color: #3eb2c0;
  margin-right: 10px;
}

i.icon-svg.etc {
  position: relative;
  width: 20px;
  height: 20px;
  margin-right: 10px;
  background-color: transparent;
  color: #3eb2c0;
  -webkit-mask-image: unset;
  mask-image: unset;
  /* border: 1px solid red; */
}

i.icon-svg.etc::after {
  position: absolute;
  top: 0px;
  left: 2px;
  font-size: 30px;
  content: '-';
}

span.comment-cnt {
  color: #000;
}

i.icon-svg.admin {
  width: 14px;
  height: 14px;
  background-color: unset;
  margin-right: 5px;
  margin-bottom: -3px;
}

.no-has-items {
  height: 400px;
}
</style>
