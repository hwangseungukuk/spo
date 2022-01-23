import {
  GET_CANCELABLE_CART_ITEMS,
  FETCH_CANCELABLE_CART_ITEMS,
} from '~/store/mutation-types';

const state = () => ({
  hasList: false,
  hasDetail: false,
  items: [],
});

const mutations = {
  [GET_CANCELABLE_CART_ITEMS](state, { success, items }) {
    state.hasList = success || false;
    state.items = items || [];
  },
  [FETCH_CANCELABLE_CART_ITEMS](state, { hasDetail, details }) {
    state.hasDetail = hasDetail || false;
    state.items = state.items.map((item) => {
      const filter = details.filter((detail) => detail.DrawId === item.DrawId);
      if (filter.length > 0) {
        return {
          ...item,
          details: filter,
        };
      } else {
        return {
          ...item,
        };
      }
    });
  },
  clear(state) {
    state.hasList = false;
    state.hasDetail = false;
    state.items = [];
  },
  setHasDetailFalse(state) {
    state.hasDetail = false;
  },
};

const getters = {
  getDetails: (state) => (id) => {
    const result = state.items.find((item) => {
      return item.DrawId === id;
    });
    if (result) {
      return result.details;
    } else {
      return [];
    }
  },
};

const actions = {
  getCancelableItems({ commit, dispatch }, date) {
    commit('clear');
    dispatch(
      'gamecenter/betting/ws/getCartHistory',
      {
        date,
      },
      { root: true }
    );
  },
  fetchCancelableItem({ commit, dispatch }, { type, id }) {
    commit('setHasDetailFalse');
    dispatch(
      'gamecenter/betting/ws/getCartItemDetail',
      {
        type,
        id,
      },
      { root: true }
    );
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
