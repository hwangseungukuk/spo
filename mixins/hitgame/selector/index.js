import { createNamespacedHelpers } from 'vuex';

import SportLeaguesSelector from '~/components/hitgame/selector/SportLeaguesSelector';
import SelectorModal from '~/components/hitgame/selector/SportLeaguesSelectorModal';

const { mapGetters: sportsMapperGetters } = createNamespacedHelpers(
  'mapper/sports'
);

const { mapGetters: _srsListGetters } = createNamespacedHelpers(
  'gamecenter/betting/list/srs'
);

const { mapGetters: _specialListGetters } = createNamespacedHelpers(
  'gamecenter/betting/list/special'
);

const { mapGetters: _liveListGetters } = createNamespacedHelpers(
  'gamecenter/betting/list/live'
);

export const TYPE_SRS = 'srs';
export const TYPE_SPECIAL = 'special';
export const TYPE_LIVE = 'live';

export default {
  components: {
    SportLeaguesSelector,
    SelectorModal,
  },
  data() {
    return {
      sport: 0,
      showModal: false,
      filters: {
        leagues: {},
        selectedAll: {},
      },
      openLeagues: {},
    };
  },
  beforeDestroy() {
    this.$timestamp.$off('timestamp');
  },
  computed: {
    ..._srsListGetters({
      _getSrsOpenedLeagues: 'getOpenedLeagues',
    }),
    ..._specialListGetters({
      _getSpecialOpenedLeagues: 'getOpenedLeagues',
    }),
  },
  methods: {
    _clearFilter() {
      this.filters = {
        leagues: {},
        selectedAll: {},
      };
    },
    setOpenLeaguesObserver(type) {
      this.$timestamp.$on('timestamp', (v) => {
        if (type === TYPE_SPECIAL) {
          this.openLeagues = this._getSpecialOpenedLeagues(v);
          return;
        }
        this.openLeagues = this._getSrsOpenedLeagues(v);
      });
    },
    onSportClick(sport) {
      this.sport = sport;
      this.showModal = false;
    },
    onSelectorConfirmClick({ leagues, selectedAll }) {
      this.filters = {
        leagues: { ...leagues },
        selectedAll: { ...selectedAll },
      };
      if (
        Object.values(leagues).some((l) => l.length > 0) || // 리그 선택 있음.
        Object.values(selectedAll).some((v) => v) // 전체 리그 선택 있음.
      ) {
        this.sport = -1;
      } else {
        this.sport = 0;
      }
    },
  },
};
