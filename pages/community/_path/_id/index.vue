<template>
  <div class="community-board-detail-container">
    <community-board-detail-header
      :loading="loading"
      :controller-part="getMenuByPath(path).controller.part"
      :title="data.wr_subject"
      :writer="data.wr_name"
      :hit="data.wr_hit"
      :is-from-admin="data.user_admin"
      :date="data.datetime"
      :category="data.ca_name"
      :files="getFileList(data.files)"
      :links="getLinkList(data.link)"
    ></community-board-detail-header>
    <community-board-detail-contents
      :loading="loading"
      :contents="data.wr_content"
      :is-owner="data.is_my"
      :user-write="getMenuByPath(path).controller.userWrite"
      :reply-cnt="data.reply_cnt"
      @modify="onUpdateClick"
      @delete="onDeleteClick"
      @reply="onReplyClick"
      @write="onWriteClick"
    >
      <template #attachments>
        <template v-if="!loading && success">
          <div
            v-for="(file, index) in data.files.filter(
              (file) => file.view !== null
            )"
            :key="`board-detail-attachments-${index}`"
            :style="`background-image: url(${
              file.view + '?' + $moment(newdate).format('YYMMDDHHmmss')
            }); width: ${file.image_width}px; height: ${file.image_height}px`"
            class="image attachments"
          ></div>
        </template>
      </template>
      <template #bets>
        <div class="bet-list" :style="bets !== null ? '' : 'display: none'">
          <template v-if="bets !== null">
            <template v-if="bets.startsWith('5::')">
              <history-item
                v-for="(history, index) in betHistories"
                :id="history.DrawId"
                :key="`bet-history-${index}-${history.id}`"
                :status="getBettingStatus(history.DrawState)"
                :type-name="getBettingType(history.DrawType).text"
                :type="history.DrawType"
                :date="history.DateDrawn"
                :golds="history.SpoGold"
                :rate="history.Odd"
                :expected="history.ExpectedWinSpoGold"
                :games="history.details"
                :is-canceled="history.RefundingByUser === 1"
                :no-buttons="true"
              ></history-item>
            </template>
            <template v-else>
              <history-casual-item
                v-for="(history, index) in betHistories"
                :id="history.index"
                :key="`bet-history-${index}-${history.index}`"
                :succeeded="history.succeeded"
                :inning="history.inning"
                :name="getCasualWithBets(bets).name"
                :eng="getCasualWithBets(bets).eng"
                :date="history.insertDT"
                :golds="history.spoGold"
                :rate="history.winRate"
                :user-selected="history.forecastValue"
                :result="history.resultValue"
                :status="history.status"
                :getting="history.winSpoGold"
                :no-buttons="true"
              ></history-casual-item>
            </template>
          </template>
        </div>
      </template>
    </community-board-detail-contents>

    <community-board-detail-comment
      :comments="commentList.length"
      @comment-write="onCommentWrite"
    >
      <template v-for="(item, index) in commentList">
        <community-board-detail-comment-item
          :key="`item_${index}`"
          :wr-comment-reply="item.wr_comment_reply"
          :wr-name="item.wr_name"
          :wr-datetime="item.wr_datetime"
          :wr-content="item.wr_content"
          :wr-id="item.wr_id"
          :is-reply="item.is_reply"
          :is-editable="item.is_edit"
          :is-del="item.is_del"
          :is-my="item.is_my"
          :is-write-open="openedCommentIndex === index"
          @edit-click="openedCommentIndex = null"
          @replyWriteClick="onReplyWriteClick(index)"
          @comment-write-reply="onCommentWrite"
          @comment-delete="onCommentDelete(index, item.wr_id)"
        ></community-board-detail-comment-item>
      </template>
    </community-board-detail-comment>

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
        <div v-if="getNext" class="item next">
          <p
            @click="
              $router.push({
                name: 'community-path-id',
                params: { path, id: parseInt(getNext.wr_id) },
                query: { ...$route.query },
              })
            "
          >
            <span><i class="icon-svg arrow up"></i>다음</span>
            {{ getNext.wr_subject }}
          </p>
        </div>
        <div v-if="getPrev" class="item prev">
          <p
            @click="
              $router.push({
                name: 'community-path-id',
                params: { path, id: parseInt(getPrev.wr_id) },
                query: { ...$route.query },
              })
            "
          >
            <span><i class="icon-svg arrow down"></i>이전</span>
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
          name: 'community-path',
          params: { path: path !== null ? path : 'analysis_new' },
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

import CommunityBoardDetailHeader from '~/components/community/detail/CommunityBoardDetailHeader';
import CommunityBoardDetailContents from '~/components/community/detail/CommunityBoardDetailContents';
import CommunityBoardDetailComment from '~/components/community/detail/CommunityBoardDetailComment';
import CommunityBoardDetailCommentItem from '~/components/community/detail/CommunityBoardDetailCommentItem';

import HistoryItem from '~/components/hitgame/history/HistoryItem';
import HistoryCasualItem from '~/components/hitgame/history/HistoryCasualItem';

import betHistoryMixin from '~/mixins/write-bet-histories-mixin';

const { mapGetters: communityMenuGetters } = createNamespacedHelpers(
  'community/menu'
);

const {
  mapState: detailState,
  mapActions: detailActions,
} = createNamespacedHelpers('community/detail');

const {
  mapState: deleteState,
  mapActions: deleteActions,
} = createNamespacedHelpers('community/detail/delete');

const {
  mapState: commentState,
  mapActions: commentActions,
} = createNamespacedHelpers('community/comment/list');

export default {
  auth: false,
  components: {
    CommunityBoardDetailHeader,
    CommunityBoardDetailComment,
    CommunityBoardDetailContents,
    CommunityBoardDetailCommentItem,
    HistoryItem,
    HistoryCasualItem,
  },
  mixins: [betHistoryMixin],
  props: {
    path: { type: String, default: null },
  },
  data() {
    return {
      id: null,
      newdate: new Date(),
      openedCommentIndex: null,
    };
  },
  computed: {
    ...communityMenuGetters(['getMenuByPath']),
    ...deleteState({
      deleted: 'success',
      deleteMessage: 'message',
      deleteError: 'error',
      deleting: 'deleting',
    }),
    ...detailState([
      'success',
      'result',
      'message',
      'error',
      'data',
      'comment',
      'loading',
    ]),
    ...commentState({
      commentResult: 'result',
      commentMessage: 'message',
      commentList: 'comment',
    }),
    getPrev() {
      const { prev } = this.data;
      return prev;
    },
    getNext() {
      const { next } = this.data;
      return next;
    },
  },
  watch: {
    success(v) {
      if (!v) {
        return;
      }
      if (this.data.wr_10 === null || this.data.wr_10.length <= 0) {
        return;
      }
      this.bets = this.data.wr_10;
    },
    message(v) {
      console.log('message:', v);
      if (v === null) {
        return;
      }
      this.showSingleButtonModal({
        message: v.replace('\\n', '<br />'),
        onConfirm: () => {
          this.$router.push({
            name: 'community-path',
            params: { path: this.path !== null ? this.path : 'community' },
            query: {
              ...this.$route.query,
            },
          });
        },
      });
    },
    deleted(v) {
      if (!v) {
        return;
      }
      this.$router.push({
        name: 'community-path',
        params: { path: this.path },
        query: { ...this.$route.query },
      });
    },
    deleteMessage(v) {
      console.log('description', v);
      if (v === null) {
        return;
      }
      this.showSingleButtonModal({
        message: '게시글을 삭제 할 수 없습니다.',
        description: v.replace('\\n\\n', '<br />'),
      });
    },
    deleteError(v) {
      if (v === null) {
        return;
      }
      this.showSingleButtonModal({
        message: '게시글을 삭제 할 수 없습니다.',
        description: '오류가 발생하였습니다.',
      });
    },
    id(v, oldV) {
      if (v === null) {
        this.id = oldV;
      }
    },
    async $route(nRoute, oRoute) {
      this.id = nRoute.params.id;

      this.clearBets();
      this.clearComments();
      this.clear();
      const { path, id } = this;
      await this.getDetail({ id, path });
      await this.getComment({ id, path });
    },
    async commentResult(v) {
      if (v === null) {
        return;
      }
      if (v === 'OK') {
        const { path, id } = this;
        await this.getComment({ id, path });
      }
    },
    commentMessage(v) {
      if (v === null) {
        return;
      }
      this.showSingleButtonModal({
        message: v,
        description: null,
      });
    },
  },
  beforeMount() {
    this.id = this.$route.params.id;
  },
  async mounted() {
    const { path, id } = this;
    await this.getDetail({ id, path });
    await this.getComment({ id, path });
  },
  beforeDestroy() {
    this.clearBets();
    this.clearComments();
    this.clear();
  },
  methods: {
    ...detailActions(['getDetail', 'fetch', 'clear']),
    ...deleteActions({
      deleteBoard: 'delete',
      clearDeleteState: 'clear',
    }),
    ...commentActions({
      getComment: 'getComment',
      writeComment: 'writeComment',
      deleteComment: 'deleteComment',
      clearComments: 'clear',
    }),
    onReplyWriteClick(index) {
      if (this.openedCommentIndex === index) {
        this.openedCommentIndex = null;
        return;
      }
      this.openedCommentIndex = index;
    },
    async onUpdateClick() {
      if (!this.$auth.loggedIn) {
        this.showPleaseLogInModal();
        return;
      }

      const { path, id } = this;
      await this.getComment({ id, path });
      await this.fetch({ id, path });
      if (this.hasOtherUserComments()) {
        this.showSingleButtonModal({
          message:
            '해당 글과 관련된 댓글이 1건 이상 <br /> 존재하므로 수정할 수 없습니다.',
          description: null,
        });
        return;
      }
      if (this.data.reply_cnt > 0) {
        this.showSingleButtonModal({
          message:
            '해당 글과 관련된 답글이 1건 이상<br />존재하므로 수정할 수 없습니다.',
        });
        return;
      }

      this.$router.push({
        name: 'community-path-write',
        params: { path: this.path },
        query: { ...this.$route.query, id: this.id, mode: 'update' },
      });
    },
    onReplyClick() {
      if (!this.$auth.loggedIn) {
        this.showPleaseLogInModal();
        return;
      }
      this.$router.push({
        name: 'community-path-write',
        params: { path: this.path },
        query: { ...this.$route.query, id: this.id, mode: 'reply' },
      });
    },
    onWriteClick() {
      if (!this.$auth.loggedIn) {
        this.showPleaseLogInModal();
        return;
      }
      this.$router.push({
        name: 'community-path-write',
        params: { path: this.path },
        query: { ...this.$route.query },
      });
    },
    getFileList(files) {
      if (!files) {
        return [];
      }
      return files.filter((file) => file.view === null);
    },
    getLinkList(links) {
      if (!links) {
        return [];
      }
      return Object.values(links).filter((link) => link !== null);
    },
    onDeleteClick() {
      if (this.deleting) {
        return;
      }
      this.showDoubleButtonsModal({
        message:
          '삭제한 게시글은 복구 할 수 없습니다. <br />정말 삭제 하시겠습니까?',
        buttonConfirmText: '삭제',
        description: null,
        accent: null,
        onConfirm: () => {
          this.doDelete();
        },
      });
    },
    doDelete() {
      this.deleteBoard({ path: this.path, id: this.id });
    },
    onCommentDelete(index, wrId) {
      this.showDoubleButtonsModal({
        message: '해당 댓글을 삭제하시겠습니까?',
        buttonConfirmText: '삭제',
        onConfirm: () => {
          this.doCommentDelete(index, wrId);
        },
      });
    },
    async doCommentDelete(index, wrId) {
      const { path, id } = this;
      await this.deleteComment({ path, wrId });
    },
    async onCommentWrite(v) {
      console.log('w:', v.w);
      if (v.wr_content) {
        const { path, id } = this;
        await this.writeComment({
          path,
          id,
          commentId: v.comment_id,
          wrContent: v.wr_content,
          w: v.w,
        });
      } else {
        this.showSingleButtonModal({
          message: '내용을 입력해주세요.',
          description: null,
        });
      }
    },
    hasOtherUserComments() {
      return this.commentList.some((comment) => {
        return !comment.is_my;
      });
    },
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

.community-board-detail-container {
  padding-bottom: 20px;
}
.community-board-detail-container div.bet-list {
  border-top: 1px solid #e6e6e6;
  width: auto;
  margin: 0 auto 40px;
}

.community-board-detail-container .bet-list >>> .history-item,
.community-board-detail-container .bet-list >>> .history-casual-item {
  margin: 0 auto;
  padding: 0;
  background-color: transparent;
  border-radius: unset;
}

.community-board-detail-container .bet-list >>> .history-item .dummy {
  display: none;
}

.image.attachments {
  background-size: contain;
  max-width: 800px;
  max-height: 800px;
  margin: 10px auto;
}
</style>
