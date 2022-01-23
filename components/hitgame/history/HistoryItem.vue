<template>
  <div class="history-item default-ctn">
    <div :class="`head ${cExpanded ? 'expanded' : ''}`">
      <div class="status-type">
        <p :class="`status ${isCanceled ? 'canceled' : status.code}`">
          {{ isCanceled ? '취소' : status.text }}
        </p>
        <p class="type">
          {{
            `${typeName} ${games.length > 0 ? `(${games.length} 폴더)` : ''}`
          }}
        </p>
        <i
          v-if="!disabled"
          :class="`icon-svg more ${cExpanded ? 'expanded' : ''}`"
          :aria-expanded="cExpanded ? 'true' : 'false'"
          :aria-controls="`accodion-${id}`"
          @click="onExpandedClick"
        ></i>
      </div>
      <div class="date-gold">
        <p class="date">
          베팅 일시 :&nbsp;
          {{ $moment(date).format('YY-MM-DD HH:mm:ss') }}
        </p>
        <p class="gold">
          베팅 골드 :&nbsp;
          {{ golds.toLocaleString() }}
        </p>
      </div>
      <div class="rate-expected">
        <p class="rate">
          배당률 :&nbsp;
          {{ rate }}
        </p>
        <p class="expected">
          {{
            status.code === 'opened' ||
            status.code === 'await' ||
            status.code === 'sell'
              ? '예상 '
              : ''
          }}
          당첨 골드 :&nbsp;
          {{ getRewardGold(status.code, expected) }}
        </p>
      </div>
      <div class="button-group inline-flex">
        <template v-if="selectable">
          <b-btn
            variant="info"
            :class="`select ${selected ? 'on' : ''}`"
            @click="$emit('select', { selected })"
          >
            <p>선택</p>
          </b-btn>
        </template>
        <template v-else-if="noButtons"></template>
        <template v-else>
          <b-btn
            :disabled="
              type.toUpperCase() === 'LIVE' ||
              (isCanceled ? true : !status.cancelable)
            "
            :class="`cancel ${status.code}`"
            @click="
              () => {
                if (status.code !== 'sell') $emit('cancel');
              }
            "
          >
            <p>베팅 취소</p>
          </b-btn>
          <div class="spacer"></div>
          <b-btn class="share" @click="$emit('share')">
            <p>베팅 공유</p>
          </b-btn>
        </template>
      </div>
    </div>
    <b-collapse :id="`accodion-${id}`" v-model="cExpanded">
      <div class="card detail-info">
        <template v-if="loading">
          <div class="spinner hitgame"></div>
        </template>
        <template v-else>
          <history-detail-item
            v-for="(game, index) in games"
            :key="`${game.id}_history_detail_${id}_${index}`"
            :sport-id="game.SportId"
            :tournament-id="game.TournamentId"
            :match-status="game.MatchStatusCode"
            :market-status="game.MarketStatus"
            :status="game.DrawState"
            :date="game.MatchDateKor"
            :game-type="
              game.DrawType.toUpperCase() === 'LIVE'
                ? decorateGameType(game)
                : getGameType(game.SRSMarketType).text
            "
            :game-type-code="
              game.DrawType.toUpperCase() === 'LIVE'
                ? game.MarketId.toString()
                : getGameType(game.SRSMarketType).code
            "
            :draw-type="game.DrawType"
            :current="
              game.DrawType.toUpperCase() === 'LIVE'
                ? status.code === 'succeeded'
                  ? '1'
                  : null
                : game.Result
            "
            :alloted="game.AllottedValue"
            :special-market-type="game.SRSSpecialMarketType"
            :home-name="getTeamName(game.HomeTeam_UniqueId, game.HomeTeam_Name)"
            :away-name="getTeamName(game.AwayTeam_UniqueId, game.AwayTeam_Name)"
            :home-score="game.HomeTeam_Score"
            :away-score="game.AwayTeam_Score"
            :left-rate="game.Odd_L"
            :center-rate="game.Odd_C"
            :right-rate="game.Odd_R"
            :live-rate="game.AggregatedOdd"
            :outcome-l="game.Outcome_L"
            :outcome-c="game.Outcome_C"
            :outcome-r="game.Outcome_R"
            :outcome-live="decorateOutcome(game)"
            :selected="
              game.DrawType.toUpperCase() === 'LIVE' ? '1' : game.Prediction
            "
            :is-canceled="isCanceled"
          ></history-detail-item>
        </template>
      </div>
    </b-collapse>
  </div>
</template>

<script>
/* eslint-disable camelcase */
import { createNamespacedHelpers } from 'vuex';

import HistoryDetailItem from '~/components/hitgame/history/HistoryDetailItem';

const { mapGetters: gameTypeGetters } = createNamespacedHelpers(
  'mapper/game-type'
);

export default {
  components: {
    HistoryDetailItem,
  },
  props: {
    id: { type: Number, default: 0 },
    status: {
      type: Object,
      default: () => ({
        code: 'code',
        text: '텍스트',
      }),
    },
    type: { type: String, default: 'type' },
    typeName: { type: String, default: 'type' },
    date: { type: Date, default: () => new Date() },
    golds: { type: Number, default: 0 },
    rate: { type: Number, default: 0 },
    expected: { type: Number, default: 0 },
    games: { type: Array, default: () => [] },
    expanded: { type: Boolean, default: false },
    disabled: { type: Boolean, default: false },
    selectable: { type: Boolean, default: false },
    isCanceled: { type: Boolean, default: false },
    selected: { type: Boolean, default: false },
    noButtons: { type: Boolean, default: false },
    loading: { type: Boolean, default: false },
  },
  data() {
    return {
      cExpanded: false,
    };
  },
  computed: {
    ...gameTypeGetters(['getGameType']),
    getRewardGold() {
      return (statusCode, expected) => {
        if (statusCode === 'failed') {
          return 0;
        } else {
          return expected.toLocaleString();
        }
      };
    },
  },
  beforeMount() {
    this.cExpanded = this.expanded;
  },
  methods: {
    decorateGameType(game) {
      const label = this.getMarketIdName(game.SportId, game.MarketId);
      const {
        HomeTeam_UniqueId,
        HomeTeam_Name,
        AwayTeam_UniqueId,
        AwayTeam_Name,
        Specifiers,
      } = game;
      let result = label;
      if (Specifiers) {
        for (const key of Object.keys(Specifiers)) {
          result = result.replace(`{${key}}`, Specifiers[key]);
        }
      }
      result = result.replace(
        /\{\$competitor1\}/g,
        this.getTeamName(HomeTeam_UniqueId, HomeTeam_Name)
      );
      result = result.replace(
        /\{\$competitor2\}/g,
        this.getTeamName(AwayTeam_UniqueId, AwayTeam_Name)
      );
      return result;
    },
    decorateOutcome(game) {
      const founded = this.getMarketInfoTemplate(
        game.SportId,
        game.MarketId,
        game.OutomeId
      );
      if (!founded) {
        return '';
      }
      const label = founded.OutomeIdName;
      const {
        HomeTeam_UniqueId,
        HomeTeam_Name,
        AwayTeam_UniqueId,
        AwayTeam_Name,
        Specifiers,
      } = game;
      let result = label;
      if (Specifiers) {
        for (const key of Object.keys(Specifiers)) {
          result = result.replace(`{${key}}`, Specifiers[key]);
        }
      }
      result = result.replace(
        /\{\$competitor1\}/g,
        this.getTeamName(HomeTeam_UniqueId, HomeTeam_Name)
      );
      result = result.replace(
        /\{\$competitor2\}/g,
        this.getTeamName(AwayTeam_UniqueId, AwayTeam_Name)
      );
      return result;
    },
    onExpandedClick() {
      if (this.disabled) {
        return;
      }
      this.cExpanded = !this.cExpanded;
    },
  },
};
</script>

<style scoped>
div.history-item {
  width: 100%;
}

div.history-item .head {
  width: 100%;
  height: 60px;
  display: inline-flex;
  border-bottom: 1px solid #e6e6e6;
}

div.history-item .head.expanded {
  border-bottom: unset;
  height: 59px; /*더보기버튼 클릭시 꿀렁이는 폰트 부여잡기용*/
}

div.modal-container div.history-item .head + div {
  padding-bottom: 20px;
}

div.history-item .head > div {
  padding: 10px 20px;
  border-right: 2px solid #f2f2f2;
  height: 100%;
}

div.history-item .head > div:first-child {
  padding-left: 0;
}

div.history-item .head > div:last-child {
  border-right: unset;
  padding-right: 0;
}

div.history-item .head > div.status-type {
  width: 240px;
  display: inline-flex;
  align-items: center;
}

p {
  margin-bottom: 4px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

p.status {
  width: 80px;
  height: 30px;
  font-size: 13px;
  font-weight: 800;
  color: white;
  margin-bottom: 0;
  margin-right: 10px;
  border-radius: 5px;
  background-color: #557097;
  text-align: center;
  padding-top: 6px;
}

p.status.await {
  background-color: #557097;
  text-indent: 2px;
  letter-spacing: 4px;
}

p.status.sell {
  text-indent: 3px;
  letter-spacing: 2px;
}

p.status.special {
  background-color: #719ebd;
}

p.status.canceled {
  letter-spacing: 4px;
  text-indent: 2px;
  background-color: #cccccc;
}

p.status.failed {
  background-color: #999999;
}

p.status.succeeded {
  background: linear-gradient(90deg, #5da9d6 0%, #70d0c9 100%);
}

p.type {
  width: 103px;
  margin-bottom: 0;
  font-weight: 800;
  color: #444444;
  font-size: 14px;
}

div.history-item .head > div.date-gold {
  width: 210px;
}

div.history-item .head > div.rate-expected {
  width: 250px;
}

.board-container div.history-item .head > div.rate-expected {
  border-right: none;
}

.qna-detail div.history-item .head > div.rate-expected {
  border-right: none;
}
div.modal-container div.history-item .head > div.rate-expected {
  border-right: none;
}

div.history-item .head > div.button-group {
  width: 180px;
}

div.rate-expected {
  color: #3eb2c0;
  font-weight: 700;
}

i.icon-svg.more {
  width: 20px;
  height: 20px;
  margin-left: 5px;
  margin-bottom: 0px;
  background-image: url(~assets/icons/bettings/betting-more.svg);
  -webkit-mask-image: unset;
  mask-image: unset;
  background-color: transparent;
  cursor: pointer;
  transition: all 0.3s;
}

i.icon-svg.more.expanded {
  background-image: url(~assets/icons/bettings/betting-more-expanded.svg);
}

div.button-group {
  align-items: center;
  justify-content: center;
}

div.button-group button.btn {
  width: 75px;
  height: 30px;
  border-radius: 5px;
  font-size: 12px;
  border: unset;
}

div.button-group button.btn:first-child {
  margin-right: 5px;
}

div.button-group .btn.select {
  width: 130px;
  background-color: #d8f0f2;
  color: #3eb2c0;
}

div.button-group .btn.select:focus {
  outline: unset;
  box-shadow: unset;
}

div.button-group .btn.select.on {
  background-color: #3eb2c0;
  /* border: 1px solid #3eb2c0; */
  color: #fff;
  outline: unset;
  box-shadow: unset;
}

div.button-group .btn:focus,
div.button-group .btn:active {
  outline: unset;
  border: unset;
}

div.button-group .btn.cancel,
div.button-group .btn.cancel:focus,
div.button-group .btn.cancel:active {
  background-color: #aaaaaa;
}

div.button-group .btn.cancel.disabled {
  opacity: 1;
  background-color: #f2f2f2 !important;
  color: #cccccc;
}

div.button-group .btn.cancel.sell {
  background-color: #f2f2f2;
  color: #ccc;
}

div.button-group button.btn.share,
div.button-group button.btn.share:focus,
div.button-group button.btn.share:active {
  background-color: #3eb2c0;
}

div.button-group button.btn.share:focus,
div.button-group button.btn.share:active {
  box-shadow: 0 0 0 2px #3eb2c0aa;
}

div.history-item div.detail-info {
  background-color: #f2f2f2;
  border: 1px solid #e6e6e6;
  border-radius: 10px;
}

div.history-item div.detail-info > div.item {
  border-bottom: 1px dashed #e6e6e6;
}

div.history-item div.detail-info > div.item:last-child {
  border-bottom: unset;
}
</style>
