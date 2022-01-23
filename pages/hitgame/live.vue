<template>
  <div class="live-container">
    <template v-if="isPopup">
      <nuxt-child></nuxt-child>
    </template>
    <template v-else>
      <top-status-bar
        :live="countOfLiveGames"
        :wait="getScheduledGames.length"
        @schedule="onScheduleClick"
      ></top-status-bar>
      <div class="wrapper flex">
        <aside>
          <side-league-selector :live="countOfLiveGames">
            <template #leagues>
              <side-league-group-item
                :id="-1"
                icon="all circle"
                name="전체"
                :count="countOfLiveGames"
                :selected="openedGroup === -1"
                @onGroupClick="onGroupClick"
              >
                <template #league-items>
                  <template v-for="(k, kI) in Object.keys(getLiveGameGroup)">
                    <side-league-item
                      :id="parseInt(k)"
                      :key="`live-game-${kI}-${k}`"
                      :name="getSportLeagueName(parseInt(k))"
                      :selected="selectedLeagues.includes(parseInt(k))"
                      :opened="
                        openedGroup === -1 && openedLeague === parseInt(k)
                      "
                      @select="onLeagueSelect"
                      @open="onLeagueOpen"
                    >
                      <template #match-items>
                        <template v-for="(match, mI) in getLiveGameGroup[k]">
                          <side-league-match-item
                            :id="match.MatchId"
                            :key="`side-league-match-item-${match.MatchId}-${mI}`"
                            :date="match.MatchDate"
                            :status="match.MatchStatusCode"
                            :home-name="
                              getTeamName(
                                match.HomeTeam_UniqueId,
                                match.HomeTeam
                              )
                            "
                            :home-score="getHomeScore(match.event_status)"
                            :away-name="
                              getTeamName(
                                match.AwayTeam_UniqueId,
                                match.AwayTeam
                              )
                            "
                            :away-score="getAwayScore(match.event_status)"
                            @onMatchClick="onMatchClick"
                          ></side-league-match-item>
                        </template>
                      </template>
                    </side-league-item>
                  </template>
                </template>
              </side-league-group-item>
              <side-league-group-item
                :id="0"
                icon="recommend"
                name="추천"
                :count="getRecommendGames.length"
                :selected="openedGroup === 0"
                @onGroupClick="onGroupClick"
              >
                <template #league-items>
                  <template
                    v-for="(k, i) in Object.keys(getRecommendGameGroup)"
                  >
                    <side-league-item
                      :id="parseInt(k)"
                      :key="`live-game-${i}-${k}`"
                      :name="getSportLeagueName(parseInt(k))"
                      :selected="selectedLeagues.includes(parseInt(k))"
                      :opened="
                        openedGroup === 0 && openedLeague === parseInt(k)
                      "
                      @select="
                        (v) =>
                          onLeagueSelect({ ...v, SportId: parseInt(SportId) })
                      "
                      @open="onLeagueOpen"
                    >
                      <template #match-items>
                        <template
                          v-for="(match, mI) in getRecommendGameGroup[k]"
                        >
                          <side-league-match-item
                            :id="match.MatchId"
                            :key="`side-league-match-item-${match.MatchId}-${mI}`"
                            :date="match.MatchDate"
                            :status="match.MatchStatusCode"
                            :home-name="
                              getTeamName(
                                match.HomeTeam_UniqueId,
                                match.HomeTeam
                              )
                            "
                            :home-score="getHomeScore(match.event_status)"
                            :away-name="
                              getTeamName(
                                match.AwayTeam_UniqueId,
                                match.AwayTeam
                              )
                            "
                            :away-score="getAwayScore(match.event_status)"
                            @onMatchClick="onMatchClick"
                          ></side-league-match-item>
                        </template>
                      </template>
                    </side-league-item>
                  </template>
                </template>
              </side-league-group-item>
              <template v-for="(SportId, sI) in Object.keys(getSportGameGroup)">
                <side-league-group-item
                  :id="parseInt(SportId)"
                  :key="`side-league-group-sport-${SportId}-${sI}`"
                  :icon="getSportValue(parseInt(SportId))"
                  :name="getSportText(parseInt(SportId))"
                  :count="
                    Object.keys(getSportGameGroup[parseInt(SportId)]).reduce(
                      (sum, key) => {
                        return (sum +=
                          getSportGameGroup[parseInt(SportId)][key].length);
                      },
                      0
                    )
                  "
                  :selected="
                    openedGroup === parseInt(SportId) ||
                    selectedSports.includes(parseInt(SportId))
                  "
                  @onGroupClick="onGroupClick"
                >
                  <template #league-items>
                    <template
                      v-for="(league, i) in Object.keys(
                        getSportGameGroup[parseInt(SportId)]
                      )"
                    >
                      <side-league-item
                        :id="parseInt(league)"
                        :key="`live-game-${i}-${league}`"
                        :name="getSportLeagueName(parseInt(league))"
                        :selected="selectedLeagues.includes(parseInt(league))"
                        :opened="
                          openedGroup === parseInt(SportId) &&
                          openedLeague === parseInt(league)
                        "
                        @select="
                          (v) =>
                            onLeagueSelect({ ...v, SportId: parseInt(SportId) })
                        "
                        @open="onLeagueOpen"
                      >
                        <template #match-items>
                          <template
                            v-for="(match, mI) in getSportGameGroup[
                              parseInt(SportId)
                            ][parseInt(league)]"
                          >
                            <side-league-match-item
                              :id="match.MatchId"
                              :key="`side-league-match-item-${match.MatchId}-${mI}`"
                              :date="match.MatchDate"
                              :remaining-time="
                                getRemainingTime(match.event_status)
                              "
                              :status="match.MatchStatusCode"
                              :home-name="
                                getTeamName(
                                  match.HomeTeam_UniqueId,
                                  match.HomeTeam
                                )
                              "
                              :home-score="getHomeScore(match.event_status)"
                              :home-set-score="
                                getHomeSetScore(match.event_status)
                              "
                              :away-name="
                                getTeamName(
                                  match.AwayTeam_UniqueId,
                                  match.AwayTeam
                                )
                              "
                              :away-score="getAwayScore(match.event_status)"
                              :away-set-score="
                                getAwaySetScore(match.event_status)
                              "
                              :set-score="
                                getSportByCode(parseInt(SportId)).setscore
                              "
                              :serve="getEventStatusServer(match.event_status)"
                              @onMatchClick="onMatchClick"
                            ></side-league-match-item>
                          </template>
                        </template>
                      </side-league-item>
                    </template>
                  </template>
                </side-league-group-item>
              </template>
            </template>
          </side-league-selector>
          <side-league-selector :header="false">
            <template #leagues>
              <side-league-group-item
                :id="-2"
                icon="scheduled"
                name="예정"
                :count="getScheduledGames.length"
                :selected="openedGroup === -2"
                @onGroupClick="onGroupClick"
              >
                <template #league-items>
                  <template
                    v-for="(k, i) in Object.keys(getScheduledGameGroup)"
                  >
                    <side-league-item
                      :id="parseInt(k)"
                      :key="`live-game-scheduled-${i}-${k}`"
                      :name="getSportLeagueName(parseInt(k))"
                      :selected="selectedLeagues.includes(parseInt(k))"
                      :opened="
                        openedGroup === -2 && openedLeague === parseInt(k)
                      "
                      :scheduled="true"
                      @select="
                        (v) =>
                          onLeagueSelect({ ...v, SportId: parseInt(SportId) })
                      "
                      @open="onLeagueOpen"
                    >
                      <template #match-items>
                        <template
                          v-for="(match, mI) in getScheduledGameGroup[k]"
                        >
                          <side-league-match-item
                            :id="match.MatchId"
                            :key="`side-league-scheduled-match-item-${match.MatchId}-${mI}`"
                            :date="match.MatchDate"
                            :status="match.MatchStatusCode"
                            :home-name="
                              getTeamName(
                                match.HomeTeam_UniqueId,
                                match.HomeTeam
                              )
                            "
                            :home-score="getHomeScore(match.event_status)"
                            :away-name="
                              getTeamName(
                                match.AwayTeam_UniqueId,
                                match.AwayTeam
                              )
                            "
                            :away-score="getAwayScore(match.event_status)"
                            :scheduled="true"
                          ></side-league-match-item>
                        </template>
                      </template>
                    </side-league-item>
                  </template>
                </template>
              </side-league-group-item>
            </template>
          </side-league-selector>
        </aside>
        <div class="live-game-contents">
          <nuxt-child :leagues="selectedLeagues"></nuxt-child>
        </div>
      </div>
    </template>
  </div>
</template>

<script>
import { createNamespacedHelpers } from 'vuex';

import TopStatusBar from '~/components/hitgame/live/TopStatusBar';

import SideLeagueSelector from '~/components/hitgame/live/side/SideLeagueSelector';
import SideLeagueGroupItem from '~/components/hitgame/live/side/SideLeagueGroupItem';
import SideLeagueItem from '~/components/hitgame/live/side/SideLeagueItem';
import SideLeagueMatchItem from '~/components/hitgame/live/side/SideLeagueMatchItem';

import LiveGameScheduleModal, {
  MODAL_OPTIONS,
} from '~/components/modals/livegame/LiveGameScheduleModal';

import liveCommonMixin from '~/mixins/hitgame/live';

export const LIVE_GAME_LOADING = 'LIVE_GAME_LOADING';
export const LIVE_GAME_LOADED = 'LIVE_GAME_LOADED';

const {
  mapState: liveGameState,
  mapGetters: liveGameGetters,
  mapActions: liveGameActions,
} = createNamespacedHelpers('gamecenter/betting/list/live');

export default {
  components: {
    TopStatusBar,
    SideLeagueSelector,
    SideLeagueGroupItem,
    SideLeagueItem,
    SideLeagueMatchItem,
  },
  mixins: [liveCommonMixin],
  data() {
    return {
      openedGroup: null,
      openedLeague: null,
      selectedSports: [],
      selectedLeagues: [],
    };
  },
  computed: {
    ...liveGameState({
      connected: 'connected',
      connecting: 'connecting',
    }),
    ...liveGameGetters([
      'getLiveGames',
      'getLiveGameGroup',
      'countOfGames',
      'countOfLiveGames',
      'getRecommendGames',
      'getRecommendGameGroup',
      'getScheduledGames',
      'getScheduledGameGroup',
      'getSportGameGroup',
    ]),
    isPopup() {
      return this.$route.name.includes('popup');
    },
  },
  watch: {
    connecting(v) {
      if (v) {
        this.$nuxt.$emit(LIVE_GAME_LOADING);
      } else {
        this.$nuxt.$emit(LIVE_GAME_LOADED);
      }
    },
  },
  mounted() {
    this.subscribeLive();
  },
  beforeDestroy() {
    this.unsubscribeLive();
    this.clearLiveGame();
  },
  methods: {
    ...liveGameActions({
      clearLiveGame: 'clear',
    }),
    onGroupClick({ id, selected }) {
      if (selected) {
        this.openedGroup = null;
        return;
      }
      this.openedGroup = id;
      this.openedLeague = null;
    },
    onLeagueSelect({ id, selected, SportId }) {
      if (selected) {
        this.selectedLeagues = this.selectedLeagues.filter(
          (league) => league !== id
        );
        this.selectedSports = this.selectedSports.filter(
          (sport) => sport !== SportId
        );
        return;
      }
      this.selectedLeagues = [...this.selectedLeagues, id];
      this.selectedSports = [...this.selectedSports, SportId];
    },
    onLeagueOpen({ id, opened }) {
      if (opened) {
        this.openedLeague = null;
        return;
      }
      this.openedLeague = id;
    },
    getHomeScore(eventStatus) {
      return eventStatus ? eventStatus.home_score : 0;
    },
    getAwayScore(eventStatus) {
      return eventStatus ? eventStatus.away_score : 0;
    },
    onMatchClick({ id }) {
      this.$router.push({ name: 'hitgame-live-id', params: { id } });
    },
    onScheduleClick() {
      this.$modal.show(LiveGameScheduleModal, null, MODAL_OPTIONS);
    },
  },
};
</script>

<style scoped>
.live-status-bar {
  margin-bottom: 10px;
}

.live-container aside {
  margin-right: 10px;
}

.league-group .league-item {
  border-bottom: 2px solid #f2f2f2;
}

.league-group .league-item.expanded {
  border-bottom: unset;
}

.league-group .league-item:first-child {
  border-top-left-radius: 5px;
  border-top-right-radius: 5px;
}

.league-group .league-item:last-child {
  border-bottom-left-radius: 5px;
  border-bottom-right-radius: 5px;
  border-bottom: unset;
}

.live-game-contents {
  flex: 1;
}
</style>
