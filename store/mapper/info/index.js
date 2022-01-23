import { LABEL_GET_INFO } from '~/store/mutation-types';

let axiosCancelSource = null;

const state = () => ({
  success: false,
  error: null,
  message: null,
  data: null,
});

const mutations = {
  [LABEL_GET_INFO](state, { success, message, error, data }) {
    state.success = success || false;
    state.message = message || null;
    state.error = error || null;
    state.data = data || null;
  },
  clear(state) {
    state.success = false;
    state.error = null;
    state.message = null;
    state.data = null;
  },
};

const getters = {
  getMarketIdsColType: ({ data }) => (SportId, ColType) => {
    if (data === null || !data.MARKETINFO) {
      return [];
    }
    const result = data.MARKETINFO.filter(
      (info) => info.ColType.includes(ColType) && info.SportId === SportId
    ).map((r) => r.MarketId);
    return [...new Set(result)];
  },
  getGameInfosMarketIds: ({ data }) => (SportId, MarketIds) => {
    if (data === null || !data.MARKETINFO) {
      return {};
    }
    const result = {};
    data.MARKETINFO.filter((info) => info.SportId === SportId).map((info) => {
      if (MarketIds.includes(info.MarketId)) {
        if (!result[info.MarketId]) {
          result[info.MarketId] = {};
        }
        result[info.MarketId] = {
          ColType: info.ColType,
          MarketIdName: info.MarketIdName,
          DisplayPriority: info.DisplayPriority,
          MarketId: info.MarketId,
        };
      }
    });
    return result;
  },
  getGameInfosMarketId: ({ data }, getters) => (SportId, MarketId) => {
    const result = getters.getGameInfosMarketIds(SportId, [MarketId]);
    if (result === null) {
      return null;
    }
    return result[MarketId];
  },
  getGameInfos: ({ data }) => (SportId) => {
    if (data === null || !data.MARKETINFO) {
      return {};
    }
    const result = {};
    data.MARKETINFO.filter((info) => info.SportId === SportId).map((info) => {
      if (!result[info.MarketId]) {
        result[info.MarketId] = null;
      }
      if (result[info.MarketId] === null) {
        result[info.MarketId] = info.MarketIdName;
      }
    });
    return result;
  },
  getGameInfo: (state, getters) => (SportId, MarketId) => {
    const result = getters.getGameInfos(SportId)[MarketId];
    return result || null;
  },
  getPenalty: ({ data }) => (size) => {
    if (data === null || !data.FOLDER) {
      return 1;
    }
    const penalty = data.FOLDER[size];
    if (!penalty) {
      return 1;
    }
    return (100 - penalty) / 100;
  },
  getLeagueName: ({ data }) => (TournamentId) => {
    if (data === null || !data.LEAGUESTRING) {
      return `NULL(${TournamentId})`;
    }
    const result = data.LEAGUESTRING.find(
      (league) => league.TournamentId === TournamentId
    );
    if (!result) {
      return `NULL(${TournamentId})`;
    }
    return result.TournamentName;
  },
  getLeagues: ({ data }) => (SportId) => {
    if (data === null || !data.LEAGUESTRING) {
      return null;
    }
    return data.LEAGUESTRING.filter((league) => league.SportId === SportId);
  },
  getLeaguesCount: ({ data }, getters) => (SportId) => {
    const leagues = getters.getLeagues(SportId);
    if (!leagues || leagues === null) {
      return 0;
    }
    return leagues.length;
  },
  getMarketIdName: ({ data }) => (SportId, MarketId) => {
    if (data === null || !data.MARKETINFO) {
      return null;
    }
    const result = data.MARKETINFO.find(
      (info) => info.MarketId === MarketId && info.SportId === SportId
    );
    if (!result) {
      return null;
    }
    return result.MarketIdName;
  },
  getMarketInfoTemplate: ({ data }) => (SportId, MarketId, OutcomeId) => {
    if (data === null || !data.MARKETINFO) {
      return null;
    }
    const result = data.MARKETINFO.find(
      (info) =>
        info.MarketId === MarketId &&
        info.OutomeId === OutcomeId &&
        info.SportId === SportId
    );
    if (!result) {
      return null;
    }
    return result;
  },
  getMatchStatus: ({ data }) => (Code) => {
    if (data === null || !data.MATCHSTATUS) {
      return null;
    }
    const result = data.MATCHSTATUS.find((status) => status.Code === Code);
    if (!result) {
      return null;
    }
    return result;
  },
  getMatchStatusText: ({ data }, getters) => (Code) => {
    const result = getters.getMatchStatus(Code);
    if (!result) {
      return null;
    }
    return result.Name;
  },
  getDisplayPriority: ({ data }) => (SportId, MarketId, OutcomeId) => {
    if (data === null || !data.MARKETINFO) {
      return 0;
    }
    let result = null;
    if (OutcomeId) {
      result = data.MARKETINFO.find(
        (info) =>
          info.MarketId === MarketId &&
          info.OutomeId === OutcomeId &&
          info.SportId === SportId
      );
    } else {
      result = data.MARKETINFO.find(
        (info) => info.MarketId === MarketId && info.SportId === SportId
      );
    }
    if (!result) {
      return 0;
    }
    return result.DisplayPriority;
  },
  _getTeamName: ({ data }) => (TeamUniqueId) => {
    if (data === null || !data.TEAMSTRING) {
      return null;
    }
    const result = data.TEAMSTRING[TeamUniqueId];
    if (!result) {
      return null;
    }
    return result;
  },
};

const actions = {
  async getInfo({ commit }) {
    try {
      if (axiosCancelSource !== null) {
        await axiosCancelSource.cancel();
      }
      axiosCancelSource = await this.$axios.CancelToken.source();
      const result = await this.$axios.$get(
        `${process.env.SRS_CURRENT_URL}/r/info/ko`,
        {
          cancelToken: axiosCancelSource.token,
        }
      );
      commit(LABEL_GET_INFO, { success: true, data: result });
    } catch (error) {
      commit(LABEL_GET_INFO, { success: false, error });
    }
  },
  clear({ commit }) {
    commit('clear');
  },
};

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions,
};
