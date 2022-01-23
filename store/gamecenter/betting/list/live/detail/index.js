import dummy from './live_detail_dummy';
import {
  GET_LIVE_GAME_DETAIL,
  CART_UPDATE_BETTING_ITEM,
} from '~/store/mutation-types';

const parseDetail = (detail) => {
  return {
    ...detail,
    MatchId: parseInt(detail.MatchId),
    bet_status: parseInt(detail.bet_status),
    Odds: detail.Odds
      ? detail.Odds.map((odd) => parseOdd(odd)).filter((odd) => {
          return odd.outcome ? odd.outcome.length > 0 : false;
        })
      : null,
  };
};

const parseOdd = (odd) => {
  return {
    ...odd,
    id: parseInt(odd.id),
    status: parseInt(odd.status),
    favourite: odd.favourite ? parseInt(odd.favourite) : null,
    alotted: odd.alotted ? (odd.alotted === '' ? null : odd.alotted) : null,
    specifiersOrigin: odd.specifiers ? odd.specifiers : null,
    specifiers: odd.specifiers ? parseSpecifiers(odd.specifiers) : null,
    outcome: odd.outcome
      ? odd.outcome.map((outcome) => ({
          ...outcome,
          active: parseInt(outcome.active),
          id: parseInt(outcome.id),
          odds: outcome.odds ? parseFloat(outcome.odds) : 0,
        }))
      : [],
  };
};

const parseSpecifiers = (specifiers) => {
  let result = {};
  const arr = specifiers.split('|');
  arr.map((i) => {
    const specifier = i.split('=');
    result = {
      ...result,
      [specifier[0]]: specifier[1],
    };
  });
  return result;
};

const state = () => ({
  loading: false,
  detail: null,
  // detail: parseDetail(dummy),
});

const mutations = {
  [GET_LIVE_GAME_DETAIL](state, { detail }) {
    state.detail = detail;
    state.loading = false;
    if (detail && detail !== null) {
      console.log('detail Match Id', detail.MatchId);
    }
    // if (state.detail === null) {
    //   state.detail = parseDetail(dummy);
    // }
  },
  loading(state) {
    state.loading = true;
  },
  clear(state) {
    state.loading = false;
    state.detail = null;
  },
};

const getters = {
  getActiveMarkets: (state) => {
    if (state.detail === null || state.detail.Odds === null) {
      return [];
    }
    return state.detail.Odds;
  },
  getActiveGameMarketIds: (state, getters) => {
    return getters.getActiveMarkets.map((r) => r.id);
  },
  getGamesWithMarketIds: (state, getters) => (MarketIds) => {
    return getters.getActiveMarkets.filter((odd) => MarketIds.includes(odd.id));
  },
  getGamesWithMarketId: (state, getters) => (MarketId, SpecifiersOrigin) => {
    console.log(MarketId);
    console.log(SpecifiersOrigin);
    return getters.getActiveMarkets.find((odd) => {
      return (
        odd.id === parseInt(MarketId) &&
        odd.specifiersOrigin === SpecifiersOrigin
      );
    });
  },
  getOddOutcome: (state, getters) => (MarketId) => {
    return getters.getActiveMarkets.filter((odd) => {
      return odd.id === parseInt(MarketId);
    });
  },
  getSpecifiers: (state, getters) => (MarketId) => {
    const result = getters.getGamesWithMarketId(MarketId);
    if (result === null) {
      return null;
    }
    return result.specifiers;
  },
};

let listener = null;

const actions = {
  subscribe({ commit, dispatch }, MatchId) {
    commit('loading');
    listener = (v) => {
      try {
        const parsed = JSON.parse(
          this.$LZString.decompressFromEncodedURIComponent(v)
        ); // decompressing data.
        const detail = parseDetail(parsed);
        if (detail && detail !== null && detail.MatchId !== MatchId) {
          return;
        }
        commit(GET_LIVE_GAME_DETAIL, {
          detail,
        });
        commit(
          `gamecenter/betting/cart/${CART_UPDATE_BETTING_ITEM}`,
          { updated: detail },
          {
            root: true,
          }
        );
      } catch (e) {
        console.error(e);
      }
    };
    dispatch(
      'gamecenter/betting/ws/subscribeLiveGameDetail',
      { listener, MatchId },
      {
        root: true,
      }
    );
  },
  unsubscribe({ commit, dispatch }) {
    dispatch('gamecenter/betting/ws/unsubscribeLiveGameDetail', listener, {
      root: true,
    });
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
