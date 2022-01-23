<template>
  <div>
    <template v-for="(popup, index) in getLayerPopup">
      <layer-popup
        :id="parseInt(popup.nw_id)"
        :key="`layer-popup-${index}-${popup.nw_id}`"
        :top="parseInt(popup.nw_top)"
        :left="parseInt(popup.nw_left)"
        :width="parseInt(popup.nw_width)"
        :height="parseInt(popup.nw_height)"
        :header="popup.nw_subject"
        :content="popup.nw_content"
      ></layer-popup>
    </template>
    <div class="swiper-container events">
      <div class="swiper-wrapper">
        <template v-if="getBanners.length > 0">
          <template
            v-for="({ link, target, title, image }, index) in getBanners"
          >
            <banner-comp
              :key="`main_banner_${index}`"
              :link="link"
              :target="target"
              :title="title"
              :image="image"
            ></banner-comp>
          </template>
        </template>
        <template v-else>
          <banner-comp
            :link="null"
            :target="null"
            title="세계적인 인증, 캐주얼 게임! SPOLIVE"
            :image="mainBannerDummy"
          ></banner-comp>
        </template>
      </div>
      <div class="wrapper">
        <div class="pagination"></div>
        <div class="button-prev">
          <i class="icon-svg prev"></i>
        </div>
        <div class="button-next">
          <i class="icon-svg next"></i>
        </div>
      </div>
    </div>
    <title-more-comp
      title="오늘의 추천 경기"
      router-name="hitgame-srs"
    ></title-more-comp>
    <template v-if="gameLoading">
      <div class="spinner hitgame"></div>
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
    <img
      class="campain_banner"
      src="images/banner_sub.png"
      alt="불법 획득 및 거래 금지 캠페인"
    />
    <match-result-container
      @onChangeDate="onChangeMRDate"
      @onChangeSport="onChangeMRSport"
    >
      <template
        v-if="!loadingMR && getMatchResultBy(currentMRSport).length <= 0"
      >
        <div class="no-has-match-result">
          <p>경기 일정이 없습니다.</p>
        </div>
      </template>
      <template v-else>
        <template v-for="(item, index) in getMatchResultBy(currentMRSport)">
          <match-result-item
            :id="item.id"
            :key="`${item.id}_${index}`"
            :status="item.MatchStatusCode"
            :sport-id="item.SportId"
            :league="getSportLeagueName(item.TournamentId)"
            :home-name="getTeamName(item.HomeTeam_UniqueId, item.HomeTeam_Name)"
            :away-name="getTeamName(item.AwayTeam_UniqueId, item.AwayTeam_Name)"
            :home-score="item.HomeTeam_Score < 0 ? 0 : item.HomeTeam_Score"
            :away-score="item.AwayTeam_Score < 0 ? 0 : item.AwayTeam_Score"
            :home-won="item.HomeTeam_Score > item.AwayTeam_Score"
            :away-won="item.AwayTeam_Score > item.HomeTeam_Score"
            :match-date="item.MatchDate"
            :analysis="item.AnalysisUrl"
          ></match-result-item>
        </template>
        <template v-for="i in 9 - getMatchResultBy(currentMRSport).length">
          <div :key="`blank_items_${i}`" class="mr-blank-item"></div>
        </template>
      </template>
    </match-result-container>
    <div class="flex" style="margin-bottom: 80px">
      <bottom-board-container
        title="새소식"
        router-name="news-path"
        router-path="notice"
        :menus="newsMenus"
        @change="onNewsHomeChange"
      >
        <bottom-board-item
          v-for="(item, index) in getNewsItems"
          :id="parseInt(item.wr_id)"
          :key="`news_home_${item.wr_id}_${index}`"
          :title="item.wr_subject"
          :path="newsPath"
          :date="item.datetime"
          @click="
            ({ id, path }) =>
              $router.push({ name: 'news-path-id', params: { path, id } })
          "
        ></bottom-board-item>
      </bottom-board-container>
      <div class="spacer"></div>
      <bottom-board-container
        title="커뮤니티"
        router-name="community-path"
        router-path="analysis_new"
        :menus="communityMenus"
        @change="onCommunityHomeChange"
      >
        <template v-if="communityPath === 'spomedia'">
          <template v-for="(item, index) in getSpomedia">
            <bottom-board-image-item
              :id="parseInt(item.wr_id)"
              :key="`board_bottom_community_${communityPath}_${index}_${item.id}`"
              :path="communityPath"
              :title="item.subject"
              :image="item.thumb.src"
              @click="
                ({ id, path }) =>
                  $router.push({
                    name: 'community-path-id',
                    params: { path, id },
                  })
              "
            ></bottom-board-image-item>
          </template>
        </template>
        <template v-else>
          <bottom-board-item
            v-for="(item, index) in getCommunityItems"
            :id="parseInt(item.wr_id)"
            :key="`board_bottom_community_${communityPath}_${index}_${item.wr_id}`"
            :title="item.wr_subject"
            :path="communityPath"
            :date="item.datetime"
            @click="
              ({ id, path }) =>
                $router.push({
                  name: 'community-path-id',
                  params: { path, id },
                })
            "
          ></bottom-board-item>
        </template>
      </bottom-board-container>
    </div>
  </div>
</template>

<script>
import { Swiper } from 'swiper/bundle';
import 'swiper/swiper-bundle.css';
import { createNamespacedHelpers } from 'vuex';

import mainBannerDummy from '~/assets/images/main/main_bn.png';

import NewMessagesModal, {
  COOKIE_KEY_NO_DISPLAY_NEW_MESSAGE_TODAY,
  MODAL_OPTIONS as NMM_MODAL_OPTIONS,
} from '~/components/modals/message/NewMessagesModal';

import { COOKIE_KEY_NO_DISPLAY_SURVEY_TODAY } from '~/components/modals/survey/HasSurveyModal';

import BannerComp from '~/components/home/BannerComp';
import TitleMoreComp from '~/components/home/TitleMoreComp';

import MatchResultContainer from '~/components/home/results/MatchResultContainer';
import MatchResultItem from '~/components/home/results/MatchResultItem';

import BottomBoardContainer from '~/components/home/board/BottomBoardContainer';
import BottomBoardItem from '~/components/home/board/BottomBoardItem';
import BottomBoardImageItem from '~/components/home/board/BottomBoardImageItem';

import LayerPopup from '~/components/home/layerp/LayerPopup';

import bettingWinnerModalMixin from '~/mixins/betting-winner-modal-mixin';
import bettingMixin from '~/mixins/hitgame/betting';

import betSaveCookieMixin from '~/mixins/hitgame/betting/cookie';

/** get main data */
const { mapGetters: mainGetters } = createNamespacedHelpers('main');

/** get betting list */
const {
  mapState: mainGameListState,
  mapGetters: mainGameListGetters,
  mapActions: mainGameListActions,
} = createNamespacedHelpers('main/betting');

/** get game result */
const {
  mapState: matchResultState,
  mapGetters: matchResultGetters,
  mapActions: matchResultActions,
} = createNamespacedHelpers('gamecenter/results');

/** bottom menus */
const { mapState: newsMenusState } = createNamespacedHelpers('home/news/menu');
const { mapState: communityMenusState } = createNamespacedHelpers(
  'home/community/menu'
);

const {
  mapState: communityHomeState,
  mapActions: communityHomeActions,
} = createNamespacedHelpers('home/community/list');

let gameLoadInterval = null;

export default {
  auth: false,
  components: {
    BannerComp,
    TitleMoreComp,
    MatchResultContainer,
    MatchResultItem,
    BottomBoardContainer,
    BottomBoardItem,
    BottomBoardImageItem,
    LayerPopup,
  },
  mixins: [bettingWinnerModalMixin, bettingMixin, betSaveCookieMixin],
  data() {
    return {
      mainBannerDummy,
      gameList: [],
      selectedMatchResultSport: null,
      currentMRSport: null,
      newsPath: null,
      communityPath: null,
    };
  },
  computed: {
    ...mainGetters([
      'getNotices',
      'getUpdates',
      'getEvents',
      'getPress',
      'getBanners',
      'getLayerPopup',
      'getAnalysises',
      'getFreeboards',
      'getSpomedia',
      'getHitList',
      'hasSurvey',
    ]),
    ...mainGameListState({
      gameLoading: 'loading',
      subscribed: 'subscribed',
    }),
    ...mainGameListGetters([
      'getGameCount',
      'getOpenedGames',
      'getClosedGames',
    ]),
    ...matchResultState({
      hasMatchResults: 'success',
      matchResults: 'items',
      loadingMR: 'loading',
    }),
    ...matchResultGetters({
      getMatchResultHasAnalysis: 'getResultsHasAnalysis',
    }),
    ...newsMenusState({ newsMenus: 'menus' }),
    ...communityMenusState({ communityMenus: 'menus' }),
    ...communityHomeState({
      hasCommunity: 'success',
      communityMessages: 'messsage',
      communityError: 'error',
      communityItems: 'items',
      communityLoading: 'loading',
    }),
    getNewsItems() {
      const { newsPath } = this;
      if (newsPath === 'update') {
        return this.getUpdates;
      }
      if (newsPath === 'event') {
        return this.getEvents;
      }
      if (newsPath === 'press') {
        return this.getPress;
      }
      return this.getNotices;
    },
    getCommunityItems() {
      const { communityPath } = this;
      if (communityPath === 'free') {
        return this.getFreeboards;
      }
      return this.getAnalysises;
    },
  },
  watch: {
    getGameCount(newValue, oldValue) {
      if (!oldValue && oldValue >= 0) {
        return;
      }
      this.gameList = this.getOpenedGames(new Date().getTime());
    },
  },
  beforeMount() {
    const { newsMenus, communityMenus } = this;
    {
      const { path, pageSize } = newsMenus[0];
      this.newsPath = path;
    }
    {
      const { path, pageSize } = communityMenus[0];
      this.communityPath = path;
    }
  },
  async mounted() {
    this.subscribeMain();
    const swiper = new Swiper('.swiper-container', {
      loop: true,
      autoplay: {
        delay: 9700,
        disableOnInteraction: false,
      },
      speed: 300,
      pagination: {
        el: '.pagination',
        type: 'fraction',
      },
      navigation: {
        nextEl: '.button-next',
        prevEl: '.button-prev',
      },
    });
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
      const noDisplaySurvey = this.$cookies.get(
        COOKIE_KEY_NO_DISPLAY_SURVEY_TODAY
      );
      if (this.hasSurvey && !noDisplaySurvey) {
        this.showHasSurveyModal({
          image: '/images/20210407_survey.png',
          description: '기간 : 2021. 04. 07. ~ 04. 11.',
          onConfirm: () => {
            this.showSurveyModal();
          },
          onConfirmText: '설문참여',
          onCancelText: '닫기',
        });
      }
      if (this.getHitList.length > 0) {
        this.showBettingWinnerModal(this.getHitList);
      }
      if (!this.$cookies.get(COOKIE_KEY_NO_DISPLAY_NEW_MESSAGE_TODAY)) {
        if (parseInt(this.$auth.user.memo_not_read) > 0) {
          this.$modal.show(NewMessagesModal, null, NMM_MODAL_OPTIONS);
        }
      }
    }
    this.gameList = this.getOpenedGames(new Date().getTime());
    this.setGameLoadInterval();
    await this.getMatchResults();
  },
  beforeDestroy() {
    this.clearGameLoadInterval();
    this.unsubscribeMain();
    this.clearGameList();
  },
  methods: {
    ...matchResultActions({
      getMatchResults: 'getResults',
    }),
    ...mainGameListActions({
      clearGameList: 'clear',
    }),
    ...communityHomeActions({
      getCommunityBoards: 'getBoards',
      clearCommunity: 'clear',
    }),
    setGameLoadInterval() {
      gameLoadInterval = setInterval(() => {
        if (!this.subscribed) {
          return;
        }
        this.gameList = this.getOpenedGames(new Date().getTime());
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
    async onChangeMRDate({ date }) {
      await this.getMatchResults(date);
    },
    onChangeMRSport({ sport }) {
      if (sport === null) {
        this.currentMRSport = null;
      } else {
        this.currentMRSport = this.getSportByValue(sport).code;
      }
    },
    getMatchResultBy(sportId) {
      if (sportId === null) {
        return this.getMatchResultHasAnalysis.slice(0, 9);
      }
      return this.getMatchResultHasAnalysis
        .filter((matchResult) => {
          return matchResult.SportId === sportId;
        })
        .slice(0, 9);
    },
    onNewsHomeChange(v) {
      this.newsPath = v.path;
    },
    onCommunityHomeChange(v) {
      this.communityPath = v.path;
    },
  },
};
</script>

<style scoped>
div.events {
  width: 920px;
  height: 190px;
  background-color: #2b2b2b;
  margin-bottom: 20px;
  border-radius: 10px;
}

div.events > div.wrapper {
  bottom: 20px;
  position: absolute;
  right: 20px;
  z-index: 1;
  display: inline-block;
}

/* div.events div.event-img {
  width: 100%;
  height: 100%;
}

div.events div.event-img p {
  color: transparent;
  display: none;
} */

div.pagination,
div.button-next,
div.button-prev {
  float: left;
  color: white;
}

div.button-next,
div.button-prev {
  width: 30px;
  height: 30px;
  background-color: #ffffff33;
  border-radius: 5px;
  align-items: center;
  display: flex;
  justify-content: center;
}

div.button-prev {
  margin-right: 2px;
}

div.pagination {
  align-items: center;
  display: flex;
  font-size: 12px;
  font-weight: 400;
  height: 30px;
  justify-content: center;
  margin-right: 10px;
  width: fit-content;
}

.icon-svg.next,
.icon-svg.prev {
  background-color: white;
}

.icon-svg.next {
  width: 12px;
  height: 12px;
  -webkit-mask-image: url(~assets/icons/main-swipe-next.svg);
  mask-image: url(~assets/icons/main-swipe-next.svg);
}

.icon-svg.prev {
  width: 12px;
  height: 12px;
  -webkit-mask-image: url(~assets/icons/main-swipe-prev.svg);
  mask-image: url(~assets/icons/main-swipe-prev.svg);
}

div.mr-blank-item,
div.no-has-match-result {
  width: 100%;
}

div.mr-blank-item {
  height: 40px;
}

div.mr-blank-item:first-child {
  border-radius: 0px 10px 0px 0px;
}

div.mr-blank-item:last-child {
  border-radius: 0px 0px 10px 0px;
}

div.mr-blank-item:nth-child(odd) {
  background-color: #f2f2f2;
}
div.mr-blank-item:nth-child(even) {
  background-color: transparent;
}

div.no-has-match-result {
  height: 360px;
  background-color: #f2f2f2;
  color: #888888;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  border-radius: 0px 10px 10px 0px;
}
div.info > div {
  transform: skew(-0.03deg);
}

img.campain_banner {
  width: 920px;
  margin-bottom: 20px;
}
</style>
