<template>
  <div class="srs-container">
    <sport-leagues-selector
      :current-sport="sport"
      :has-data="hasFilterData"
      @sport="onSportClick"
      @selector="showModal = !showModal"
    ></sport-leagues-selector>
    <selector-modal
      :show="showModal"
      :leagues="filters.leagues"
      :open-leagues="openLeagues"
      :selected-all="filters.selectedAll"
      @confirm="onSelectorConfirmClick"
      @close="showModal = false"
    ></selector-modal>
    <template v-if="gameLoading">
      <div class="spinner grey"></div>
    </template>
    <template v-else>
      <template v-if="gameList.length > 0">
        <betting-league-container
          v-for="(group, index) in gameList"
          :key="`gbd_${group.SportId}_${group.TournamentId}_${index}`"
          :sport="group.SportId"
          :league="getSportLeagueName(group.TournamentId)"
        >
          <betting-item
            v-for="(game, gIndex) in group.games"
            :id="game.id"
            :key="`betting-item-main-${game.id}-${index}-${gIndex}`"
            :sport-id="group.SportId"
            :b-match-id="game.BMatchId"
            :home-name="getTeamName(game.HomeTeam_UniqueId, game.HomeTeam_Name)"
            :away-name="getTeamName(game.AwayTeam_UniqueId, game.AwayTeam_Name)"
            :match-date="game.MatchDate"
            :is-canceled="getGameStatus(game.MatchStatusCode).canceled"
          >
            <template #games>
              <template v-for="(way, wIndex) in game.ways">
                <betting-item-button-group
                  :key="`betting-item-button-group-way-${game.id}-${wIndex}`"
                  :type="getSRSMarketType(way.SRSMarketType).text"
                >
                  <template #bet-items>
                    <betting-game-button
                      :id="way.Outcome_L"
                      :active="true"
                      label="홈 승"
                      :rate="way.Odd_L"
                      :selected="
                        isSelectedBetItem({
                          SRSMarketId: way.SRSMarketId,
                          SRSMarketType: way.SRSMarketType,
                          AllottedValue: way.AllottedValue,
                          OutcomeId: way.Outcome_L,
                        })
                      "
                      @click="
                        (v) => {
                          onBetItemClick(
                            {
                              ...v,
                              SRSMarketId: way.SRSMarketId,
                              SRSMarketType: way.SRSMarketType,
                            },
                            game
                          );
                        }
                      "
                    ></betting-game-button>
                    <template v-if="way.Odd_C !== null">
                      <betting-game-button
                        :id="way.Outcome_C"
                        :active="true"
                        label="무"
                        :rate="way.Odd_C"
                        :selected="
                          isSelectedBetItem({
                            SRSMarketId: way.SRSMarketId,
                            SRSMarketType: way.SRSMarketType,
                            AllottedValue: way.AllottedValue,
                            OutcomeId: way.Outcome_C,
                          })
                        "
                        @click="
                          (v) => {
                            onBetItemClick(
                              {
                                ...v,
                                SRSMarketId: way.SRSMarketId,
                                SRSMarketType: way.SRSMarketType,
                              },
                              game
                            );
                          }
                        "
                      ></betting-game-button>
                    </template>
                    <template v-else>
                      <div
                        style="
                          width: 150px;
                          margin-right: 5px;
                          display: inline-block;
                        "
                      ></div>
                    </template>
                    <betting-game-button
                      :id="way.Outcome_R"
                      :active="true"
                      label="홈 패"
                      :rate="way.Odd_R"
                      :selected="
                        isSelectedBetItem({
                          SRSMarketId: way.SRSMarketId,
                          SRSMarketType: way.SRSMarketType,
                          AllottedValue: way.AllottedValue,
                          OutcomeId: way.Outcome_R,
                        })
                      "
                      @click="
                        (v) => {
                          onBetItemClick(
                            {
                              ...v,
                              SRSMarketId: way.SRSMarketId,
                              SRSMarketType: way.SRSMarketType,
                            },
                            game
                          );
                        }
                      "
                    ></betting-game-button>
                  </template>
                  <template v-if="wIndex === 0" #buttons>
                    <i
                      class="icon-svg analysis"
                      @click="openMatchInfo(game.BMatchId)"
                    ></i>
                    <i
                      class="icon-svg sms"
                      @click="openAnalysisUrl(game.BMatchId)"
                    ></i>
                    <i
                      class="icon-svg tracker"
                      @click="openBroadCast(game.id)"
                    ></i>
                  </template>
                </betting-item-button-group>
              </template>
              <template v-if="game.handicaps.length > 0">
                <betting-item-button-group
                  :type="getSRSMarketType(game.handicaps[0].SRSMarketType).text"
                >
                  <template #bet-items>
                    <betting-game-button
                      :id="game.handicaps[0].Outcome_L"
                      :active="true"
                      label="홈 승"
                      :rate="game.handicaps[0].Odd_L"
                      :selected="
                        isSelectedBetItem({
                          SRSMarketId: game.handicaps[0].SRSMarketId,
                          SRSMarketType: game.handicaps[0].SRSMarketType,
                          AllottedValue: game.handicaps[0].AllottedValue,
                          OutcomeId: game.handicaps[0].Outcome_L,
                        })
                      "
                      @click="
                        (v) => {
                          onBetItemClick(
                            {
                              ...v,
                              SRSMarketId: game.handicaps[0].SRSMarketId,
                              SRSMarketType: game.handicaps[0].SRSMarketType,
                              AllottedValue: game.handicaps[0].AllottedValue,
                            },
                            game
                          );
                        }
                      "
                    ></betting-game-button>
                    <template v-if="game.handicaps[0].Odd_C !== null">
                      <betting-game-button
                        :id="game.handicaps[0].Outcome_C"
                        :active="true"
                        :label="
                          getHandicapLabel(game.handicaps[0].AllottedValue)
                        "
                        :rate="game.handicaps[0].Odd_C"
                        :selected="
                          isSelectedBetItem({
                            SRSMarketId: game.handicaps[0].SRSMarketId,
                            SRSMarketType: game.handicaps[0].SRSMarketType,
                            AllottedValue: game.handicaps[0].AllottedValue,
                            OutcomeId: game.handicaps[0].Outcome_C,
                          })
                        "
                        @click="
                          (v) => {
                            onBetItemClick(
                              {
                                ...v,
                                SRSMarketId: game.handicaps[0].SRSMarketId,
                                SRSMarketType: game.handicaps[0].SRSMarketType,
                                AllottedValue: game.handicaps[0].AllottedValue,
                                OutcomeIdName: '무',
                              },
                              game
                            );
                          }
                        "
                      ></betting-game-button>
                    </template>
                    <template v-else>
                      <betting-button-dummy
                        :label="
                          getHandicapLabel(game.handicaps[0].AllottedValue)
                        "
                      ></betting-button-dummy>
                    </template>
                    <betting-game-button
                      :id="game.handicaps[0].Outcome_R"
                      :active="true"
                      label="홈 패"
                      :rate="game.handicaps[0].Odd_R"
                      :selected="
                        isSelectedBetItem({
                          SRSMarketId: game.handicaps[0].SRSMarketId,
                          SRSMarketType: game.handicaps[0].SRSMarketType,
                          AllottedValue: game.handicaps[0].AllottedValue,
                          OutcomeId: game.handicaps[0].Outcome_R,
                        })
                      "
                      @click="
                        (v) => {
                          onBetItemClick(
                            {
                              ...v,
                              SRSMarketId: game.handicaps[0].SRSMarketId,
                              SRSMarketType: game.handicaps[0].SRSMarketType,
                              AllottedValue: game.handicaps[0].AllottedValue,
                            },
                            game
                          );
                        }
                      "
                    ></betting-game-button>
                  </template>
                  <template v-if="game.handicaps.length > 1" #buttons>
                    <button
                      v-b-toggle="`tg-handicap-${game.handicaps[0].id}`"
                      class="btn btn-sm btn-expander"
                    >
                      <i class="icon-svg more"></i>
                      <span style="color: #888888">
                        {{ `+ ${game.handicaps.length - 1}` }}
                      </span>
                    </button>
                  </template>
                </betting-item-button-group>
                <b-collapse :id="`tg-handicap-${game.handicaps[0].id}`">
                  <template
                    v-for="(handicap, hIndex) in getCollapingList(
                      game.handicaps
                    )"
                  >
                    <betting-item-button-group
                      :key="`betting-item-button-group-handicap-${game.id}-${hIndex}`"
                      type=""
                    >
                      <template #bet-items>
                        <betting-game-button
                          :id="handicap.Outcome_L"
                          :active="true"
                          label="홈 승"
                          :rate="handicap.Odd_L"
                          :selected="
                            isSelectedBetItem({
                              SRSMarketId: handicap.SRSMarketId,
                              SRSMarketType: handicap.SRSMarketType,
                              AllottedValue: handicap.AllottedValue,
                              OutcomeId: handicap.Outcome_L,
                            })
                          "
                          @click="
                            (v) => {
                              onBetItemClick(
                                {
                                  ...v,
                                  SRSMarketId: handicap.SRSMarketId,
                                  SRSMarketType: handicap.SRSMarketType,
                                  AllottedValue: handicap.AllottedValue,
                                },
                                game
                              );
                            }
                          "
                        ></betting-game-button>
                        <template v-if="handicap.Odd_C !== null">
                          <betting-game-button
                            :id="handicap.Outcome_C"
                            :active="true"
                            :label="getHandicapLabel(handicap.AllottedValue)"
                            :rate="handicap.Odd_C"
                            :selected="
                              isSelectedBetItem({
                                SRSMarketId: handicap.SRSMarketId,
                                SRSMarketType: handicap.SRSMarketType,
                                AllottedValue: handicap.AllottedValue,
                                OutcomeId: handicap.Outcome_C,
                              })
                            "
                            @click="
                              (v) => {
                                onBetItemClick(
                                  {
                                    ...v,
                                    SRSMarketId: handicap.SRSMarketId,
                                    SRSMarketType: handicap.SRSMarketType,
                                    AllottedValue: handicap.AllottedValue,
                                    OutcomeIdName: '무',
                                  },
                                  game
                                );
                              }
                            "
                          ></betting-game-button>
                        </template>
                        <template v-else>
                          <betting-button-dummy
                            :label="getHandicapLabel(handicap.AllottedValue)"
                          ></betting-button-dummy>
                        </template>
                        <betting-game-button
                          :id="handicap.Outcome_R"
                          :active="true"
                          label="홈 패"
                          :rate="handicap.Odd_R"
                          :selected="
                            isSelectedBetItem({
                              SRSMarketId: handicap.SRSMarketId,
                              SRSMarketType: handicap.SRSMarketType,
                              AllottedValue: handicap.AllottedValue,
                              OutcomeId: handicap.Outcome_R,
                            })
                          "
                          @click="
                            (v) => {
                              onBetItemClick(
                                {
                                  ...v,
                                  SRSMarketId: handicap.SRSMarketId,
                                  SRSMarketType: handicap.SRSMarketType,
                                  AllottedValue: handicap.AllottedValue,
                                },
                                game
                              );
                            }
                          "
                        ></betting-game-button>
                      </template>
                    </betting-item-button-group>
                  </template>
                </b-collapse>
              </template>
              <template v-if="game.totals.length > 0">
                <betting-item-button-group
                  :type="getSRSMarketType(game.totals[0].SRSMarketType).text"
                >
                  <template #bet-items>
                    <betting-game-button
                      :id="game.totals[0].Outcome_L"
                      :active="true"
                      label="언더"
                      arrow="lower"
                      :rate="game.totals[0].Odd_L"
                      :selected="
                        isSelectedBetItem({
                          SRSMarketId: game.totals[0].SRSMarketId,
                          SRSMarketType: game.totals[0].SRSMarketType,
                          AllottedValue: game.totals[0].AllottedValue,
                          OutcomeId: game.totals[0].Outcome_L,
                        })
                      "
                      @click="
                        (v) => {
                          onBetItemClick(
                            {
                              ...v,
                              SRSMarketId: game.totals[0].SRSMarketId,
                              SRSMarketType: game.totals[0].SRSMarketType,
                              AllottedValue: game.totals[0].AllottedValue,
                            },
                            game
                          );
                        }
                      "
                    ></betting-game-button>
                    <betting-button-dummy
                      :label="game.totals[0].AllottedValue"
                    ></betting-button-dummy>
                    <betting-game-button
                      :id="game.totals[0].Outcome_R"
                      :active="true"
                      label="오버"
                      arrow="higher"
                      :rate="game.totals[0].Odd_R"
                      :selected="
                        isSelectedBetItem({
                          SRSMarketId: game.totals[0].SRSMarketId,
                          SRSMarketType: game.totals[0].SRSMarketType,
                          AllottedValue: game.totals[0].AllottedValue,
                          OutcomeId: game.totals[0].Outcome_R,
                        })
                      "
                      @click="
                        (v) => {
                          onBetItemClick(
                            {
                              ...v,
                              SRSMarketId: game.totals[0].SRSMarketId,
                              SRSMarketType: game.totals[0].SRSMarketType,
                              AllottedValue: game.totals[0].AllottedValue,
                            },
                            game
                          );
                        }
                      "
                    ></betting-game-button>
                  </template>
                  <template v-if="game.totals.length > 1" #buttons>
                    <button
                      v-b-toggle="`tg-total-${game.totals[0].id}`"
                      class="btn btn-sm btn-expander"
                    >
                      <i class="icon-svg more"></i>
                      <span style="color: #888888">
                        {{ `+ ${game.totals.length - 1}` }}
                      </span>
                    </button>
                  </template>
                </betting-item-button-group>
                <b-collapse :id="`tg-total-${game.totals[0].id}`">
                  <template
                    v-for="(total, tIndex) in getCollapingList(game.totals)"
                  >
                    <betting-item-button-group
                      :key="`betting-item-button-group-total-${game.id}-${tIndex}`"
                      type=""
                    >
                      <template #bet-items>
                        <betting-game-button
                          :id="total.Outcome_L"
                          :active="true"
                          label="언더"
                          arrow="lower"
                          :rate="total.Odd_L"
                          :selected="
                            isSelectedBetItem({
                              SRSMarketId: total.SRSMarketId,
                              SRSMarketType: total.SRSMarketType,
                              AllottedValue: total.AllottedValue,
                              OutcomeId: total.Outcome_L,
                            })
                          "
                          @click="
                            (v) => {
                              onBetItemClick(
                                {
                                  ...v,
                                  SRSMarketId: total.SRSMarketId,
                                  SRSMarketType: total.SRSMarketType,
                                  AllottedValue: total.AllottedValue,
                                },
                                game
                              );
                            }
                          "
                        ></betting-game-button>
                        <betting-button-dummy
                          :label="total.AllottedValue"
                        ></betting-button-dummy>
                        <betting-game-button
                          :id="total.Outcome_R"
                          :active="true"
                          label="오버"
                          arrow="higher"
                          :rate="total.Odd_R"
                          :selected="
                            isSelectedBetItem({
                              SRSMarketId: total.SRSMarketId,
                              SRSMarketType: total.SRSMarketType,
                              AllottedValue: total.AllottedValue,
                              OutcomeId: total.Outcome_R,
                            })
                          "
                          @click="
                            (v) => {
                              onBetItemClick(
                                {
                                  ...v,
                                  SRSMarketId: total.SRSMarketId,
                                  SRSMarketType: total.SRSMarketType,
                                  AllottedValue: total.AllottedValue,
                                },
                                game
                              );
                            }
                          "
                        ></betting-game-button>
                      </template>
                    </betting-item-button-group>
                  </template>
                </b-collapse>
              </template>
            </template>
          </betting-item>
        </betting-league-container>
      </template>
      <template v-else>
        <div class="no-has-games default-ctn flex">
          <p>등록된 경기가 없습니다.</p>
        </div>
      </template>
    </template>
  </div>
</template>

<script>
import { createNamespacedHelpers } from 'vuex';

import selectorMixin from '~/mixins/hitgame/selector';
import bettingMixin from '~/mixins/hitgame/betting';
import betSaveCookieMixin from '~/mixins/hitgame/betting/cookie';

/** get betting list */
const {
  mapState: bettingListState,
  mapGetters: bettingListGetters,
  mapActions: bettingListActions,
} = createNamespacedHelpers('gamecenter/betting/list/srs');

let gameLoadInterval = null;

export default {
  mixins: [selectorMixin, bettingMixin, betSaveCookieMixin],
  data() {
    return {
      gameList: [],
    };
  },
  computed: {
    ...bettingListState({
      subscribed: 'subscribed',
      gameLoading: 'loading',
    }),
    ...bettingListGetters([
      'getGameCount',
      'getOpenedGames',
      'getClosedGames',
      'getGamesByTagFilter',
    ]),
    hasFilterData() {
      const { selectedAll, leagues } = this.filters;
      const hasSelectedAll = Object.values(selectedAll).some((v) => v);
      const hasLeagues = Object.values(leagues).some(
        (league) => league.length > 0
      );
      return hasSelectedAll || hasLeagues;
    },
  },
  watch: {
    getGameCount(newValue, oldValue) {
      if (!oldValue && oldValue >= 0) {
        return;
      }
      this.gameList = this.loadGames(new Date().getTime());
      this.openLeagues = this._getSrsOpenedLeagues(new Date().getTime());
    },
    sport(v) {
      console.log('watch sport');
      this.gameList = this.loadGames(new Date().getTime());
    },
    filters() {
      console.log('watch filters');
      this.gameList = this.loadGames(new Date().getTime());
    },
    openLeagues(v) {
      const currentLeagues = JSON.parse(JSON.stringify(this.filters.leagues));
      Object.keys(v).map((sportId) => {
        if (!currentLeagues[sportId]) {
          return;
        }
        currentLeagues[sportId] = currentLeagues[sportId].filter((league) => {
          return v[sportId].includes(league);
        });
      });
      console.log('openLeagues', v);
      console.log('currentLeagues', currentLeagues);
      this.filters.leagues = currentLeagues;
    },
  },
  beforeMount() {
    this._clearBetCarts();
  },
  mounted() {
    this.subscribeSRS();
    this.gameList = this.loadGames(new Date().getTime());
    this.openLeagues = this._getSrsOpenedLeagues(new Date().getTime());
    this.setGameLoadInterval();
    if (this.$auth.loggedIn) {
      const savedBetCartItems = this.getSavedBetCartItems(
        this.$auth.user.accountno
      );
      const timestamp = new Date().getTime();
      console.log('savedBetCartItems', savedBetCartItems);
      savedBetCartItems.map((item) => {
        if (item.MatchDate.getTime() >= timestamp) {
          this.addBettingItem(item);
        }
      });
    }
  },
  beforeDestroy() {
    this.clearGameLoadInterval();
    this.unsubscribeSRS();
    this.clearList();
  },
  methods: {
    ...bettingListActions({ clearList: 'clear' }),
    setGameLoadInterval() {
      gameLoadInterval = setInterval(() => {
        if (!this.subscribed) {
          return;
        }
        this.gameList = this.loadGames(new Date().getTime());
        this.openLeagues = this._getSrsOpenedLeagues(new Date().getTime());
        console.log('game loaded');
      }, 5000);
    },
    clearGameLoadInterval() {
      if (gameLoadInterval === null) {
        return;
      }
      clearInterval(gameLoadInterval);
    },
    onBetItemClick(item, game) {
      this._onBetItemClick(item, game, 'SRS');
    },
    loadGames(v) {
      const { sport, filters } = this;
      if (sport === -1) {
        return this.getGamesByTagFilter(filters, v);
      }
      if (sport === 0) {
        return this.getOpenedGames(v);
      }
      return this.getGamesByTagFilter(
        {
          leagues: {},
          selectedAll: {
            [sport]: true,
          },
        },
        v
      );
    },
  },
};
</script>

<style scoped>
.srs-container {
  position: relative;
}

div.tags {
  width: auto;
  padding-top: 15px;
}
div.tags.collapsed {
  max-height: 55px;
}
</style>
