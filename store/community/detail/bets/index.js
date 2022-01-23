import moment from 'moment';
import { COMMUNITY_GET_HISTORIES } from '~/store/mutation-types';

import {
  parseCasualHistory,
  parseHitgameHistory,
} from '~/util/hitgame/betted/parser';

let axiosCancelSource = null;

const state = () => ({
  success: false,
  message: null,
  error: null,
  items: [],
  loading: false,
});

const mutations = {
  [COMMUNITY_GET_HISTORIES](state, { success, message, error, items }) {
    state.success = success || false;
    state.message = message || null;
    state.error = error || null;
    state.items = items || [];
    state.loading = false;
  },
  loading(state) {
    state.loading = true;
  },
  clear(state) {
    state.success = false;
    state.message = null;
    state.error = null;
    state.items = [];
    state.loading = false;
  },
};

const actions = {
  async getDetails({ commit }, histories) {
    try {
      if (axiosCancelSource !== null) {
        await axiosCancelSource.cancel();
      }
      axiosCancelSource = await this.$axios.CancelToken.source();
      commit('loading');
      const isCasual = histories.startsWith('3:');
      let url = '/api/betting/hitlist.php';
      if (isCasual) {
        url += `?val=${histories}`;
      } else {
        url += `?getDraw=1&val=${histories.toUpperCase()}`;
      }
      const response = await this.$axios.$get(url, {
        cancelToken: axiosCancelSource.token,
      });
      const { result, msg, data } = response;
      const success = result === 'OK';
      commit(COMMUNITY_GET_HISTORIES, {
        success,
        message: success ? null : msg,
        items: success
          ? isCasual
            ? data.data.map((item) => parseCasualHistory(item))
            : parseHitgameHistories(data.data)
          : null,
      });
    } catch (e) {
      if (this.$axios.isCancel(e)) {
        return;
      }
      console.error(e);
    }
  },
  clear({ commit }) {
    commit('clear');
  },
};

const parseHitgameHistories = (items) => {
  const srsItems = Object.values(items)
    .map((item) => Object.values(item))
    .flat();
  return srsItems.map((item) => {
    console.log(item);
    return {
      ...item.draw,
      DrawId: parseInt(item.draw.DrawId),
      RefundingByUser: parseInt(item.draw.RefundingByUser),
      DateDrawn: moment(item.draw.DateDrawn, 'YYYY-MM-DD HH:mm:ss').toDate(),
      SpoGold: parseInt(item.draw.SpoGold) || 0,
      WinSpoGold: parseInt(item.draw.SpoGold) || 0,
      ExpectedWinSpoGold: parseInt(item.draw.ExpectedWinSpoGold) || 0,
      Odd: parseFloat(item.draw.Odd),
      details: item.detail.map((detail) => parseHitgameHistory(detail)),
    };
  });
};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
};
