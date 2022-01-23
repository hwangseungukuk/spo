<template>
  <div class="match-item-container">
    <b-row class="match-item">
      <b-col v-if="isSpecial" class="status flex">
        <p>{{ status }}</p>
      </b-col>
      <b-col class="info">
        <div class="team-name">
          <p>{{ homeName }}</p>
          <span>VS</span>
          <p>{{ awayName }}</p>
        </div>
        <p class="date">
          {{ $moment(matchDate).format('YYYY. MM. DD HH:mm') }}
        </p>
      </b-col>
      <b-col class="games">
        <!-- Won / Draw / Lose -->
        <template v-for="(betting, index) in ways">
          <betting-item-button-group
            :id="betting.id"
            :key="`betting-item-buttons_${betting.SRSMarketId}_${index}`"
            :market-id="betting.SRSMarketId"
            :type="betting.SRSMarketType"
            left-label="홈 승"
            center-label="무"
            right-label="홈 패"
            :left-rate="betting.Odd_L"
            :center-rate="betting.Odd_C"
            :right-rate="betting.Odd_R"
            :left-status="betting.Odd_L_CDir"
            :center-status="betting.Odd_C_CDir"
            :right-status="betting.Odd_R_CDir"
            :outcome-l="betting.Outcome_L"
            :outcome-c="betting.Outcome_C"
            :outcome-r="betting.Outcome_R"
            :selected="isSelected(betting)"
            @click="onButtonClick"
          >
            <template v-if="!isSpecial && index === 0">
              <i class="icon-svg analysis" @click="openMatchInfo()"></i>
              <i class="icon-svg sms" @click="openAnalysisUrl()"></i>
              <i class="icon-svg tracker" @click="openBroadCast()"></i>
            </template>
          </betting-item-button-group>
        </template>
        <!-- Handicap Match -->
        <template v-if="handicaps.length > 0">
          <betting-item-button-group
            :id="handicaps[0].id"
            :market-id="handicaps[0].SRSMarketId"
            :type="handicaps[0].SRSMarketType"
            left-label="홈 승"
            center-label="무"
            right-label="홈 패"
            :left-rate="handicaps[0].Odd_L"
            :center-rate="handicaps[0].Odd_C"
            :right-rate="handicaps[0].Odd_R"
            :left-status="handicaps[0].Odd_L_CDir"
            :center-status="handicaps[0].Odd_C_CDir"
            :right-status="handicaps[0].Odd_R_CDir"
            :outcome-l="handicaps[0].Outcome_L"
            :outcome-c="handicaps[0].Outcome_C"
            :outcome-r="handicaps[0].Outcome_R"
            :allotted="handicaps[0].AllottedValue"
            :selected="isSelected(handicaps[0])"
            @click="onButtonClick"
          >
            <template v-if="handicaps.length > 1">
              <i
                v-b-toggle="`tg-hdcp-${handicaps[0].id}`"
                class="icon-svg more"
              ></i>
              <span style="color: #888888">
                {{ `+ ${handicaps.length - 1}` }}
              </span>
            </template>
          </betting-item-button-group>
          <b-collapse :id="`tg-hdcp-${handicaps[0].id}`">
            <template v-for="(betting, index) in handicaps.slice(1)">
              <betting-item-button-group
                :id="betting.id"
                :key="`betting-item-buttons_${betting.SRSMarketId}_${index}`"
                :market-id="betting.SRSMarketId"
                :type="betting.SRSMarketType"
                left-label="홈 승"
                right-label="홈 패"
                :left-rate="betting.Odd_L"
                :center-rate="betting.Odd_C"
                :right-rate="betting.Odd_R"
                :left-status="betting.Odd_L_CDir"
                :center-status="betting.Odd_C_CDir"
                :right-status="betting.Odd_R_CDir"
                :outcome-l="betting.Outcome_L"
                :outcome-c="betting.Outcome_C"
                :outcome-r="betting.Outcome_R"
                :allotted="betting.AllottedValue"
                :selected="isSelected(betting)"
                @click="onButtonClick"
              ></betting-item-button-group>
            </template>
          </b-collapse>
        </template>
        <!-- Under / Over -->
        <template v-if="totals.length > 0">
          <betting-item-button-group
            :id="totals[0].id"
            :market-id="totals[0].SRSMarketId"
            :type="totals[0].SRSMarketType"
            left-label="언더"
            right-label="오버"
            :left-rate="totals[0].Odd_L"
            :center-rate="totals[0].Odd_C"
            :right-rate="totals[0].Odd_R"
            :left-status="totals[0].Odd_L_CDir"
            :center-status="totals[0].Odd_C_CDir"
            :right-status="totals[0].Odd_R_CDir"
            :outcome-l="totals[0].Outcome_L"
            :outcome-c="totals[0].Outcome_C"
            :outcome-r="totals[0].Outcome_R"
            :allotted="totals[0].AllottedValue"
            :selected="isSelected(totals[0])"
            @click="onButtonClick"
          >
            <template v-if="totals.length > 1">
              <i
                v-b-toggle="`tg-ttls-${totals[0].id}`"
                class="icon-svg more"
              ></i>
              <span style="color: #888888">
                {{ `+ ${totals.length - 1}` }}
              </span>
            </template>
          </betting-item-button-group>
          <b-collapse :id="`tg-ttls-${totals[0].id}`">
            <template v-for="(betting, index) in totals.slice(1)">
              <betting-item-button-group
                :id="betting.id"
                :key="`betting-item-buttons_${betting.SRSMarketId}_${index}`"
                :market-id="betting.SRSMarketId"
                :type="betting.SRSMarketType"
                left-label="언더"
                right-label="오버"
                :left-rate="betting.Odd_L"
                :right-rate="betting.Odd_R"
                :left-status="betting.Odd_L_CDir"
                :right-status="betting.Odd_R_CDir"
                :outcome-l="betting.Outcome_L"
                :outcome-c="betting.Outcome_C"
                :outcome-r="betting.Outcome_R"
                :allotted="betting.AllottedValue"
                :selected="isSelected(betting)"
                @click="onButtonClick"
              ></betting-item-button-group>
            </template>
          </b-collapse>
        </template>
      </b-col>
    </b-row>
    <div
      :class="`game-closed ${isCanceled ? '' : isClosed ? '' : 'hide'}`"
      @click="(e) => e.stopPropagation()"
    >
      <p>
        {{ isCanceled ? '경기가 취소 되었습니다.' : '베팅이 마감되었습니다.' }}
      </p>
    </div>
  </div>
</template>

<script>
import BettingItemButtonGroup from '~/components/hitgame/bettings/BettingItemButtonGroup';

export default {
  components: {
    BettingItemButtonGroup,
  },
  props: {
    id: { type: Number, default: 0 },
    sportId: { type: Number, default: 0 },
    bMatchId: { type: Number, default: 0 },
    status: { type: String, default: 'status' },
    isSpecial: { type: Boolean, default: false },
    homeName: { type: String, default: 'Home team' },
    awayName: { type: String, default: 'Away name' },
    matchDate: { type: Date, default: new Date() },
    crossBetting: { type: Boolean, default: false },
    ways: { type: Array, default: () => [] },
    totals: { type: Array, default: () => [] },
    handicaps: { type: Array, default: () => [] },
    isClosed: { type: Boolean, default: false },
    isCanceled: { type: Boolean, default: false },
    waySize: { type: Number, default: 0 },
    handicapSize: { type: Number, default: 0 },
    totalSize: { type: Number, default: 0 },
  },
  data() {
    return {
      selectItems: [],
    };
  },
  computed: {
    isSelected() {
      return ({ AllottedValue, SRSMarketType }) => {
        const found = this.selectItems.find((item) => {
          return (
            item.Allotted === AllottedValue && item.MarketType === SRSMarketType
          );
        });
        if (found) {
          return found.OutcomeId;
        } else {
          return null;
        }
      };
    },
  },
  watch: {
    selectItems(v) {
      // if (v.length <= 0) {
      //   return;
      // }
      this.$emit('change', v);
    },
  },
  mounted() {
    this.$nuxt.$on('clearBetCart', this.onClearBetCart);
    this.$nuxt.$on('removeBetCartItem', this.onRemoveBetCartItem);
  },
  beforeDestroy() {
    this.$nuxt.$off('clearBetCart');
    this.$nuxt.$off('removeBetCartItem');
  },
  methods: {
    openMatchInfo() {
      const options =
        'top=100, left=100, width=710, height=655, status=no, menubar=no, toolbar=no, resizable=no, scrollbars=no';
      const url = `https://s5.sir.sportradar.com/spolive/ko/match/${this.bMatchId}`;
      window.open(url, 'spolive_match_info', options);
    },
    openAnalysisUrl() {
      // const options =
      //   'top=100, left=100, width=710, height=655, status=no, menubar=no, toolbar=no, resizable=no, scrollbars=no';
      // const url = `https://stats.betradar.com/s4/?clientid=1771&matchid=${this.bMatchId}&language=ko&timezone=Asia/Tokyo`;
      // window.open(url, 'spolive_analysis', options);
      this.showSingleButtonModal({
        message: '준비 중입니다.',
        description: null,
      });
    },
    openBroadCast() {
      const options =
        'top=100, left=100, width=710, height=655, status=no, menubar=no, toolbar=no, resizable=no, scrollbars=no';
      const url = `${process.env.SRS_URL}/Match/${this.id}/broadcast`;
      window.open(url, 'spolive_broadcast', options);
    },
    onClearBetCart() {
      this.selectItems = [];
    },
    onRemoveBetCartItem(v) {
      this.removeItem(v);
    },
    removeItem(v) {
      if (this.selectItems.length <= 0) {
        return;
      }
      const { id, MarketType, OutcomeId } = v;
      if (id) {
        this.selectItems = this.selectItems.filter(
          (item) =>
            !(
              this.id === id &&
              item.MarketType === MarketType &&
              item.OutcomeId === OutcomeId
            )
        );
      } else {
        this.selectItems = this.selectItems.filter(
          (item) =>
            !(item.MarketType === MarketType && item.OutcomeId === OutcomeId)
        );
      }
      // this.$nuxt.$emit('removeBetItem', { ...v, id: this.id });
    },
    onButtonClick(v) {
      const { crossBetting, homeName, awayName, id, sportId, matchDate } = this;
      const { MarketType, outcome, selected } = v;
      if (selected) {
        this.removeItem(v);
        this.$nuxt.$emit('removeBetItem', { ...v, id: this.id });
        return;
      }
      if (crossBetting) {
        if (MarketType.includes('totals')) {
          this.selectItems = [
            ...this.selectItems.filter(
              (select) => !select.MarketType.includes('total')
            ),
            {
              ...v,
              homeName,
              awayName,
              id,
              SportId: sportId,
              crossBetting,
              MatchDate: matchDate,
            },
          ];
        } else {
          this.selectItems = [
            ...this.selectItems.filter(
              (select) =>
                !(
                  select.MarketType.includes('way') ||
                  select.MarketType.includes('handicap')
                )
            ),
            {
              ...v,
              homeName,
              awayName,
              id,
              SportId: sportId,
              crossBetting,
              MatchDate: matchDate,
            },
          ];
        }
      } else {
        this.selectItems = [
          {
            ...v,
            homeName,
            awayName,
            id,
            SportId: sportId,
            crossBetting,
            MatchDate: matchDate,
          },
        ];
      }
    },
  },
};
</script>

<style scoped>
div.match-item-container {
  position: relative;
}

div.game-closed {
  background-color: rgba(0, 0, 0, 0.5);
  color: white;
  font-size: 16px;
  font-weight: 800;
  display: flex;
  align-items: center;
  justify-content: center;
  position: absolute;
  top: 0;
  right: 0;
  left: 0;
  bottom: 0;
}

div.game-closed.hide {
  visibility: hidden;
}

div.game-closed p {
  margin-bottom: 0;
}

div.match-item {
  display: flex;
  padding: 10px;
}

div.match-item div.status {
  max-width: 90px;
  align-items: center;
}

div.match-item div.status p {
  width: 70px;
  height: 30px;
  text-align: center;
  font-size: 12px;
  padding: 6px 10px;
  background-color: #f2f2f2;
  color: #999999;
  border-radius: 5px;
  border: 1px solid #e6e6e6;
}

div.row > div.info[class*='col'] {
  flex: 1;
  max-width: 280px;
  padding: 5px 20px 0 8px;
}

div.info > div {
  display: inline-block;
}

div.info > div.team-name > * {
  display: initial;
  font-size: 14px;
  font-weight: 800;
}

div.info > div.team-name > p {
  display: inherit !important; /* 택스트문제 */
  margin-bottom: 0;
}

div.info > div.team-name > span {
  color: #3eb2c0;
  margin: 0 4px;
  display: inherit !important; /* 택스트문제 */
}

div.info p.date {
  color: #444;
}

p {
  margin-bottom: 4px;
}

div.games {
  flex: 1;
  max-width: 625px;
  font-size: 12px;
}

i.icon-svg.analysis,
i.icon-svg.sms,
i.icon-svg.tracker,
i.icon-svg.more {
  width: 20px;
  height: 20px;
  background-color: #3eb2c0;
  margin-bottom: -5px;
  transition: all 0.3s;
}

i.icon-svg {
  margin-right: 12px;
}

i.icon-svg:hover {
  cursor: pointer;
}

i.icon-svg.analysis {
  margin-left: 5px;
}

i.icon-svg:last-child {
  margin-right: 0;
}

i.icon-svg.more {
  margin-right: 5px;
}

i.icon-svg.more.collapsed {
  margin-left: 5px;
  margin-bottom: -6px;
  background-image: url(~assets/icons/bettings/betting-more.svg);
  -webkit-mask-image: unset;
  mask-image: unset;
  background-color: transparent;
}

i.icon-svg.more.not-collapsed {
  margin-left: 5px;
  margin-bottom: -6px;
  background-image: url(~assets/icons/bettings/betting-more-expanded.svg);
  -webkit-mask-image: unset;
  mask-image: unset;
  background-color: transparent;
}

i.icon-svg.more.collapsed:focus,
i.icon-svg.more.not-collapsed:focus {
  outline: unset;
}
</style>
