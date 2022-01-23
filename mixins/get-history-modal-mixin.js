import { createNamespacedHelpers } from 'vuex';

import ButtonTabs from '~/components/common/ButtonTabs';
import DatePicker from '~/components/common/DatePicker';

import HistoryItem from '~/components/hitgame/history/HistoryItem';
import HistoryCasualItem from '~/components/hitgame/history/HistoryCasualItem';

import SelectHistoriesModalHeader from '~/components/modals/histories/SelectHistoriesModalHeader';

import dateTermsMixin from '~/mixins/date-term-mixin';

const {
  mapState: bettingHistoryState,
  mapGetters: bettingHistoryGetters,
  mapActions: bettingHistoryActions,
} = createNamespacedHelpers('user/history/srs');

const {
  mapState: bettingStatStatus,
  mapGetters: bettingStatTypeGetters,
} = createNamespacedHelpers('mapper/betting-stat-type');

const { mapGetters: casualGamesGetters } = createNamespacedHelpers(
  'gamecenter/casual/menu'
);

const {
  mapState: casualHistoriesState,
  mapActions: casualHistoriesActions,
} = createNamespacedHelpers('user/history/casual');

const TAB_ITEMS = [
  {
    value: 'SRS',
    text: '승무패',
  },
  {
    value: 'Live',
    text: '라이브',
  },
  {
    value: 'Special',
    text: '스페셜',
  },
  {
    value: 'casual',
    text: '캐주얼',
  },
];

export default {
  components: {
    ButtonTabs,
    DatePicker,
    HistoryItem,
    HistoryCasualItem,
    SelectHistoriesModalHeader,
  },
  mixins: [dateTermsMixin],
  props: {
    onSelected: { type: Function, default: () => {} },
    isShareMode: { type: Boolean, deafult: false },
  },
  data() {
    return {
      TAB_ITEMS,
      type: null,
      status: null,
      term: 0,
      startAt: new Date(),
      endAt: new Date(),
      page: 1,
      selectedCasual: null,
    };
  },
  beforeMount() {
    this.type = TAB_ITEMS[0].value;
    this.term = `15/days`;
    this.startAt = this.$moment(this.endAt)
      .add(-1 * this.term.split('/')[0], this.term.split('/')[1] || 'days')
      .toDate();
    this.selectedCasual = this.getGamesForHistory[0].code;
  },
  mounted() {
    this._load();
  },
  computed: {
    ...casualGamesGetters(['getCasualDataWithCode', 'getGamesForHistory']),
    ...casualHistoriesState({
      hasCasualHistories: 'success',
      casualMessage: 'message',
      casualError: 'error',
      casualItems: 'items',
      casualLoading: 'loading',
      casualTotalItems: 'totalItems',
    }),
    ...bettingStatTypeGetters({
      getSearchStatusList: 'getSearchStatusList',
      getBettingStatus: 'getStatus',
      getBettingType: 'getType',
    }),
    ...bettingHistoryState({
      hasHistories: 'hasList',
      isFetched: 'success',
      message: 'message',
      error: 'error',
      histories: 'items',
      totalHistories: 'totalItems',
      bHLoading: 'loading',
      bHFetching: 'fetching',
    }),
    ...bettingHistoryGetters({
      getDrawIdItemDetails: 'getDrawIdItemDetails',
    }),
    getStatus() {
      return [
        {
          text: '전체',
          value: null,
        },
        ...this.getSearchStatusList.map((stat) => {
          return {
            text: stat.text,
            value: stat.code,
          };
        }),
      ];
    },
  },
  watch: {
    async hasHistories(v) {
      if (!v) {
        return;
      }
      await this.fetchHistory();
    },
    term(v) {
      const termArr = v.split('/');
      if (termArr[0] < 0) {
        return;
      }
      this.startAt = new Date();
      this.endAt = new Date();

      this.startAt = this.$moment(this.endAt)
        .add(-1 * termArr[0], termArr[1] || 'days')
        .toDate();
    },
    async selectedCasual(v) {
      if (this.type !== 'casual') {
        return;
      }
      this.page = 1;
      this.clearCasualHistories();
      await this._loadCasual();
    },
  },
  methods: {
    ...bettingHistoryActions({
      getHistories: 'getList',
      fetchHistory: 'fetch',
      clearBetsHistories: 'clearAll',
    }),
    ...casualHistoriesActions({
      getCasualHistories: 'getList',
      clearCasualHistories: 'clear',
    }),
    async onStatusChange(e) {
      const { value } = e.target;
      if (value === null || value.length <= 0) {
        this.status = null;
      } else {
        this.status = value;
      }
      await this._load();
    },
    async onChangeType(v) {
      await this._onChangeType(v);
    },
    async _onChangeType(v) {
      this.type = v;
      this.page = 1;
      this.term = '15/days';
      this.endAt = new Date();
      this.startAt = this.$moment(this.endAt).add(-15, 'days').toDate();
      this.status = null;
      if (this.type === 'casual') {
        this.clearBetsHistories();
        await this._loadCasual();
      } else {
        this.clearCasualHistories();
        this._load();
      }
    },
    async onPageChange(v) {
      if (this.type === 'casual') {
        await this._loadCasual(v);
      } else {
        this._load(v);
      }
    },
    onStartAtChange(v) {
      if (v.getTime() > this.endAt.getTime()) {
        const d = new Date();
        d.setHours(0);
        d.setMinutes(0);
        d.setSeconds(0);
        d.setUTCMilliseconds(0);
        this.startAt = d;
        return;
      }
      this.startAt = v;
    },
    onEndAtChange(v) {
      if (v.getTime() < this.startAt.getTime()) {
        const d = new Date();
        d.setHours(0);
        d.setMinutes(0);
        d.setSeconds(0);
        d.setUTCMilliseconds(0);
        this.endAt = d;
        return;
      }
      this.endAt = v;
    },
    onSelectClick(v) {
      this.onSelected(v, () => {
        this.$emit('close');
      });
    },
    onSearchClick() {
      this.page = 1;
      this._load();
    },
    _load(page) {
      const { type, startAt, endAt, status } = this;
      this.getHistories({
        type,
        startAt,
        endAt,
        page: page || this.page,
        status,
      });
    },
    async _loadCasual(page) {
      const { selectedCasual } = this;
      await this.getCasualHistories({
        code: selectedCasual,
        page: page || this.page,
      });
    },
  },
};
