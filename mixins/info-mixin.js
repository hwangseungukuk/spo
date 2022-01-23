import { createNamespacedHelpers } from 'vuex';

const { mapGetters: _infoGetters } = createNamespacedHelpers('mapper/info');

export default {
  computed: {
    ..._infoGetters({
      getLiveMarketIdsColType: 'getMarketIdsColType',
      getLiveGameInfosMarketId: 'getGameInfosMarketId',
      getLiveGameInfosMarketIds: 'getGameInfosMarketIds',
      getLiveGameInfo: 'getGameInfo',
      getLiveGameInfos: 'getGameInfos',
      getLiveGameDisplayPriority: 'getDisplayPriority',
      getSportLeagues: 'getLeagues',
      getSportLeagueName: 'getLeagueName',
      getSportLeaguesCount: 'getLeaguesCount',
      _getTeamName: '_getTeamName',
      getMarketIdName: 'getMarketIdName',
      getMarketInfoTemplate: 'getMarketInfoTemplate',
      getMatchStatusText: 'getMatchStatusText',
    }),
  },
  methods: {
    getTeamName(UniqueId, DataName) {
      const result = this._getTeamName(UniqueId);
      if (result === null) {
        return DataName;
      }
      return result;
    },
  },
};
