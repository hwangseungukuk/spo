<template>
  <div class="store-content default-ctn white_cover">
    <template v-if="detailLoading">
      <div class="spinner"></div>
    </template>
    <template v-else>
      <qa-write-form
        :categories="categories"
        :category="isUpdate ? detail.qa_category : null"
        :email="isUpdate ? detail.email : ''"
        :contact="isUpdate ? detail.hp : $auth.user.mb_hp"
        :subject="isUpdate ? detail.qa_subject : ''"
        :contents="isUpdate ? detail.qa_content : ''"
        :bet-count="betHistories.length"
        :files="isUpdate ? detail.files : []"
        @category="onCategoryChange"
        @betting="onBetListClick"
        @import-image="onImportImage"
        @image-removed="onImageRemoved"
        @submit="onSubmit"
        @cancel="onCancelClick"
      >
        <template v-if="!isUpdate && faqs.length > 0" #faq-list>
          <div class="faq-headers">
            <i class="icon-svg exclamation outline"></i>
            <p>자주 하는 질문을 먼저 확인해보세요.</p>
          </div>
          <div class="faq-list">
            <faq-board-item
              v-for="(faq, index) in faqs"
              :id="faq.fa_id"
              :key="`faq-write-board-${index}`"
              :fa-subject="faq.fa_subject"
              :fm-subject="faq.fm_subject"
              :fa-content="faq.fa_content"
            ></faq-board-item>
          </div>
        </template>
        <template v-if="bets !== null" #betting-histories>
          <template v-if="bets.startsWith('5::')">
            <history-item
              v-for="(history, index) in betHistories"
              :id="history.DrawId"
              :key="`qna-write-${index}-${history.DrawId}`"
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
              :getting="history.winSpoGold"
              :no-buttons="true"
            ></history-casual-item>
          </template>
        </template>
      </qa-write-form>
    </template>
  </div>
</template>

<script>
import { createNamespacedHelpers } from 'vuex';

import QaWriteForm from '~/components/mypage/customer/qnawrite/QnaWriteForm';

import HistoryItem from '~/components/hitgame/history/HistoryItem';
import HistoryCasualItem from '~/components/hitgame/history/HistoryCasualItem';

import FaqBoardItem from '~/components/mypage/customer/faq/FaqBoardItem';

import betHistoryMixin from '~/mixins/write-bet-histories-mixin';
import attachImagesMixin from '~/mixins/write-file-upload-mixin';

const { mapState: faqState, mapActions: faqActions } = createNamespacedHelpers(
  'mypage/customer/faq'
);

const { mapState: faqCategoriesState } = createNamespacedHelpers(
  'mypage/customer/faq/categories'
);

const {
  mapState: writeState,
  mapActions: writeActions,
} = createNamespacedHelpers('mypage/customer/qna/write');

const {
  mapState: qaDetailState,
  mapActions: qaDetailActions,
} = createNamespacedHelpers('mypage/customer/qna/detail');

export default {
  components: {
    QaWriteForm,
    HistoryItem,
    HistoryCasualItem,
    FaqBoardItem,
  },
  mixins: [betHistoryMixin, attachImagesMixin],
  data() {
    return {
      id: null,
      isUpdate: false,
      currentPage: 1,
    };
  },
  computed: {
    ...faqState({
      faqs: 'items',
    }),
    ...faqCategoriesState(['categories']),
    ...writeState({
      success: 'success',
      message: 'message',
      error: 'error',
      qnaId: 'id',
      requesting: 'requesting',
    }),
    ...qaDetailState({
      hasDetail: 'success',
      detailMessage: 'message',
      detailError: 'error',
      detail: 'detail',
      detailLoading: 'loading',
    }),
  },
  watch: {
    async hasDetail(v) {
      if (!v) {
        return;
      }
      if (this.detail.qa_score.length <= 0) {
        return;
      }
      this.bets = this.detail.qa_score;
      await this.getBets(this.detail.qa_score);
    },
    success(v) {
      if (v === null) {
        return;
      }
      this.$router.push({
        name: 'mypage-customer-qna-id',
        params: { id: this.id },
        query: { page: this.currentPage },
      });
    },
    qnaId(v) {
      if (v === null || this.isUpdate) {
        return;
      }
      this.$router.push({
        name: 'mypage-customer-qna-id',
        params: { id: v },
        query: { ...this.$route.query },
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
    this.id = query.id || null;
    this.isUpdate = query.mode === 'update';
    this.currentPage = query.page || 1;
    if (this.isUpdate) {
      await this.getQnaDetail({ id: this.id });
    }
  },
  beforeDestroy() {
    this.clear();
    this.clearFaqs();
    this.clearBets();
    this.clearQnaDetail();
  },
  methods: {
    ...faqActions({
      getFaqs: 'getFaqs',
      clearFaqs: 'clear',
    }),
    ...writeActions(['write', 'clear']),
    ...qaDetailActions({
      getQnaDetail: 'getDetail',
      clearQnaDetail: 'clear',
    }),
    onCategoryChange(v) {
      this.getFaqs({ status: v.code, json: true });
    },
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
      if (this.requesting) {
        return;
      }
      const parameters = {
        path: this.path,
        ...v,
        bets: this.bets,
      };
      if (this.isUpdate) {
        parameters.id = this.id;
      }
      await this.write(parameters);
    },
    onCancelClick() {
      let parameters = null;
      if (this.isUpdate) {
        parameters = {
          name: 'mypage-customer-qna-id',
          params: { id: this.id },
          query: { page: this.currentPage },
        };
      } else {
        parameters = {
          name: 'mypage-customer-faq',
        };
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
