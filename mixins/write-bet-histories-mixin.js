import { createNamespacedHelpers } from 'vuex';

const {
  mapState: _betsState,
  mapActions: _betsActions,
} = createNamespacedHelpers('community/detail/bets');

const { mapGetters: _casualGamesGetters } = createNamespacedHelpers(
  'gamecenter/casual/menu'
);

const { mapGetters: _bettingStatTypeGetters } = createNamespacedHelpers(
  'mapper/betting-stat-type'
);

export default {
  data() {
    return {
      bets: null,
    };
  },
  computed: {
    ..._bettingStatTypeGetters({
      getSearchStatusList: 'getSearchStatusList',
      getBettingStatus: 'getStatus',
      getBettingType: 'getType',
    }),
    ..._betsState({
      _hasBets: 'success',
      _betsMessage: 'message',
      _betsError: 'error',
      betHistories: 'items',
    }),
    ..._casualGamesGetters(['getCasualWithBets']),
  },
  beforeDestroy() {
    this.clearBets();
  },
  watch: {
    async bets(v) {
      if (v === null) {
        return;
      }
      if (v.length <= 0) {
        return;
      }
      await this.getBets(v);
    },
    _betsMessage(v) {
      if (v === null) {
        return;
      }
      this.showSingleButtonModal({
        message: '베팅내역을 가져올 수 없습니다.',
        description: v,
      });
    },
    _betsError(v) {
      if (v === null) {
        return;
      }
      this.showSingleButtonModal({
        message: '베팅내역을 가져올 수 없습니다.',
        description: '오류가 발생하였습니다.',
      });
    },
  },
  methods: {
    ..._betsActions({
      getBets: 'getDetails',
      clearBets: 'clear',
    }),
    openHistoriesModal() {
      this.showSelectHistoriesModal({
        onSelected: ({ type, casual, list }) => {
          this.bets = this._getBetsStr({
            isHit: type !== 'casual',
            casual,
            list,
          });
        },
      });
    },
    _getBetsStr({ isHit, casual, list }) {
      if (list.length <= 0) {
        return null;
      }
      if (isHit) {
        const betArr = list.reduce((arr, item) => {
          return (arr = [...arr, `${item.type}/${item.id}`]);
        }, []);
        return `5::${betArr.join()}`;
      } else {
        const betArr = list.reduce((arr, item) => {
          return (arr = [...arr, item.id]);
        }, []);
        return `3:${casual}:${betArr.join()}`;
      }
    },
  },
};
