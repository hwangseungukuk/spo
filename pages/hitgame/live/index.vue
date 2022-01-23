<template>
  <div class="game-list">
    <template v-if="connecting">
      <div class="spinner grey"></div>
    </template>
    <template v-else>
      <template v-if="!connected || !setGames">
        <div class="spinner grey"></div>
      </template>
      <template v-else>
        <div v-if="!hasActivateGame" class="no-has-items default-ctn flex">
          <p>현재 진행 중인 경기가 없습니다.</p>
        </div>
        <template v-for="(g, gI) in Object.keys(games).sort()">
          <template v-for="(l, lI) in Object.keys(games[g])">
            <template v-for="(game, gIndex) in games[g][l]">
              <betting-league-container
                :key="`live-game-league-container-${gI}-${lI}-${gIndex}`"
                :sport="game.SportId"
                :league="getSportLeagueName(game.TournamentId)"
              >
                <template v-for="(match, mIndex) in game.matches">
                  <live-game-item
                    :id="match.MatchId"
                    :key="`game-item-${mIndex}-${match.MatchId}`"
                    :status="match.MatchStatusCode"
                    :date="match.MatchDate"
                    :remaining-time="getRemainingTime(match.event_status)"
                    :home-team="
                      getTeamName(match.HomeTeam_UniqueId, match.HomeTeam)
                    "
                    :home-score="getHomeScore(match.event_status)"
                    :home-set-score="getHomeSetScore(match.event_status)"
                    :away-team="
                      getTeamName(match.AwayTeam_UniqueId, match.AwayTeam)
                    "
                    :away-score="getAwayScore(match.event_status)"
                    :away-set-score="getAwaySetScore(match.event_status)"
                    :set-score="getSportByCode(game.SportId).setscore"
                    :serve="getEventStatusServer(match.event_status)"
                    @onHeaderClick="onHeaderClick"
                    @analysis="onAnalysisClick"
                    @popup="onPopupClick(match.MatchId)"
                  >
                    <template v-if="hasSrs(match.odds)">
                      <template
                        v-for="(market, mkIndex) in getSrsList(match.odds)"
                      >
                        <live-game-button
                          v-for="(bet, index) in market.outcome"
                          :id="bet.id"
                          :key="`live-game-bet-${match.MatchId}-${mkIndex}-${bet.id}-${index}`"
                          :active="market.status === 1 && bet.active === 1"
                          :label="
                            getOutcomeName(
                              game.SportId,
                              bet.id,
                              getTeamName(
                                match.HomeTeam_UniqueId,
                                match.HomeTeam
                              ),
                              getTeamName(
                                match.AwayTeam_UniqueId,
                                match.AwayTeam
                              )
                            )
                          "
                          :rate="bet.odds"
                          :arrow="bet.arrow"
                          :selected="
                            getSelectedBetItems.includes(
                              `${match.MatchId}/${market.id}/${bet.id}/null/${bet.odds}`
                            )
                          "
                          @click="
                            (v) =>
                              onSrsButtonClick({
                                ...v,
                                MarketId: market.id,
                                MarketIdName: getMarketIdName(
                                  game.SportId,
                                  market.id
                                ),
                                MatchDate: match.MatchDate,
                                MatchId: match.MatchId,
                                MatchInfo: `
                            ${getTeamName(
                              match.HomeTeam_UniqueId,
                              match.HomeTeam
                            )} VS
                            ${getTeamName(
                              match.AwayTeam_UniqueId,
                              match.AwayTeam
                            )}
                            `,
                                Specifiers: null,
                              })
                          "
                        ></live-game-button>
                      </template>
                    </template>
                    <template v-else>
                      <live-game-button
                        v-for="ni in 3"
                        :key="`live-game-bet-${match.MatchId}-disabled-${ni}`"
                        :active="false"
                        class="btn btn-sm bet inline-flex"
                        disabled
                      ></live-game-button>
                    </template>
                  </live-game-item>
                </template>
              </betting-league-container>
            </template>
          </template>
        </template>
      </template>
    </template>
  </div>
</template>

<script>
import { createNamespacedHelpers } from 'vuex';

import BettingLeagueContainer from '~/components/hitgame/bettings/BettingLeagueContainer';

import LiveGameItem from '~/components/hitgame/live/LiveGameItem';

import LiveGameButton from '~/components/hitgame/BettingGameButton';

import liveGameMixin from '~/mixins/hitgame/live';

import betSaveCookieMixin from '~/mixins/hitgame/betting/cookie';

const {
  mapState: liveGameState,
  mapGetters: liveGameGetters,
  mapActions: liveGameActions,
} = createNamespacedHelpers('gamecenter/betting/list/live');

const {
  mapGetters: bettingCartGetters,
  mapActions: bettingCartActions,
} = createNamespacedHelpers('gamecenter/betting/cart');

export default {
  components: {
    BettingLeagueContainer,
    LiveGameItem,
    LiveGameButton,
  },
  mixins: [liveGameMixin, betSaveCookieMixin],
  props: {
    leagues: { type: Array, default: () => [] },
  },
  data() {
    return {
      games: {},
      setGames: false,
    };
  },
  computed: {
    ...bettingCartGetters({
      getSelectedBetItems: 'getSelectedItems',
    }),
    ...liveGameState({
      connected: 'connected',
      connecting: 'connecting',
    }),
    ...liveGameGetters({
      _games: 'getGames',
      getSelectedLeagueLiveGameGroup: 'getSelectedLeagueLiveGameGroup',
    }),
    hasActivateGame() {
      if (!this.games.active || Object.keys(this.games.active).length <= 0) {
        return false;
      }
      return true;
    },
  },
  watch: {
    _games(v) {
      this.load();
    },
    hasActivateGame(v) {
      if (!v) {
        return;
      }
      if (!this.$auth.loggedIn) {
        return;
      }
      const savedBetCartItems = this.getSavedBetCartItems(
        this.$auth.user.accountno
      );
      console.log('savedBetCartItems', savedBetCartItems);
      savedBetCartItems.map((item) => {
        this.addBettingItem(item);
      });
    },
  },
  mounted() {
    this.updateCart(true);
    this.load();
  },
  beforeDestroy() {
    this.updateCart(false);
  },
  methods: {
    ...bettingCartActions({
      addBettingItem: 'addItem',
      removeBettingItem: 'removeItem',
    }),
    ...liveGameActions({
      updateCart: 'updateCart',
    }),
    load() {
      const { leagues } = this;
      if (leagues.length <= 0) {
        this.games = { ...this._games };
      } else {
        this.games = { ...this.getSelectedLeagueLiveGameGroup(leagues) };
      }
      this.setGames = true;
    },
    onAnalysisClick(v) {
      this.openMatchInfo(v);
    },
    onPopupClick(MatchId) {
      const options =
        'top=100, left=100, width=720, height=855, status=no, menubar=no, toolbar=no, resizable=no, scrollbars=no';
      const url = `${this.$route.path}${MatchId}/popup`;
      window.open(url, `spo_livegame_${MatchId}`, options);
    },
    onHeaderClick({ MatchId }) {
      this.$router.push({ name: 'hitgame-live-id', params: { id: MatchId } });
    },
    getSrsList(odds) {
      if (!odds || odds === null) {
        return [];
      }
      return odds.filter((odd) => odd.id === 1 || odd.id === 186);
    },
    hasSrs(odds) {
      return this.getSrsList(odds).length > 0;
    },
    getOutcomeName(SportId, OutcomeId, HomeTeam, AwayTeam) {
      let result = this.getMarketInfoTemplate(SportId, 1, OutcomeId);
      if (!result) {
        result = this.getMarketInfoTemplate(SportId, 186, OutcomeId);
      }
      if (!result) {
        return 'No has outcome name';
      }
      const name = result.OutomeIdName;
      if (name.includes('{$competitor1}')) {
        return name.replace('{$competitor1}', HomeTeam);
      }
      if (name.includes('{$competitor2}')) {
        return name.replace('{$competitor2}', AwayTeam);
      }
      return name;
    },
    onSrsButtonClick(v) {
      console.log(v);
      if (v.selected) {
        this.removeBettingItem(v);
        return;
      }
      const item = {
        ...v,
        game: 'live',
      };
      console.log(item);
      this.addBettingItem(item);
    },
  },
};
</script>

<style scoped>
.league-container:not(:last-child) {
  margin-bottom: 10px;
}

div.no-has-items {
  margin-bottom: 10px;
}
</style>
