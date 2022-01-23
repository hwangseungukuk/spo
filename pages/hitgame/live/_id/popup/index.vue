<template>
  <div class="game-container">
    <template v-if="connecting">
      <div class="spinner"></div>
    </template>
    <template v-if="connected">
      <template v-if="gameInfo !== null">
        <betting-league-container
          :sport="gameInfo.SportId"
          :league="getSportLeagueName(gameInfo.TournamentId)"
        ></betting-league-container>
        <div class="live-game-contents default-ctn">
          <live-game-item-header
            :id="gameInfo.MatchId"
            :status="gameInfo.MatchStatusCode"
            :date="gameInfo.MatchDate"
            :remaining-time="getRemainingTime(gameInfo.event_status)"
            :home-team="
              getTeamName(gameInfo.HomeTeam_UniqueId, gameInfo.HomeTeam)
            "
            :home-score="getHomeScore(gameInfo.event_status)"
            :away-team="
              getTeamName(gameInfo.AwayTeam_UniqueId, gameInfo.AwayTeam)
            "
            :away-score="getAwayScore(gameInfo.event_status)"
            :away-set-score="getAwaySetScore(gameInfo.event_status)"
            :set-score="getSportByCode(parseInt(gameInfo.SportId)).setscore"
            :serve="getEventStatusServer(gameInfo.event_status)"
            @analysis="onAnalysisClick"
          ></live-game-item-header>
          <div v-show="isShowMatchTracker" class="match-tracker-area"></div>
          <div class="game-type-filter flex">
            <button-tabs
              :items="COL_TYPE"
              :value="selectedColType"
              @change="onColTypeChange"
            ></button-tabs>
            <select
              v-model.number="selectedMarketId"
              :class="`selectbox ${
                selectedMarketId !== null ? 'selected' : ''
              }`"
              @change="onMarketIdChange"
            >
              <option :value="null">베팅타입 선택</option>
              <template v-for="(game, infoIndex) in gameTypeList">
                <option
                  :key="`game-${MatchId}-${game.MarketId}-${infoIndex}`"
                  :value="
                    JSON.stringify({
                      MarketId: game.MarketId,
                      SpecifiersOrigin: game.SpecifiersOrigin,
                    })
                  "
                >
                  {{ game.MarketIdName }}
                </option>
              </template>
            </select>
          </div>
          <div
            :class="`game-list ${isShowMatchTracker ? '' : 'no-match-tracker'}`"
          >
            <template v-if="loadingDetail">
              <div class="spinner white"></div>
            </template>
            <template v-else>
              <template v-if="hasGameContents">
                <live-game-type-group
                  v-for="(content, mIndex) in contentList"
                  :key="`game-type-all-${MatchId}-${content.id}-${mIndex}`"
                  :label="
                    getMarketTypeLabel(
                      gameInfo.SportId,
                      content.id,
                      content.specifiers
                    )
                  "
                  :type="content.ColType"
                >
                  <div
                    :class="`button-row ${
                      content.outcome.length > 3 ? 'non-flex' : 'flex'
                    }`"
                  >
                    <live-game-button
                      v-for="(outcome, index) in content.outcome"
                      :id="outcome.id"
                      :key="`live-game-bet-${MatchId}-${outcome.id}-${index}`"
                      :active="content.status === 1 && outcome.active === 1"
                      :label="
                        decorateOutcome(
                          gameInfo.SportId,
                          content.id,
                          outcome,
                          content.specifiers
                        )
                      "
                      :rate="outcome.odds"
                      :arrow="outcome.arrow"
                      :style="content.outcome.length > 3 ? 'width: 335px' : ''"
                      :selected="
                        getSelectedBetItems.includes(
                          `${MatchId}/${content.id}/${outcome.id}/${content.specifiersOrigin}/${outcome.odds}`
                        )
                      "
                      @click="
                        (v) =>
                          onBettingItemClick({
                            ...v,
                            MatchId,
                            MarketId: content.id,
                            MarketIdName: getMarketTypeLabel(
                              gameInfo.SportId,
                              content.id,
                              content.specifiers
                            ),
                            MatchInfo: `
                                ${getTeamName(
                                  gameInfo.HomeTeam_UniqueId,
                                  gameInfo.HomeTeam
                                )} VS
                                ${getTeamName(
                                  gameInfo.AwayTeam_UniqueId,
                                  gameInfo.AwayTeam
                                )}
                              `,
                            Specifiers: content.specifiersOrigin,
                          })
                      "
                    ></live-game-button>
                  </div>
                </live-game-type-group>
              </template>
              <template v-else>
                <div class="no-has-items default-ctn flex">
                  <p>현재 선택 가능한 항목이 없습니다.</p>
                </div>
              </template>
            </template>
          </div>
        </div>
      </template>
      <bet-control
        :opened="opened"
        :request-betting="requestBetting"
        :rate="bettingCalcRate"
        :my-gold="$auth.loggedIn ? $auth.user.spoGold : 0"
        @betting="onBettingClick"
        @toggle="onToggleBetControl"
      >
        <template #slot>
          <template v-if="getSelectedBetItems <= 0">
            <div class="no-betting-items default-ctn">
              <p>선택된 항목이 없습니다.</p>
              <p>항목을 선택해 주세요.</p>
            </div>
          </template>
          <template v-else>
            <template v-for="(item, index) in _bettingCartItems">
              <betting-cart-item
                :id="item.MatchId"
                :key="generateKey(item, index)"
                :game="item.game"
                :type-name="item.MarketIdName"
                :type="item.MarketType"
                :allotted="item.AllottedValue"
                :outcome-id="item.OutcomeId"
                :outcome="item.OutcomeIdName"
                :detail="item.MatchInfo"
                :rate="item.Rate"
                :arrow="item.Arrow"
                :active="item.Active"
                @remove="onRemoveClick"
              ></betting-cart-item>
            </template>
          </template>
        </template>
      </bet-control>
    </template>
  </div>
</template>

<script>
import { createNamespacedHelpers } from 'vuex';

import liveGameDetailMixin from '~/mixins/hitgame/live/detail';
import liveGameMixin from '~/mixins/hitgame/live';

import ButtonTabs from '~/components/common/ButtonTabs';
import BettingLeagueContainer from '~/components/hitgame/bettings/BettingLeagueContainer';

import BettingCartItem from '~/components/sidebar/betting/BettingCartItem';

import LiveGameItemHeader from '~/components/hitgame/live/LiveGameItemHeader';
import LiveGameTypeGroup from '~/components/hitgame/live/detail/LiveGameTypeGroup';

import LiveGameButton from '~/components/hitgame/BettingGameButton';

import BetControl from '~/components/hitgame/live/popup/BetControl';

const CODE_BETTING_DAY_SPENT_OVER = 451; // 베팅한도 초과
const CODE_BETTING_LIMITTED_OVER = 461; // 베팅한도 초과
const CODE_BETTING_EXPECTED_GOLDS_OVER = 462; // 예상획득 골드 초과

const {
  mapState: bettingCartState,
  mapGetters: bettingCartGetters,
  mapActions: bettingCartActions,
} = createNamespacedHelpers('gamecenter/betting/cart');

export default {
  layout: 'live-popup',
  components: {
    BetControl,
    ButtonTabs,
    BettingLeagueContainer,
    LiveGameItemHeader,
    LiveGameTypeGroup,
    LiveGameButton,
    BettingCartItem,
  },
  mixins: [liveGameDetailMixin, liveGameMixin],
  data() {
    return {
      MatchId: parseInt(this.$route.params.id),
      opened: false,
    };
  },
  computed: {
    ...bettingCartState({
      betResponseCode: 'code',
      bettingMessage: 'message',
      bettingError: 'error',
      requestBetting: 'requesting',
      _bettingCartItems: 'items',
    }),
    ...bettingCartGetters({
      hasInactiveItems: 'hasInactiveItems',
      bettingCalcRate: 'getRate',
      getSelectedBetItems: 'getSelectedItems',
    }),
    generateKey() {
      return (item, index) => {
        const { game, MatchId, MarketId, OutcomeId } = item;
        return `betting-cart-item_${game}_${MatchId}_${MarketId}_${OutcomeId}_${index}`;
      };
    },
  },
  watch: {
    _bettingCartItems(v) {
      if (v.length > 0) {
        this.opened = true;
      } else {
        this.opened = false;
      }
    },
    betResponseCode(v) {
      if (v === 200 || v < 0) {
        return;
      }

      if (v === CODE_BETTING_DAY_SPENT_OVER) {
        this.showSingleButtonModal({
          message:
            '스포골드 일일 사용량을 초과하여 오늘 더 이상 구입하실 수 없습니다.<br />내일 다시 시도해주세요.',
          onConfirm: () => {
            this.clearBetCart();
          },
        });
        return;
      }

      if (
        v === CODE_BETTING_LIMITTED_OVER ||
        v === CODE_BETTING_EXPECTED_GOLDS_OVER
      ) {
        this.showSingleButtonModal({
          message:
            '축베팅 한도를 초과하여 더 이상 구입 하실 수 없습니다.<br />베팅내역을 확인해 주시기 바랍니다.',
          onConfirm: () => {
            this.clearBetCart();
          },
        });
        return;
      }

      this.showSingleButtonModal({
        message: '선택한 내용으로 베팅을 할 수 없습니다.',
        description:
          '마감된 경기가 포함되거나, 배당률이 변동된 게임이 존재 합니다.',
        onConfirm: () => {
          this.removeAll();
        },
      });
    },
  },
  created() {
    this.$root.setLayout('live-popup');
  },
  mounted() {
    console.log('OVERWRITE');
  },
  methods: {
    ...bettingCartActions({
      betting: 'betting',
      removeAll: 'removeAll',
    }),
    onToggleBetControl() {
      this.opened = !this.opened;
    },
    onAnalysisClick(v) {
      this.openMatchInfo(v);
    },
    onRemoveClick() {
      this.removeAll();
    },
    onBettingClick({ gold, expected, isExpectedOver }) {
      if (this.hasInactiveItems) {
        this.showSingleButtonModal({
          message: '선택한 내용으로 베팅을 할 수 없습니다.',
          description: '현재 카트에 담겨있는 베팅타입이 잠겨있습니다.',
        });
        return;
      }
      if (gold < 10000) {
        if (this.$auth.user.spoGold < 10000) {
          this.showDoubleButtonsModal({
            message:
              '스포골드가 부족하여 배팅을 할 수 없습니다.<br />상점으로 이동하시겠습니까?',
            buttonConfirmText: '이동',
            description: null,
            accent: null,
            onConfirm: () => {
              this.$router.push({ name: 'store' });
            },
          });
        } else {
          this.showSingleButtonModal({
            message: '최소 베팅골드는 10,000 골드 입니다.',
            description: null,
          });
        }
        return;
      }
      if (isExpectedOver) {
        this.showSingleButtonModal({
          message:
            '예상 당첨 골드는 30,000,000,000 골드 이상<br />베팅이 불가능 합니다.',
          description: null,
        });
        return;
      }
      this.betting(gold);
    },
    showNoHasMatchData() {
      this.showSingleButtonModal({
        message: '경기 정보를 가져올 수 없습니다.',
        description: '경기가 종료되거나, 중단되었습니다.',
        onConfirm: () => {
          window.close();
        },
      });
    },
  },
};
</script>

<style scoped>
div.game-container {
  position: relative;
  width: 100%;
  height: 100%;
  min-height: 850px;
}

.spinner {
  margin-top: 420px;
}

.league-container >>> .header {
  border-radius: unset;
}

div.live-game-contents {
  padding: 10px 0 10px 10px;
}

div.live-game-contents .header {
  padding: 10px 0 20px;
  border-bottom: 1px solid #e6e6e6;
  margin-bottom: unset;
  margin-right: 10px;
}

div.match-tracker-area {
  min-height: 320px;
  margin-bottom: 10px;
  margin-right: 10px;
}

.game-type-filter {
  margin-top: 10px;
  margin-bottom: 5px;
  margin-right: 10px;
}

.game-type-filter .button-tabs {
  margin-right: 5px;
  width: unset;
  flex: 1;
}

.game-type-filter .button-tabs >>> .button-group,
.game-type-filter .button-tabs >>> button {
  border-radius: 5px;
}

.game-type-filter .button-tabs >>> button {
  width: 90px;
  height: 30px;
  font-size: 12px;
}

.game-type-filter .selectbox {
  width: 335px;
  height: 30px;
  background-position: 96% center;
  background-color: #f2f2f2;
  color: #aaaaaa;
  border: 1px solid #f2f2f2;
}

.game-type-filter .selectbox.selected {
  width: 335px;
  height: 30px;
  background-position: 96% center;
  background-color: white;
  color: #999999;
  border: 1px solid #d9d9d9;
}

.game-list {
  max-width: 100%;
  max-height: 400px;
  overflow-y: scroll;
}

.game-list.no-match-tracker {
  max-height: 725px;
}

.game-list::-webkit-scrollbar {
  width: 10px;
  margin-left: 4px;
}

.game-type-group:not(:last-child) {
  margin-bottom: 5px;
}

.button-row {
  padding-right: 10px;
  padding-left: 10px;
  padding-bottom: 5px;
  align-items: center;
}

.button-row:first-child {
  padding-top: 10px;
  border-top: 1px dashed #d9d9d9;
}

.button-row:last-child {
  padding-bottom: 10px;
}

.button-row.non-flex .btn {
  margin-bottom: 5px;
}

.button-row.non-flex .btn:nth-child(2n) {
  margin-right: 0;
}

.button-row .btn {
  flex: 1;
}

.button-row .btn:not(:last-child) {
  margin-right: 5px;
}

.button-row .btn.selected {
  border-color: #f2f2f2;
}

.no-has-items {
  border-bottom: unset;
  margin-bottom: unset;
  height: 400px;
}

.betting-cart-item,
.no-betting-items {
  width: auto;
  height: 85px;
  margin-top: 5px;
  margin-bottom: 10px;
}

.betting-cart-item >>> div:first-child {
  text-align: left;
  left: 16px;
}

.betting-cart-item >>> p.rate {
  right: 16px;
}

.no-betting-items {
  width: auto;
  height: 85px;
  padding-top: 25px;
  border: 1px solid #e6e6e6;
  background-color: #f2f2f2;
  font-weight: 700;
  font-size: 12px;
  color: #888888;
}
</style>
