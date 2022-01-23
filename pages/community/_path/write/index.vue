<template>
  <div>
    <template v-if="(isUpdate || isReply) && detailLoading">
      <div class="spinner"></div>
    </template>
    <template v-else>
      <community-write-form
        :categories="categories"
        :requesting="requesting"
        :category="isReply || isUpdate ? detail.ca_name : null"
        :subject="setSubject"
        :contents="setContents"
        :files="setFiles"
        :links="setLinks"
        :bet-count="betHistories.length"
        @betting="onBetListClick"
        @import-image="onImportImage"
        @image-removed="onImageRemoved"
        @submit="onSubmit"
        @cancel="onCancel"
      >
        <template v-if="bets !== null" #betting-histories>
          <template v-if="bets.startsWith('5::')">
            <history-item
              v-for="(history, index) in betHistories"
              :id="history.DrawId"
              :key="`community-write-${index}-${history.DrawId}`"
              :status="getBettingStatus(history.DrawState)"
              :type-name="getBettingType(history.DrawType).text"
              :type="history.DrawType"
              :date="$moment(history.DateDrawn, $moment.ISO_8601).toDate()"
              :golds="history.SpoGold"
              :rate="history.Odd"
              :expected="history.ExpectedWinSpoGold"
              :is-canceled="history.RefundingByUser === 1"
              :no-buttons="true"
              :games="history.details"
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
      </community-write-form>
    </template>
  </div>
</template>

<script>
import { createNamespacedHelpers } from 'vuex';

import CommunityWriteForm from '~/components/community/write/CommunityWriteForm';

import HistoryItem from '~/components/hitgame/history/HistoryItem';
import HistoryCasualItem from '~/components/hitgame/history/HistoryCasualItem';

import betHistoryMixin from '~/mixins/write-bet-histories-mixin';
import attachImagesMixin from '~/mixins/write-file-upload-mixin';

const {
  mapState: communityListState,
  mapActions: communityListActions,
} = createNamespacedHelpers('community/list');

const {
  mapState: communityDetailState,
  mapActions: communityDetailActions,
} = createNamespacedHelpers('community/detail');

const {
  mapState: communityWriteState,
  mapActions: communityWriteActions,
} = createNamespacedHelpers('community/write');

export default {
  components: {
    CommunityWriteForm,
    HistoryItem,
    HistoryCasualItem,
  },
  mixins: [betHistoryMixin, attachImagesMixin],
  props: {
    path: { type: String, default: null },
  },
  data() {
    return {
      id: null,
      isUpdate: false,
      isReply: false,
      currentPage: 1,
    };
  },
  computed: {
    ...communityListState({
      hasCategories: 'success',
      categoryMessage: 'message',
      categoryLoading: 'loading',
      categoryError: 'error',
      categories: 'categories',
    }),
    ...communityDetailState({
      hasDetail: 'success',
      detailMessage: 'message',
      detailError: 'error',
      detail: 'data',
      detailLoading: 'loading',
    }),
    ...communityWriteState([
      'success',
      'message',
      'error',
      'boardId',
      'requesting',
    ]),
    setSubject() {
      const { isUpdate, isReply, detail } = this;
      return !isUpdate && !isReply
        ? ''
        : `${isReply ? 'Re: ' : ''}${detail.wr_subject}`;
    },
    setContents() {
      const { isUpdate, isReply, detail } = this;
      return !isUpdate && !isReply
        ? ''
        : `${isReply ? '<br /><br /><br />&gt;&gt;&gt; ' : ''}${
            detail.wr_content
          }`;
    },
    setLinks() {
      const { isUpdate, isReply, detail } = this;
      if ((!isUpdate && !isReply) || !detail.link) {
        return [];
      }
      return Object.values(detail.link).filter((link) => link !== null);
    },
    setFiles() {
      const { isUpdate, isReply, detail } = this;
      if (isUpdate && detail.files.length > 0) {
        return detail.files;
      }
      return [];
    },
  },
  watch: {
    hasDetail(v) {
      if (!v) {
        return;
      }
      const { isUpdate, detail } = this;
      if (isUpdate && detail.wr_10 !== null && detail.wr_10.length > 0) {
        this.bets = this.detail.wr_10;
      }
      if (isUpdate && !detail.is_my) {
        this.showSingleButtonModal({
          message: `본인의 글만 수정 할 수 있습니다.`,
          onConfirm: () => {
            const { path, currentPage } = this;
            this.$router.push({
              name: `community-path`,
              params: { path },
              query: { page: currentPage },
            });
          },
        });
      }
    },
    success(v) {
      if (v === null) {
        return;
      }
      if (this.isReply) {
        return;
      }
      this.$router.push({
        name: 'community-path-id',
        params: { path: this.path, id: this.id },
        query: { page: this.currentPage || 1 },
      });
    },
    boardId(v) {
      if (v === null) {
        return;
      }
      this.$router.push({
        name: 'community-path-id',
        params: { path: this.path, id: v },
        query: { page: 1 },
      });
    },
    message(v) {
      if (v === null) {
        return;
      }
      this.showSingleButtonModal({
        message: v.replace('\\n', '<br/>'),
      });
    },
    error(v) {
      if (v === null) {
        return;
      }
      this.showSingleButtonModal({
        message: '오류가 발생하였습니다.',
      });
    },
  },
  async beforeMount() {
    const { query } = this.$route;
    this.isUpdate = query.mode === 'update';
    this.isReply = query.mode === 'reply';
    this.id = query.id || null;
    this.currentPage = query.page || 1;
    if (this.isUpdate || this.isReply) {
      await this.getDetail({ path: this.path, id: this.id });
    }
    await this.getBoards({ path: this.path, pagesize: 1 });
  },
  methods: {
    ...communityListActions(['getBoards', 'clear']),
    ...communityDetailActions(['getDetail', 'clear']),
    ...communityWriteActions(['write']),
    onBetListClick() {
      this.openHistoriesModal();
    },
    onImageRemoved(v) {
      const regx = /(http(s?):\/\/(\w.+\/+)+)/;
      const filename = v.replace(regx, '');
      this.imageDelete({ filename });
    },
    async onImportImage(v) {
      await this.imageUpload(v);
    },
    async onSubmit(v) {
      const { requesting, id, path, isUpdate, isReply, bets } = this;
      if (requesting) {
        return;
      }
      const parameters = {
        path,
        ...v,
        mode: isUpdate ? 'u' : isReply ? 'r' : '',
        bets,
      };
      if (isUpdate || isReply) {
        parameters.id = id;
      }
      await this.write(parameters);
    },
    onCancel() {
      const { id, path, isUpdate, isReply, currentPage } = this;
      const parameters = {
        name: `community-path${isUpdate || isReply ? '-id' : ''}`,
        params: { path },
        query: { page: currentPage },
      };
      if (isUpdate || isReply) {
        parameters.params.id = id;
      }
      this.$router.push(parameters);
    },
  },
};
</script>

<style scoped>
div >>> .history-item,
div >>> .history-casual-item {
  width: 100%;
  padding: 0;
  margin-bottom: 0;
  background-color: transparent;
  border-radius: 0;
  /*border-bottom: 1px solid #e6e6e6;*/
}

div >>> .history-item .head > div.rate-expected {
  border: unset;
}

div >>> .history-item:not(:last-child) .dummy {
  height: 0 !important;
}
</style>
