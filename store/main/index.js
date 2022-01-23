import moment from 'moment';
import { GET_MAIN_DATA } from '~/store/mutation-types';

let axiosCancelSource = null;

const state = () => ({
  success: false,
  message: null,
  error: null,
  data: null,
  loading: false,
});

const getters = {
  isDataNull: (state) => {
    return state.data === null;
  },
  getTopNotices: (state, getters) => {
    if (getters.isDataNull) {
      return [];
    }
    return state.data.top_notice;
  },
  getBbs: (state, getters) => {
    if (getters.isDataNull) {
      return [];
    }
    return state.data.bbs;
  },
  getNotices: (state, getters) => {
    if (getters.isDataNull) {
      return [];
    }
    return getters.getBbs.notice.map((item) => {
      return parseBoard(item);
    });
  },
  getUpdates: (state, getters) => {
    if (getters.isDataNull) {
      return [];
    }
    return getters.getBbs.update.map((item) => {
      return parseBoard(item);
    });
  },
  getEvents: (state, getters) => {
    if (getters.isDataNull) {
      return [];
    }
    return getters.getBbs.event.map((item) => {
      return parseBoard(item);
    });
  },
  getPress: (state, getters) => {
    if (getters.isDataNull) {
      return [];
    }
    return getters.getBbs.press.map((item) => {
      return parseBoard(item);
    });
  },
  getAnalysises: (state, getters) => {
    if (getters.isDataNull) {
      return [];
    }
    return getters.getBbs.analysis_new.map((item) => {
      return parseBoard(item);
    });
  },
  getFreeboards: (state, getters) => {
    if (getters.isDataNull) {
      return [];
    }
    return getters.getBbs.free.map((item) => {
      return parseBoard(item);
    });
  },
  getSpomedia: (state, getters) => {
    if (getters.isDataNull) {
      return [];
    }
    return state.data.bbs_gallery.spomedia;
  },
  getBanners: (state, getters) => {
    if (getters.isDataNull) {
      return [];
    }
    return state.data.main_banner;
  },
  getLayerPopup: (state, getters) => {
    if (getters.isDataNull) {
      return [];
    }
    return state.data.layer_popup;
  },
  getHitList: (state, getters) => {
    if (getters.isDataNull) {
      return [];
    }
    return state.data.hitlist.map((item) => {
      return parseHittedItem(item);
    });
  },
  hasSurvey: (state, getters) => {
    if (getters.isDataNull) {
      return false;
    }
    return state.data.survey;
  },
};

const mutations = {
  [GET_MAIN_DATA](state, { success, message, error, data }) {
    state.success = success || false;
    state.message = message || null;
    state.error = error || null;
    state.data = data || null;
    state.loading = false;
  },
  loading(state) {
    state.loading = true;
  },
  clear() {
    state.success = false;
    state.message = null;
    state.error = null;
    state.data = null;
    state.loading = false;
  },
};

const actions = {
  async getMainData({ commit }) {
    try {
      if (axiosCancelSource !== null) {
        await axiosCancelSource.cancel();
      }
      axiosCancelSource = await this.$axios.CancelToken.source();
      commit('clear');
      commit('loading');
      const response = await this.$axios.$get(
        '/api/main/latest.php?spomedia_count=3',
        {
          cancelToken: axiosCancelSource.token,
        }
      );
      const { result, msg, data } = response;
      const success = result === 'OK';
      commit(GET_MAIN_DATA, {
        success,
        message: success ? null : msg,
        data: success ? data : null,
      });
    } catch (e) {
      if (this.$axios.isCancel(e)) {
        return;
      }
      commit(GET_MAIN_DATA, { success: false, error: e });
    }
  },
};

const parseBoard = (board) => {
  return {
    ...board,
    datetime: moment(board.wr_datetime, 'YYYY-MM-DD HH:mm:ss').toDate(),
  };
};

const parseHittedItem = (item) => {
  return {
    ...item,
    TournamentId: parseInt(item.TournamentId),
    HomeTeam_UniqueId: parseInt(item.HomeTeam_UniqueId),
    HomeTeam_Score: parseInt(item.HomeTeam_Score),
    AwayTeam_UniqueId: parseInt(item.AwayTeam_UniqueId),
    AwayTeam_Score: parseInt(item.AwayTeam_Score),
  };
};

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions,
};
