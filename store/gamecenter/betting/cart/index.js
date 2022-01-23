/* eslint-disable camelcase */
import {
  CART_ADD_BETTING_GAME,
  CART_REMOVE_BETTING_GAME,
  CART_REMOVE_ALL_GAMES,
  CART_REQ_BETTING_GAMES,
  CART_UPDATE_BETTING_ITEM,
} from '~/store/mutation-types';

// 일반 크로스 베팅의 경우, 선택한 각 경기의 배당률을 곱하여 지급됩니다.
// 축구, 아이스하키, 배구를 제외한 다른 종목 경기에서 승무패 * U/O, 핸디캡 * U/O 크로스 베팅이 가능합니다. (승무패 * 핸디캡은 불가능합니다.)

const CODE_BETTING_SUCCESSFUL = 200;

const state = () => ({
  success: false,
  code: -1,
  error: null,
  items: [],
  countSameBets: 0,
  isChanged: false,
  requesting: false,
  overItem: null,
});

const getters = {
  hasInactiveItems: (state) => {
    return state.items.some((item) => !item.Active);
  },
  getRate: (state, getters, rootState, rootGetters) => {
    if (state.items.length <= 0) {
      return 0;
    }
    const rate = state.items.reduce((rate, item) => {
      return (rate = rate * item.Rate);
    }, 1);
    if (state.items.some((item) => item.game === 'live')) {
      return rate;
    }
    if (state.items.some((item) => item.game === 'Special')) {
      return Math.floor(rate * 100) / 100;
    }
    const panalty = rootGetters['mapper/info/getPenalty'](state.items.length);
    let calcRate = panalty * rate;
    if (calcRate <= 1.01) {
      calcRate = 1.01;
    }
    calcRate = Math.floor(calcRate * 100) / 100;
    return calcRate;
  },
  getItemsType: (state) => {
    if (state.items.length <= 0) {
      return undefined;
    }
    return state.items[0].game;
  },
  getSize: (state) => {
    return state.items.length;
  },
  getSelectedItems: (state) => {
    return getSelectedItems(state);
  },
  hasGameOverItem: (state) => (timestamp) => {
    return state.items.some((item) => {
      if (item.game === 'live') {
        return false;
      }
      console.log(timestamp);
      console.log(item.MatchDate.getTime());
      return timestamp >= item.MatchDate.getTime();
    });
  },
};

const getSelectedItems = ({ items }) => {
  const isLive = items.some((item) => item.game === 'live');
  return items.map((item) => {
    if (isLive) {
      const { MatchId, MarketId, OutcomeId, Specifiers, Rate } = item;
      return `${MatchId}/${MarketId}/${OutcomeId}/${Specifiers}/${Rate}`;
    } else {
      const { SRSMarketId, SRSMarketType, AllottedValue, OutcomeId } = item;
      return `${SRSMarketId}/${SRSMarketType}/${AllottedValue}/${OutcomeId}`;
    }
  });
};

const mutations = {
  [CART_ADD_BETTING_GAME](state, { item }) {
    if (item.game === 'live') {
      state.items = [item];
      state.isChanged = false;
      state.countSameBets = 0;
      return;
    }
    const isSpecial = item.game === 'Special';
    const foundIndex = state.items.findIndex((sItem) => {
      return (
        (isSpecial ? sItem.BMatchId === item.BMatchId : sItem.id === item.id) &&
        sItem.AllottedValue === item.AllottedValue &&
        sItem.SRSMarketType === item.SRSMarketType &&
        sItem.SRSMarketId === item.SRSMarketId &&
        sItem.OutcomeId === item.OutcomeId
      );
    });
    if (foundIndex >= 0) {
      return;
    }
    let results = [
      ...state.items.filter((sItem) => {
        if (item.crossBetting) {
          if (item.SRSMarketType.includes('total')) {
            return !(
              (isSpecial
                ? sItem.BMatchId === item.BMatchId
                : sItem.id === item.id) &&
              sItem.SRSMarketType === item.SRSMarketType
            );
          } else {
            return !(
              (isSpecial
                ? sItem.BMatchId === item.BMatchId
                : sItem.id === item.id) &&
              (sItem.SRSMarketType.includes('handicap') ||
                sItem.SRSMarketType.includes('way'))
            );
          }
        } else {
          return isSpecial
            ? sItem.BMatchId !== item.BMatchId
            : sItem.id !== item.id;
        }
      }),
    ];
    if (results.length >= 10) {
      state.overItem = item;
      return;
    } else {
      results = [...results, item];
    }
    state.items = results;
    state.isChanged = true;
    state.countSameBets = 0;
  },
  [CART_REQ_BETTING_GAMES](state, code) {
    state.requesting = false;
    state.success = code === CODE_BETTING_SUCCESSFUL;
    state.code = code;
    if (!state.success) {
      return;
    }
    if (state.isChanged) {
      state.isChanged = false;
      state.countSameBets += 1;
    } else {
      state.countSameBets += 1;
    }
  },
  [CART_REMOVE_BETTING_GAME](state, { item }) {
    console.log('CART_REMOVE_BETTING_GAME');
    if (item.game === 'live') {
      state.items = [];
      return;
    }
    state.items = state.items.filter((sItem) => {
      return !(
        sItem.id === item.id &&
        sItem.SRSMarketType === item.SRSMarketType &&
        sItem.OutcomeId === item.OutcomeId
      );
    });
    state.isChanged = true;
    state.countSameBets = 0;
  },
  [CART_REMOVE_ALL_GAMES](state) {
    console.log('CART_REMOVE_ALL_GAMES');
    state.items = [];
    state.isChanged = true;
    state.countSameBets = 0;
  },
  [CART_UPDATE_BETTING_ITEM](state, { updated }) {
    if (state.items.length <= 0) {
      return;
    }
    console.log('CART_UPDATE_BETTING_ITEM');
    const gameType = state.items[0].game;
    if (gameType === 'live') {
      const betItem = state.items[0];
      const { MatchId, Odds, MatchStatusCode } = updated;
      if (betItem.MatchId !== MatchId) {
        return;
      }
      if (MatchStatusCode === 0) {
        return;
      }
      if (!Odds || Odds === null || Odds.length <= 0) {
        console.log('no odds');
        state.items = [];
        return;
      }
      const markets = Odds.filter(({ id: MarketId }) => {
        return betItem.MarketId === MarketId;
      });
      if (!markets) {
        console.log('not found market(s)');
        return;
      }
      const market = markets.find((market) => {
        return market.specifiersOrigin === betItem.Specifiers;
      });

      console.log('market', market);
      if (!market) {
        console.log('not found market');
        state.items = [];
        return;
      }

      if (betItem.Specifiers !== market.specifiersOrigin) {
        console.log('not found specifiers');
        state.items = [];
        return;
      }
      const outcome = market.outcome.find((outcome) => {
        return betItem.OutcomeId === outcome.id;
      });
      if (!outcome) {
        state.items = [];
        return;
      }
      const result = {
        ...state.items[0],
        Rate: outcome.odds,
        Arrow: outcome.arrow,
        Active: market.status === 1 && outcome.active === 1,
      };
      state.items = JSON.parse(JSON.stringify([result]));
    } else {
      const {
        id,
        SRSMarketId,
        SRSMarketType,
        AllottedValue,
        MatchStatusCode,
      } = updated;
      const foundIndex = state.items.findIndex((item) => {
        return (
          item.id === id &&
          item.SRSMarketType === SRSMarketType &&
          (item.AllottedValue ? item.AllottedValue : null) === AllottedValue
        );
      });
      if (foundIndex < 0) {
        return;
      }
      if (MatchStatusCode === -1) {
        state.items.splice(foundIndex, 1);
      } else {
        const { Outcome_L, Outcome_C, Outcome_R } = updated;
        const { Odd_L, Odd_C, Odd_R } = updated;
        const { OutcomeId } = state.items[foundIndex];
        if (Outcome_L === OutcomeId) {
          state.items[foundIndex].Rate = Odd_L;
        }
        if (Outcome_C === OutcomeId) {
          state.items[foundIndex].Rate = Odd_C;
        }
        if (Outcome_R === OutcomeId) {
          state.items[foundIndex].Rate = Odd_R;
        }
        state.items[foundIndex].SRSMarketId = SRSMarketId;
      }
    }
  },
  clearSameBetCount(state) {
    state.countSameBets = 0;
  },
  requesting(state) {
    state.requesting = true;
  },
  stateSuccessFalse(state) {
    state.success = false;
    state.error = null;
    state.code = -1;
  },
  clearOverItem(state) {
    state.overItem = null;
  },
  clearAll(state) {
    state.success = false;
    state.error = null;
    state.items = [];
    state.isChanged = false;
    state.requesting = false;
    state.countSameBets = 0;
    state.code = -1;
  },
};

const actions = {
  clearSameBetCount({ commit }) {
    commit('clearSameBetCount');
  },
  betting({ state, commit, dispatch }, gold) {
    if (!state.items || state.items === null || state.items.length <= 0) {
      return;
    }
    commit('stateSuccessFalse');
    commit('requesting');
    const gameType = state.items[0].game;
    if (gameType === 'live') {
      dispatch(
        'gamecenter/betting/ws/drawLive',
        {
          item: state.items[0],
          gold,
        },
        { root: true }
      );
    } else {
      dispatch(
        'gamecenter/betting/ws/draw',
        {
          type: gameType === 'SRS' ? 'DrawSRS' : 'DrawSRSSpecial',
          items: state.items,
          gold,
        },
        { root: true }
      );
    }
  },
  addItem({ commit }, item) {
    commit(CART_ADD_BETTING_GAME, { item });
  },
  removeItem({ commit }, item) {
    commit(CART_REMOVE_BETTING_GAME, { item });
  },
  resetFoundUpdateIds({ commit }) {
    commit('resetFoundUpdateIds');
  },
  removeAll({ commit }) {
    commit(CART_REMOVE_ALL_GAMES);
  },
  clearOverItem({ commit }) {
    commit('clearOverItem');
  },
};

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions,
};
