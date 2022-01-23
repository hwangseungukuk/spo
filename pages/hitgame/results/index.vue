<template>
  <div class="mr-wrapper">
    <sport-leagues-selector
      :current-sport="sport"
      :has-data="hasFilterData"
      @sport="onSportClick"
      @selector="showModal = !showModal"
    ></sport-leagues-selector>
    <selector-modal
      :show="showModal"
      :leagues="filters.leagues"
      :open-leagues="getLeagueList"
      :show-description="false"
      :selected-all="filters.selectedAll"
      @confirm="onSelectorConfirmClick"
      @close="showModal = false"
    ></selector-modal>
    <div class="match-result-container">
      <date-picker @change="(v) => (currentDate = v)"></date-picker>
      <div class="result-list default-ctn">
        <div class="result-list-header flex">
          <p style="width: 65px">경기 상태</p>
          <p style="width: 95px">종목</p>
          <p style="width: 125px">리그</p>
          <p style="width: 75px">경기 시간</p>
          <p style="width: 510px">경기 결과</p>
        </div>
        <template v-if="loadingMR">
          <div class="spinner"></div>
        </template>
        <template v-else>
          <template v-if="getResults.length > 0">
            <match-result-item
              v-for="(result, index) in getResults"
              :id="result.id"
              :key="`match_result_${index}_${result.id}`"
              :status="result.MatchStatusCode"
              :sport-id="result.SportId"
              :league="getSportLeagueName(result.TournamentId)"
              :match-date="result.MatchDate"
              :home-name="
                getTeamName(result.HomeTeam_UniqueId, result.HomeTeam_Name)
              "
              :away-name="
                getTeamName(result.AwayTeam_UniqueId, result.AwayTeam_Name)
              "
              :home-score="
                result.HomeTeam_Score < 0 ? 0 : result.HomeTeam_Score
              "
              :away-score="
                result.AwayTeam_Score < 0 ? 0 : result.AwayTeam_Score
              "
              :home-won="result.HomeTeam_Score > result.AwayTeam_Score"
              :away-won="result.AwayTeam_Score > result.HomeTeam_Score"
            ></match-result-item>
          </template>
          <template v-else>
            <div class="no-has-items default-ctn flex">
              <p>경기 결과가 없습니다.</p>
            </div>
          </template>
        </template>
      </div>
    </div>
  </div>
</template>

<script>
import { createNamespacedHelpers } from 'vuex';

import DatePicker from '~/components/hitgame/results/ResultDatePicker.vue';
import MatchResultItem from '~/components/hitgame/results/MatchResultItem.vue';

import selectorMixin from '~/mixins/hitgame/selector';

const {
  mapState: matchResultState,
  mapGetters: matchResultGetters,
  mapActions: matchResultActions,
} = createNamespacedHelpers('gamecenter/results');

export default {
  components: {
    DatePicker,
    MatchResultItem,
  },
  mixins: [selectorMixin],
  data() {
    return {
      currentDate: new Date(),
    };
  },
  computed: {
    ...matchResultState({
      hasMatchResults: 'success',
      matchResults: 'items',
      loadingMR: 'loading',
    }),
    ...matchResultGetters({
      getLeagueList: 'getLeagueList',
      getSelectedSportItems: 'getSelectedSportItems',
      getSelectedLeaguesItems: 'getSelectedLeaguesItems',
    }),
    hasFilterData() {
      const { selectedAll, leagues } = this.filters;
      const hasSelectedAll = Object.values(selectedAll).some((v) => v);
      const hasLeagues = Object.values(leagues).some(
        (league) => league.length > 0
      );
      return hasSelectedAll || hasLeagues;
    },
    getResults() {
      const { sport } = this;
      if (sport === -1) {
        return this.getSelectedLeaguesItems(this.filters);
      }
      if (sport > 0) {
        return this.getSelectedSportItems(sport);
      }
      return this.matchResults;
    },
  },
  watch: {
    async currentDate(v) {
      this.sport = 0;
      this._clearFilter();
      await this.getMatchResults(v);
    },
  },
  async beforeMount() {
    await this.getMatchResults();
  },
  methods: {
    ...matchResultActions({ getMatchResults: 'getResults' }),
  },
};
</script>

<style scoped>
div.mr-wrapper {
  position: relative;
}

div.match-result-container {
  padding: 20px;
  border-radius: 10px;
  background-color: white;
}

div.result-list {
  width: 100%;
  padding-top: 10px;
  /*margin-bottom: 40px;*/
}
div.result-list > div {
  padding-left: 10px;
}

div.result-list div.result-list-header {
  height: 40px;
  color: #444444;
  align-items: center;
  justify-content: center;
}

div.result-list div.result-list-header p {
  margin-bottom: 0;
  text-align: center;
}

div.result-list div:nth-child(odd) {
  background-color: #f7f7f7;
}

div.result-list div:nth-child(even) {
  background-color: transparent;
}

div.no-has-items {
  width: 100%;
  height: 300px;
  align-items: center;
  justify-content: center;
}

div.no-has-items p {
  font-weight: 700;
  color: #888888;
  margin-bottom: 0;
  font-size: 14px;
}
</style>
