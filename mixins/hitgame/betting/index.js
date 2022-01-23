import { createNamespacedHelpers } from 'vuex';

import BettingLeagueContainer from '~/components/hitgame/bettings/BettingLeagueContainer';

import BettingItem from '~/components/hitgame/bettings/BettingItemNew';
import BettingButtonDummy from '~/components/hitgame/bettings/BettingButtonDummy';
import BettingItemButtonGroup from '~/components/hitgame/bettings/BettingItemButtonGroupNew';
import BettingGameButton from '~/components/hitgame/BettingGameButton';

/** adding betting item */
const {
  mapGetters: bettingCartGetters,
  mapActions: bettingCartActions,
} = createNamespacedHelpers('gamecenter/betting/cart');

const { mapGetters: gameStatusGetters } = createNamespacedHelpers(
  'mapper/game-status'
);

export default {
  components: {
    BettingLeagueContainer,
    BettingItem,
    BettingButtonDummy,
    BettingItemButtonGroup,
    BettingGameButton,
  },
  computed: {
    ...bettingCartGetters({
      getSelectedBetItems: 'getSelectedItems',
    }),
    ...gameStatusGetters({ getGameStatus: 'getStatus' }),
    isSelectedBetItem() {
      return (item) => {
        const { SRSMarketId, SRSMarketType, AllottedValue, OutcomeId } = item;
        const checkAllottedValue =
          AllottedValue !== null ? AllottedValue : undefined;
        const target = `${SRSMarketId}/${SRSMarketType}/${checkAllottedValue}/${OutcomeId}`;
        return this.getSelectedBetItems.includes(target);
      };
    },
  },
  methods: {
    ...bettingCartActions({
      addBettingItem: 'addItem',
      removeBettingItem: 'removeItem',
    }),
    openMatchInfo(bMatchId) {
      const options =
        'top=100, left=100, width=710, height=655, status=no, menubar=no, toolbar=no, resizable=no, scrollbars=no';
      const url = `https://s5.sir.sportradar.com/spolive/ko/match/${bMatchId}`;
      window.open(url, 'spolive_match_info', options);
    },
    openAnalysisUrl(bMatchId) {
      // const options =
      //   'top=100, left=100, width=710, height=655, status=no, menubar=no, toolbar=no, resizable=no, scrollbars=no';
      // const url = `https://stats.betradar.com/s4/?clientid=1771&matchid=${bMatchId}&language=ko&timezone=Asia/Tokyo`;
      // window.open(url, 'spolive_analysis', options);
      this.showSingleButtonModal({
        message: '준비 중입니다.',
        description: null,
      });
    },
    openBroadCast(id) {
      // const options =
      //   'top=100, left=100, width=710, height=655, status=no, menubar=no, toolbar=no, resizable=no, scrollbars=no';
      // const url = `${process.env.SRS_URL}/Match/${id}/broadcast`;
      // window.open(url, 'spolive_broadcast', options);
      this.showSingleButtonModal({
        message: '준비 중입니다.',
        description: null,
      });
    },
    spliceGames(games, start) {
      return games.splice(start);
    },
    getHandicapLabel(allotted) {
      return `H${allotted >= 0 ? '+' : ''}${allotted}`;
    },
    getCollapingList(gameList) {
      if (gameList.length <= 1) {
        return gameList;
      }
      const list = JSON.parse(JSON.stringify(gameList)).slice(1);
      list.sort((a, b) => {
        if (a.AllottedValue > b.AllottedValue) {
          return 1;
        }
        if (a.AllottedValue < b.AllottedValue) {
          return -1;
        }
        return 0;
      });
      return list;
    },
    _onBetItemClick(item, game, type) {
      if (item.selected) {
        this.removeBettingItem({ ...item, SportId: game.SportId, id: game.id });
        return;
      }
      const gameItem = {
        ...item,
        SportId: game.SportId,
        id: game.id,
        MatchDate: game.MatchDate,
        MatchInfo:
          `${this.getTeamName(game.HomeTeam_UniqueId, game.HomeTeam_Name)}` +
          ' VS ' +
          `${this.getTeamName(game.AwayTeam_UniqueId, game.AwayTeam_Name)}`,
        crossBetting: this.isCanCrossBetting(game.SportId),
      };
      console.log(gameItem);
      this.addBettingItem({ game: type, ...gameItem });
    },
  },
};
