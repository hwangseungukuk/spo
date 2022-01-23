<template>
  <div class="history-detail-item item inline-flex">
    <div class="team-date">
      <p class="league inline-flex">
        <i :class="`icon-svg ${getSportValue(sportId)}`"></i>
        {{ getSportLeagueName(tournamentId) }}
      </p>
      <div class="team-name">
        <p>{{ homeName }}</p>
        <p class="versus">VS</p>
        <p>{{ awayName }}</p>
      </div>
      <p class="date">
        <span
          v-if="specialMarketType && specialMarketType !== null"
          style="color: #3eb2c0; font-weight: 800"
        >
          [{{ specialMarketType }}]
        </span>
        {{ $moment(date).format('YYYY-MM-DD HH:mm') }}
      </p>
    </div>
    <template v-if="drawType.toUpperCase() === 'LIVE'">
      <div class="type live inline-flex">
        <div class="default-ctn">
          <p>베팅타입</p>
          <p class="type">
            <span>{{ gameType }}</span>
          </p>
        </div>
      </div>
    </template>
    <template v-else>
      <div class="status-score inline-flex">
        <div class="default-ctn">
          <p class="status">
            {{ mMatchStatus.text }}
          </p>
          <p class="score">
            {{
              `${homeScore >= 0 ? homeScore : '-'} : ${
                awayScore >= 0 ? awayScore : '-'
              }`
            }}
          </p>
        </div>
      </div>
      <div class="type inline-flex">
        <div class="default-ctn">
          <p>베팅타입</p>
          <p class="type">
            <span>{{ gameType }}</span>
            {{ getAllotted }}
          </p>
        </div>
      </div>
    </template>
    <div class="result inline-flex">
      <div>
        <p :class="`result ${isCanceled ? 'canceled' : getGameResult}`">
          {{ isCanceled ? '베팅취소' : getGameResultText }}
        </p>
        <div class="flex">
          <template v-if="drawType.toUpperCase() === 'LIVE'">
            <div
              :class="`inline-flex live ${getGameResult} ${
                selected === outcomeL ? 'selected' : ''
              } ${current === outcomeL ? 'current' : ''}`"
            >
              <p>{{ outcomeLive }}</p>
              <div class="spacer"></div>
              <i class="icon-svg exclamation"></i>
              <div class="spacer"></div>
              <p>{{ liveRate }}</p>
            </div>
          </template>
          <template v-else>
            <div
              :class="`inline-flex left ${getGameResult} ${
                selected === outcomeL ? 'selected' : ''
              } ${current === outcomeL ? 'current' : ''}`"
            >
              <p>{{ getLeftText }}</p>
              <div class="spacer"></div>
              <i class="icon-svg exclamation"></i>
              <div class="spacer"></div>
              <p>{{ leftRate.toLocaleString() }}</p>
            </div>
            <div
              :class="`inline-flex center ${
                centerRate === null ? 'hide' : ''
              } ${getGameResult} ${selected === outcomeC ? 'selected' : ''} ${
                current === outcomeC ? 'current' : ''
              }`"
            >
              <p>{{ getCenterText }}</p>
              <div class="spacer"></div>
              <i class="icon-svg exclamation"></i>
              <div class="spacer"></div>
              <p>
                {{ centerRate === null ? null : centerRate.toLocaleString() }}
              </p>
            </div>
            <div
              :class="`inline-flex right ${getGameResult} ${
                selected === outcomeR ? 'selected' : ''
              } ${current === outcomeR ? 'current' : ''}`"
            >
              <p>{{ getRightText }}</p>
              <div class="spacer"></div>
              <i class="icon-svg exclamation"></i>
              <div class="spacer"></div>
              <p>{{ rightRate.toLocaleString() }}</p>
            </div>
          </template>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { createNamespacedHelpers } from 'vuex';

const { mapGetters: gameStatusGetters } = createNamespacedHelpers(
  'mapper/game-status'
);

const { mapGetters: bettingStatTypeGetters } = createNamespacedHelpers(
  'mapper/betting-stat-type'
);

export default {
  props: {
    sportId: { type: Number, default: 0 },
    tournamentId: { type: Number, default: 0 },
    homeName: { type: String, default: 'home name' },
    awayName: { type: String, default: 'away name' },
    homeScore: { type: Number, default: 0 },
    awayScore: { type: Number, default: 0 },
    date: { type: Date, default: () => new Date() },
    matchStatus: { type: Number, default: 0 },
    status: { type: String, default: 'await' },
    drawType: { type: String, default: 'draw type' },
    gameType: { type: String, default: 'game type' },
    gameTypeCode: { type: String, default: 'game type' },
    alloted: { type: Number, default: 0 },
    specialMarketType: { type: String, default: null },
    leftRate: { type: Number, default: 0 },
    centerRate: { type: Number, default: 0 },
    rightRate: { type: Number, default: 0 },
    liveRate: { type: String, default: '0' },
    marketStatus: { type: String, default: undefined },
    outcomeL: { type: String, default: '1' },
    outcomeC: { type: String, default: 'X' },
    outcomeR: { type: String, default: '2' },
    outcomeLive: { type: String, default: 'outcome' },
    selected: { type: String, default: '1' },
    current: { type: String, default: '' },
    isCanceled: { type: Boolean, default: false },
    isLiveGame: { type: Boolean, default: false },
  },
  data() {
    return {
      mStatus: null,
      mMatchStatus: null,
      mResult: null,
    };
  },
  computed: {
    ...gameStatusGetters({
      getGameStatus: 'getStatus',
    }),
    ...bettingStatTypeGetters({
      getBettingStatus: 'getStatus',
    }),
    isMatched() {
      const { current, selected } = this;
      return current === selected;
    },
    showExclamation() {
      const { status } = this;
      return status === 'special' || status === 'refunding';
    },
    getGameResultText() {
      const { status, marketStatus, mStatus, isMatched } = this;
      if (marketStatus === 'canceled') {
        return '적중특례';
      }
      if (status !== 'done') {
        return mStatus.text;
      }
      return isMatched ? '적중성공' : '적중실패';
    },
    getGameResult() {
      const { status, marketStatus, isMatched } = this;
      if (marketStatus === 'canceled') {
        return 'special';
      }
      if (status !== 'done') {
        return status;
      }
      return isMatched ? 'succeeded' : 'failed';
    },
    getAllotted() {
      const { gameTypeCode, alloted } = this;
      if (alloted === null) {
        return '';
      }
      if (gameTypeCode !== 'handicap') {
        return ` (${alloted})`;
      }
      if (alloted >= 0) {
        return ` (H+${alloted})`;
      } else {
        return ` (H${alloted})`;
      }
    },
    getLeftText() {
      return this.gameTypeCode === 'totals' ? '언더' : '홈 승';
    },
    getCenterText() {
      return this.gameTypeCode === 'totals' ? null : '무';
    },
    getRightText() {
      return this.gameTypeCode === 'totals' ? '오버' : '홈 패';
    },
  },
  watch: {
    result(v) {
      this.mResult = this.getBettingStatus(v);
    },
  },
  beforeMount() {
    this.mMatchStatus = this.getGameStatus(this.matchStatus);
    this.mStatus = this.getBettingStatus(this.status);
  },
};
</script>

<style scoped>
div.history-detail-item {
  min-height: 105px;
  padding: 10px;
  border-radius: 10px;
}
div.history-detail-item .default-ctn {
  border-radius: 5px;
  font-weight: 700;
}

div.history-detail-item .type.inline-flex {
  flex-basis: 113px;
}

div.item div.team-date {
  width: 225px;
  padding: 5px;
  margin-right: 2px;
}

div.modal-container div.item div.team-date {
  width: 220px;
}

p {
  margin-bottom: 5px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

p.league {
  width: 200px;
  font-size: 14px;
  font-weight: 800;
  color: #3eb2c0;
  align-items: center;
}

p.league > i.icon-svg {
  margin-right: 5px;
  width: 20px;
  height: 20px;
  background-color: #3eb2c0;
}

div.team-name,
div.team-name > * {
  display: inline-block;
}

div.team-name {
  font-size: 14px;
  color: #444444;
  font-weight: 800;
  line-height: 1;
}

div.team-name p {
  width: fit-content;
  max-width: 200px;
  margin-bottom: 0;
}

div.team-name p.versus {
  margin: 0 5px;
}

p.date {
  font-size: 12px;
  color: #aaaaaa;
  margin: 0;
}

div.status-score,
div.type {
  align-items: center;
  justify-content: center;
  padding-left: 0;
  padding-right: 10px;
}

div.status-score > div,
div.type > div {
  height: 65px;
  border: 1px solid #e6e6e6;
  text-align: center;
  font-size: 12px;
  font-weight: 400;
  padding: 12px 0 0;
}

div.status-score > div {
  width: 80px;
}

div.type > div {
  width: 110px;
}

div.type.live > div {
  width: 200px;
}

div.type p.type {
  color: #888888;
  font-weight: 400;
  margin-bottom: 0;
}

div.type p.type > span {
  font-weight: 800;
}

div.status-score .score,
div.type p.type > span {
  color: #3eb2c0;
  margin: 0;
}

div.result.inline-flex {
  align-items: center;
  justify-content: center;
  padding-left: 0;
  flex: 1;
}

div.modal-container div.result.inline-flex {
  width: 395px;
}

div.result > div {
  width: 100%;
}

div.result p.result {
  width: 415px;
  height: 30px;
  padding: 7px 10px;
  color: white;
  text-align: center;
  background-color: #999999;
  font-weight: 800;
  border-radius: 5px;
}

div.result p.result.await,
div.result p.result.opened {
  background-color: #557097;
}

div.result p.result.special {
  background-color: #719ebd;
}

div.result p.result.canceled {
  background-color: #cccccc;
}

div.result p.result.sell,
div.result p.result.failed {
  background-color: #999999;
}
div.result p.result.succeeded {
  background: linear-gradient(90deg, #5da9d6 0%, #70d0c9 100%);
}

div.result div.flex > div:not([class*='spacer']) {
  width: 135px;
  height: 30px;
  text-align: center;
  background-color: white;
  color: #444444;
  border-radius: 5px;
  border: 1px solid #e6e6e6;
  padding: 2px 10px 0;
  font-size: 12px;
  align-items: center;
  margin-right: 5px;
}

div.result div.flex > div.live {
  width: calc(100% - 5px);
}

div.modal-container div.result div.flex > div:not([class*='spacer']) {
  width: 129px;
}

div.result div.flex > div.spacer {
  max-width: 5px;
}

div.result div.flex > div:not([class*='spacer']) > p {
  margin-bottom: 0;
  font-weight: 700;
}

div.result div.flex div.failed.current,
div.result div.flex div.refunding.current,
div.result div.flex div.special.current {
  border: 2px solid #3eb2c0;
}

div.result div.flex div.opened.selected,
div.result div.flex div.refunding.selected,
div.result div.flex div.await.selected,
div.result div.flex div.special.selected {
  background-color: #d8f0f2;
  border: unset;
}

div.result div.flex div.failed.selected {
  background-color: #d8f0f2;
  /* color: white; */
  border: unset;
}

div.result div.flex div.succeeded.selected {
  background-color: #3eb2c0;
  color: white;
}

div.result div.flex div:not(.refunding, .special).selected.current {
  background-color: #3eb2c0;
  color: white;
}

div.result div.flex div.selected.current > p {
  font-weight: 800;
}

div.result div.flex div i.icon-svg {
  display: none;
}

div.result div.flex div.special.selected i.icon-svg,
div.result div.flex div.refunding.selected i.icon-svg {
  display: inline-block;
}

div.result div.flex .inline-flex:last-child {
  margin-right: 0;
}

div.result .center.hide {
  opacity: 0;
}

.icon-svg.exclamation {
  background-color: #3eb2c0;
  width: 20px;
  height: 20px;
}
</style>
