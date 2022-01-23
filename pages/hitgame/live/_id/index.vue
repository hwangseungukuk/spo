<template>
  <div>
    <template v-if="connecting">
      <div class="spinner grey"></div>
    </template>
    <template v-if="connected">
      <template v-if="gameInfo !== null">
        <betting-league-container
          :sport="gameInfo.SportId"
          :league="getSportLeagueName(gameInfo.TournamentId)"
          :arrow="true"
          @arrow="$router.push({ name: 'hitgame-live' })"
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
            :home-set-score="getHomeSetScore(gameInfo.event_status)"
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
              v-model="selectedMarketId"
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
          <div class="game-list">
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
    </template>
  </div>
</template>

<script>
import ButtonTabs from '~/components/common/ButtonTabs';
import BettingLeagueContainer from '~/components/hitgame/bettings/BettingLeagueContainer';

import LiveGameItemHeader from '~/components/hitgame/live/LiveGameItemHeader';
import LiveGameTypeGroup from '~/components/hitgame/live/detail/LiveGameTypeGroup';

import LiveGameButton from '~/components/hitgame/BettingGameButton';

import liveGameMixin from '~/mixins/hitgame/live';
import liveGameDetailMixin from '~/mixins/hitgame/live/detail';

export default {
  components: {
    ButtonTabs,
    BettingLeagueContainer,
    LiveGameItemHeader,
    LiveGameTypeGroup,
    LiveGameButton,
  },
  mixins: [liveGameMixin, liveGameDetailMixin],
  methods: {
    onAnalysisClick(v) {
      this.openMatchInfo(v);
    },
  },
};
</script>

<style scoped>
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
  max-width: 710px;
  max-height: 800px;
  overflow-y: scroll;
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
}
</style>
