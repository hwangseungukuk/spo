/* eslint-disable no-unused-expressions */
import { createNamespacedHelpers } from 'vuex';

import liveCommonMixin from '~/mixins/hitgame/live';

import betSaveCookieMixin from '~/mixins/hitgame/betting/cookie';

const {
  mapState: liveGameState,
  mapGetters: liveGameGetters,
} = createNamespacedHelpers('gamecenter/betting/list/live');

const {
  mapState: liveGameDetailState,
  mapGetters: liveGameDetailGetters,
  mapActions: liveGameDetailActions,
} = createNamespacedHelpers('gamecenter/betting/list/live/detail');

const {
  mapGetters: bettingCartGetters,
  mapActions: bettingCartActions,
} = createNamespacedHelpers('gamecenter/betting/cart');

const COL_TYPE = [
  {
    text: '전체',
    value: '__all',
  },
  {
    text: '승무패',
    value: '1x2',
  },
  {
    text: '핸디캡',
    value: 'handicap',
  },
  {
    text: 'U/O',
    value: 'total',
  },
];

const gameSort = (a, b) => {
  if (a.DisplayPriority > b.DisplayPriority) {
    return 1;
  }
  if (a.DisplayPriority < b.DisplayPriority) {
    return -1;
  }
  return 0;
};

export default {
  mixins: [liveCommonMixin, betSaveCookieMixin],
  data() {
    return {
      COL_TYPE,
      MatchId: parseInt(this.$route.params.id),
      gameInfo: null,
      gameTypeList: {},
      contentList: {},
      selectedColType: null,
      selectedMarketId: null,
      _setMatchTracker: false,
    };
  },
  computed: {
    ...bettingCartGetters({
      getSelectedBetItems: 'getSelectedItems',
    }),
    ...liveGameState({
      connected: 'connected',
      connecting: 'connecting',
      games: 'games',
    }),
    ...liveGameGetters(['hasGames', 'getGame']),
    ...liveGameDetailState({
      loadingDetail: 'loading',
      detail: 'detail',
    }),
    ...liveGameDetailGetters({
      getActiveMarkets: 'getActiveMarkets',
      getActiveGameMarketIds: 'getActiveGameMarketIds',
      getGamesWithMarketIds: 'getGamesWithMarketIds',
      getGamesWithMarketId: 'getGamesWithMarketId',
      getSpecifiers: 'getSpecifiers',
    }),
    hasGameContents() {
      return Object.values(this.contentList).length > 0;
    },
    isShowMatchTracker() {
      const { gameInfo } = this;
      if (!gameInfo || gameInfo === null) {
        return false;
      }
      const { SportId, TournamentId } = gameInfo;
      // 25 : MLB
      return SportId !== 3 || (SportId === 3 && TournamentId === 25);
    },
  },
  watch: {
    games(v) {
      this.gameInfo = this.getGame(this.MatchId);
    },
    selectedColType(v) {
      this.contentList = this.load();
    },
    selectedMarketId() {
      this.contentList = this.load();
    },
    detail(v) {
      if (v === null) {
        return;
      }
      this.gameTypeList = this.getActiveMarkets
        .map(({ id, specifiers, specifiersOrigin }) => {
          const MarketIdName = this.getMarketTypeLabel(
            this.gameInfo.SportId,
            id,
            specifiers
          );
          if (!MarketIdName) {
            return undefined;
          }
          return {
            MarketId: id,
            MarketIdName,
            Specifiers: specifiers,
            SpecifiersOrigin: specifiersOrigin,
            DisplayPriority: this.getLiveGameDisplayPriority(
              this.gameInfo.SportId,
              id
            ),
          };
        })
        .filter((item) => item !== undefined)
        .sort(gameSort);
      this.contentList = this.load();
      if (this.isShowMatchTracker && !this._setMatchTracker) {
        this.loadMatchTracker();
      }
    },
    gameInfo(v, old) {
      if (v === null) {
        this.gameInfo = old;
      }
    },
    isShowMatchTracker(v) {
      console.log('isShowMatchTracker watch', v);
      if (!v) {
        return;
      }
      if (this._setMatchTracker) {
        return;
      }
      this.loadMatchTracker();
    },
    $route(v) {
      if (!v.params || !v.params.id) {
        this.showNoHasMatchData();
        return;
      }
      this.unsubscribeLiveDetail();
      this.removeMatchTracker();
      this._setMatchTracker = false;

      const newMatchId = parseInt(v.params.id);
      if (this.MatchId === newMatchId) {
        return;
      }
      this.MatchId = newMatchId;
      this.selectedColType = COL_TYPE[0].value;
      this.selectedMarketId = null;

      this.clear();
      this.gameInfo = this.getGame(this.MatchId);
      if (this.gameInfo === null) {
        this.showNoHasMatchData();
      } else {
        this.subscribeLiveDetail(this.MatchId);
      }
    },
    connected(v) {
      if (this.connecting) {
        return;
      }
      if (!v) {
        return;
      }
      this.gameInfo = this.getGame(this.MatchId);
      if (this.gameInfo === null) {
        this.showNoHasMatchData();
      } else {
        this.subscribeLiveDetail(this.MatchId);
      }
    },
  },
  beforeMount() {
    if (this.connected) {
      this.gameInfo = this.getGame(this.MatchId);
      if (this.gameInfo === null) {
        this.showNoHasMatchData();
      } else {
        this.subscribeLiveDetail(this.MatchId);
      }
    }
  },
  mounted() {
    if (!this.$auth.loggedIn) {
      return;
    }
    const isPopup = this.$route.name.includes('popup');
    if (isPopup) {
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
  beforeDestroy() {
    this.$timestamp.$off('timestamp');
    this.clear();
    this.unsubscribeLiveDetail();
  },
  methods: {
    ...bettingCartActions({
      addBettingItem: 'addItem',
      removeBettingItem: 'removeItem',
    }),
    ...liveGameDetailActions({
      subscribeLiveDetail: 'subscribe',
      unsubscribeLiveDetail: 'unsubscribe',
      betting: 'betting',
      clear: 'clear',
    }),
    load() {
      const { selectedColType, selectedMarketId } = this;
      if (selectedColType !== null && selectedColType !== COL_TYPE[0].value) {
        const ids = this.getLiveMarketIdsColType(
          this.gameInfo.SportId,
          selectedColType
        );
        return this._decorateList(this.getGamesWithMarketIds(ids));
      }
      if (selectedMarketId !== null) {
        const { MarketId, SpecifiersOrigin } = JSON.parse(selectedMarketId);
        return this._decorateList([
          this.getGamesWithMarketId(MarketId, SpecifiersOrigin),
        ]);
      }
      return this._decorateList(this.getActiveMarkets);
    },
    _decorateList(results) {
      console.log('_decorateList', results);
      return results
        .map((content) => {
          const MarketIdName = this.getMarketTypeLabel(
            this.gameInfo.SportId,
            content.id,
            content.specifiers
          );
          if (!MarketIdName) {
            return undefined;
          }
          return {
            ...content,
            // MarketId: id,
            MarketIdName,
            // Specifiers: specifiers,
            DisplayPriority: this.getLiveGameDisplayPriority(
              this.gameInfo.SportId,
              content.id
            ),
          };
        })
        .filter((content) => content !== undefined)
        .sort(gameSort);
    },
    loadMatchTracker() {
      console.log('loadMatchTracker');
      setTimeout(async () => {
        // eslint-disable-next-line no-undef
        await SIR('addWidget', '.match-tracker-area', 'match.lmtPlus', {
          layout: 'double',
          scoreboard: 'disable',
          matchId: this.MatchId,
          disablePitchOverlay: true,
          disablePitchSpotlights: true,
          tabsPosition: 'top',
        });
        this._setMatchTracker = true;
      }, 500);
    },
    async removeMatchTracker() {
      console.log('removeMatchTracker');
      // eslint-disable-next-line no-undef
      await SIR('removeWidget', '.match-tracker-area');
    },
    getMarketTypeLabel(SportId, MarketId, Specifiers) {
      // eslint-disable-next-line prettier/prettier
      const marketInfo = this.getLiveGameInfosMarketId(SportId, MarketId);
      if (marketInfo) {
        return this._decorate(marketInfo.MarketIdName, Specifiers);
      }
      return undefined;
    },
    decorateOutcome(SportId, MarketId, outcome, specifiers) {
      const founded = this.getMarketInfoTemplate(SportId, MarketId, outcome.id);
      if (!founded) {
        return 'NO TEMPLATE';
      }
      return this._decorate(founded.OutomeIdName, specifiers);
    },
    _decorate(label, specifiers) {
      if (!label || label === null) {
        return;
      }
      let result = label;
      if (specifiers) {
        for (const key of Object.keys(specifiers)) {
          result = result.replace(`{${key}}`, specifiers[key]);
        }
      }
      result = result.replace(
        /\{\$competitor1\}/g,
        this.getTeamName(
          this.gameInfo.HomeTeam_UniqueId,
          this.gameInfo.HomeTeam
        )
      );
      result = result.replace(
        /\{\$competitor2\}/g,
        this.getTeamName(
          this.gameInfo.AwayTeam_UniqueId,
          this.gameInfo.AwayTeam
        )
      );
      return result;
    },
    onColTypeChange(v) {
      this.selectedColType = v;
      if (v !== null) {
        this.selectedMarketId = null;
      }
    },
    onMarketIdChange() {
      this.selectedColType = null;
    },
    onBettingItemClick(v) {
      if (v.selected) {
        this.removeBettingItem(v);
        return;
      }
      const item = {
        ...v,
        game: 'live',
        MatchDate: this.gameInfo.MatchDate,
      };
      console.log(item);
      this.addBettingItem(item);
    },
    showNoHasMatchData() {
      this.showSingleButtonModal({
        message: '경기 정보를 가져올 수 없습니다.',
        description: '경기가 종료되거나, 중단되었습니다.',
        onConfirm: () => {
          this.$router.push({ name: 'hitgame-live' });
        },
      });
    },
  },
};
