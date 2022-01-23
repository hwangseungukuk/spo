<template>
  <div class="qna-detail default-ctn">
    <template v-if="loading">
      <div class="spinner"></div>
    </template>
    <template v-else>
      <qna-detail-header
        :id="detail.qa_id"
        :title="detail.qa_subject"
        :status="getStatus(detail.qa_status).label"
        :status-css="getStatus(detail.qa_status).css"
        :date="detail.qa_datetime"
        :editable="getStatus(detail.qa_status).editable"
        :email="detail.email"
        :phone="detail.hp"
        :files="getFileList(detail.download_href, detail.download_source)"
        @edit="onEditClick"
        @delete="onDeleteClick"
      ></qna-detail-header>
      <div class="content">
        <div class="attachment-list">
          <img
            v-for="(img, index) in detail.img_file"
            :key="`attachment-images-${index}-${detail.qa_id}`"
            class="image attachments"
            :src="img"
          />
        </div>
        <div class="html-contents" v-html="detail.qa_content"></div>
      </div>
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
              :is-canceled="history.RefundingByUser === 1"
              :games="history.details"
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
              :getting="history.winSpoGold"
              :no-buttons="true"
            ></history-casual-item>
          </template>
        </template>
      </div>
      <template v-if="detail.qa_status === 2">
        <qna-detail-answer
          title="고객님의 문의에 대한 답변을 준비 중입니다."
        ></qna-detail-answer>
      </template>
      <template v-else-if="answer !== null">
        <qna-detail-answer
          :title="answer.qa_subject"
          :content="answer.qa_content"
          :date="answer.qa_datetime"
        ></qna-detail-answer>
      </template>
      <template v-else>
        <div class="spacer"></div>
      </template>
      <div class="flex align-items-center justify-content-center">
        <b-btn
          variant="info"
          class="go-to-list"
          @click="
            $router.push({
              name: 'mypage-customer-qna',
              query: {
                ...$route.query,
              },
            })
          "
        >
          <p>목록</p>
        </b-btn>
      </div>
    </template>
  </div>
</template>

<script>
import { createNamespacedHelpers } from 'vuex';

import QnaDetailHeader from '~/components/mypage/customer/qna/detail/QnaDetailHeader';
import QnaDetailAnswer from '~/components/mypage/customer/qna/detail/QnaDetailAnswer';

import HistoryItem from '~/components/hitgame/history/HistoryItem';
import HistoryCasualItem from '~/components/hitgame/history/HistoryCasualItem';

import betHistoryMixin from '~/mixins/write-bet-histories-mixin';

const { mapGetters: qaStatusGetters } = createNamespacedHelpers(
  'mypage/customer/type'
);

const {
  mapState: qaDetailState,
  mapActions: qaDetailActions,
} = createNamespacedHelpers('mypage/customer/qna/detail');

const {
  mapState: qaDetailDelState,
  mapActions: qaDetailDelActions,
} = createNamespacedHelpers('mypage/customer/qna/detail/delete');

export default {
  components: {
    QnaDetailHeader,
    QnaDetailAnswer,
    HistoryItem,
    HistoryCasualItem,
  },
  mixins: [betHistoryMixin],
  data() {
    return {
      id: 0,
      currentPage: 1,
    };
  },
  computed: {
    ...qaStatusGetters(['getStatus']),
    ...qaDetailDelState({
      isDeleted: 'success',
      delMessage: 'message',
      delError: 'error',
    }),
    ...qaDetailState([
      'success',
      'message',
      'error',
      'detail',
      'answer',
      'loading',
    ]),
  },
  watch: {
    isDeleted(v) {
      if (!v) {
        return;
      }
      this.$router.push({
        name: 'mypage-customer-qna',
        query: {
          ...this.$route.query,
        },
      });
    },
    success(v) {
      if (!v) {
        return;
      }
      if (this.detail.qa_score.length <= 0) {
        return;
      }
      this.bets = this.detail.qa_score;
    },
  },
  async beforeMount() {
    const { query, params } = this.$route;
    this.id = params.id;
    this.currentPage = query.page || 1;
    await this.getDetail({ id: this.id });
  },
  beforeDestroy() {
    this.clear();
    this.clearBets();
  },
  methods: {
    ...qaDetailActions(['getDetail', 'clear']),
    ...qaDetailDelActions({
      delete: 'delete',
      clearDelete: 'delete',
    }),
    getFileList(hrefs, sources) {
      if (!hrefs || !sources) {
        return [];
      }
      let results = [];
      hrefs.map((href, index) => {
        results = [
          ...results,
          {
            source: sources[index],
            href,
          },
        ];
      });
      return results;
    },
    onEditClick() {
      this.$router.push({
        name: 'mypage-customer-qawrite',
        query: {
          id: this.detail.qa_id,
          mode: 'update',
          page: this.currentPage,
        },
      });
    },
    onDeleteClick() {
      this.showDoubleButtonsModal({
        message: '문의 내역을 삭제하시겠습니까?',
        buttonConfirmText: '삭제',
        onConfirm: () => {
          this.delete({ id: this.detail.qa_id });
        },
      });
    },
  },
};
</script>

<style scoped>
.qna-detail {
  padding: 20px;
}

div.content {
  min-height: 110px;
  padding: 10px 25px 10px 40px;
  font-family: 'NanumBarunGothic', sans-serif;
}

div.content >>> p {
  margin: 0;
}

div.spacer {
  width: 100%;
  border-top: 1px solid #e6e6e6;
  height: 20px;
}

div.bet-list {
  border-top: 1px solid #e6e6e6;
  width: auto;
  margin: 0 auto 40px;
}

.btn.go-to-list {
  border: 1px solid #3eb2c0;
  background-color: #d8f0f2;
  color: #3eb2c0;
  width: 140px;
  height: 35px;
  font-size: 14px;
  font-weight: 700;
}

.image.attachments {
  max-width: 800px;
  margin: 0 auto;
}

.bet-list >>> .history-item,
.bet-list >>> .history-casual-item {
  margin: 0 auto;
  padding: 0;
  background-color: transparent;
  border-radius: unset;
}

.bet-list >>> .history-item:last-child,
.bet-list >>> .history-casual-item:last-child {
  border-bottom: unset;
}

.bet-list >>> .history-item .dummy {
  display: none;
}

div.html-contents {
  word-break: break-word;
}
</style>
