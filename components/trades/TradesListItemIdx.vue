<template>
  <div v-show="itemShow" class="history-item default-ctn">
    <div :class="`head ${cExpanded ? 'expanded' : ''}`">
      <!-- <div class="tradeNo">{{ tradeNo }}</div> -->
      <div class="folder">{{ folder }}</div>
      <!-- <div class="betGold">{{ betGold.toLocaleString() }}</div> -->
      <div class="totOdds">{{ totOdds }}</div>
      <div class="winGold">{{ winGold.toLocaleString() }}</div>
      <div class="sellPrice">{{ sellPrice.toLocaleString() }}</div>
      <div class="statsTime">
        {{ statsTime === '2' ? '거래취소' : dTimer }}
      </div>
      <div class="hitRate">
        {{ hitRate === '0' ? '-' : hitRate }}
      </div>
      <!-- <div class="writeTime">{{ writeTime }}</div> -->
      <div class="button-group inline-flex">
        <b-btn
          :class="`sale ${fromId === this.$auth.user.mb_name ? 'my' : ''}`"
          @click="onSaleClick"
        >
          <p>구매하기</p>
        </b-btn>
        <i
          v-if="!disabled"
          :class="`icon-svg more ${cExpanded ? 'expanded' : ''}`"
          :aria-expanded="cExpanded ? 'true' : 'false'"
          :aria-controls="`accodion-${id}`"
          @click="onExpandedClick"
        ></i>
      </div>
    </div>
    <b-collapse :id="`accodion-${id}`" v-model="cExpanded">
      <div class="card detail-info">
        <template v-if="loading">
          <div class="spinner hitgame"></div>
        </template>
        <template v-else>
          <history-detail-item
            v-for="(game, index) in sortedGames"
            :key="`${game.id}_trades_idx_${id}_${index}`"
            :sport-id="game.SportId"
            :tournament-id="game.TournamentId"
            :match-status="game.MatchStatusCode"
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
            :selected="game.Prediction"
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
    tradeNo: { type: String, default: '0' },
    folder: { type: String, default: '0' },
    betGold: { type: Number, default: 0 },
    totOdds: { type: String, default: '0' },
    winGold: { type: Number, default: 0 },
    sellPrice: { type: Number, default: 0 },
    statsTime: { type: String, default: '0' },
    lastTime: { type: String, default: '0' },
    hitRate: { type: String, default: '0' },
    writeTime: { type: String, default: '0' },
    expected: { type: Number, default: 0 },
    games: { type: Array, default: () => [] },
    expanded: { type: Boolean, default: false },
    disabled: { type: Boolean, default: false },
    selectable: { type: Boolean, default: false },
    isCanceled: { type: Boolean, default: false },
    selected: { type: Boolean, default: false },
    noButtons: { type: Boolean, default: false },
    fromId: { type: String, default: '' },
    loading: { type: Boolean, default: false },
  },
  data() {
    return {
      cExpanded: false,
      dTimer: '',
      itemShow: true,
    };
  },
  computed: {
    ...gameTypeGetters(['getGameType']),
    // 중복제거
    sortedGames() {
      const uniques = [];
      const itemsFound = {};
      for (let i = 0, l = this.games.length; i < l; i++) {
        const stringified = JSON.stringify(this.games[i]);
        if (itemsFound[stringified]) {
          continue;
        }
        uniques.push(this.games[i]);
        itemsFound[stringified] = true;
      }
      return uniques;
    },
  },
  mounted() {
    if (this.statsTime !== '2' && this.statsTime !== '3') {
      this.getTimer();
    }
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
    onSaleClick() {
      if (this.fromId !== this.$auth.user.mb_name) this.$emit('buy');
    },
    getTimer() {
      const getCurrentTime = this.$moment();
      const targetTime = this.$moment(this.lastTime);
      const getCurrentTimeUnix = getCurrentTime.unix();
      const targetTimeUnix = targetTime.unix();
      const leftTime = targetTimeUnix - getCurrentTimeUnix;
      let duration = this.$moment.duration(leftTime, 'seconds');
      const interval = 1000;
      const intv = setInterval(() => {
        if (duration.asSeconds() <= 1 || getCurrentTimeUnix >= targetTimeUnix) {
          console.log('타이머 종료');
          this.itemShow = false;
          clearInterval(intv);
        } else {
          duration = this.$moment.duration(duration.asSeconds() - 1, 'seconds');
          const timer = {
            days: duration.days(),
            hours: duration.hours(),
            minutes: duration.minutes(),
            seconds: duration.seconds(),
          };
          let dayTimes = 0;
          if (timer.days) {
            dayTimes = timer.days * 24 * 60;
          }
          this.dTimer =
            dayTimes +
            timer.hours * 60 +
            timer.minutes +
            '분 ' +
            timer.seconds +
            '초';
        }
      }, interval);
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
  display: flex;
  justify-content: center;
  align-items: center;
  border-bottom: 1px solid #e6e6e6;
  text-align: center;
  font-weight: 600;
}

div.history-item .head > .tradeNo {
  width: 125px;
}
div.history-item .head > .folder {
  width: 125px;
}
div.history-item .head > .betGold {
  width: 125px;
}
div.history-item .head > .totOdds {
  width: 125px;
}
div.history-item .head > .winGold {
  width: 125px;
}
div.history-item .head > .sellPrice {
  width: 125px;
}
div.history-item .head > .statsTime {
  width: 125px;
}
div.history-item .head > .hitRate {
  width: 125px;
}
div.history-item .head > .writeTime {
  width: 125px;
}

div.history-item .head > .button-group {
  width: 129px;
}

div.history-item .head.expanded {
  border-bottom: unset;
  height: 59px; /*더보기버튼 클릭시 꿀렁이는 폰트 부여잡기용*/
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
  letter-spacing: 4px;
  text-indent: 2px;
  background-color: #557097;
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
  height: 30px;
  border-radius: 5px;
  font-size: 12px;
  border: unset;
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

div.button-group button.btn.sale,
div.button-group button.btn.sale:focus,
div.button-group button.btn.sale:active {
  background-color: #3eb2c0;
}

div.button-group button.btn.sale:focus,
div.button-group button.btn.sale:active {
  box-shadow: 0 0 0 2px #3eb2c0aa;
}
div.button-group button.btn.sale.my {
  background-color: #ccc;
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
