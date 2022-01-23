const state = () => ({
  sports: [
    {
      code: 1,
      text: '축구',
      value: 'soccer',
      enabled: true,
      cm_board_category: true,
      crossBetting: false,
      selector: true,
      homeResult: true,
    },
    {
      code: 2,
      text: '농구',
      value: 'basketball',
      enabled: true,
      cm_board_category: true,
      selector: true,
      homeResult: true,
    },
    {
      code: 3,
      text: '야구',
      value: 'baseball',
      enabled: true,
      cm_board_category: true,
      selector: true,
      homeResult: true,
    },
    {
      code: 23,
      text: '배구',
      value: 'volleyball',
      enabled: true,
      cm_board_category: false,
      crossBetting: false,
      selector: true,
      setscore: true,
    },
    {
      code: 4,
      text: '아이스하키',
      value: 'icehockey',
      enabled: true,
      cm_board_category: false,
      crossBetting: false,
      selector: true,
    },
    {
      code: 5,
      text: '테니스',
      value: 'tennis',
      enabled: true,
      cm_board_category: false,
      crossBetting: false,
      selector: true,
    },
    {
      code: 20,
      text: '탁구',
      value: 'tabletennis',
      enabled: true,
      cm_board_category: false,
      selector: false,
    },
    {
      code: 6,
      text: '핸드볼',
      value: 'handball',
      enabled: true,
      cm_board_category: false,
      selector: false,
    },
    {
      code: 16,
      text: '미식축구',
      value: 'rugby',
      enabled: true,
      cm_board_category: false,
      selector: false,
    },
    {
      code: 31,
      text: '배드민턴',
      value: 'badminton',
      enabled: true,
      cm_board_category: false,
      selector: false,
    },
    {
      code: 140,
      text: '당구',
      value: 'billiards',
      enabled: true,
      cm_board_category: false,
      selector: false,
    },
    {
      code: 19,
      text: '스누커',
      value: 'snooker',
      enabled: true,
      cm_board_category: false,
      selector: false,
    },
    {
      code: 37,
      text: '스쿼시',
      value: 'squash',
      enabled: true,
      cm_board_category: false,
      selector: false,
    },
    {
      code: 29,
      text: '풋살',
      value: 'futsal',
      enabled: true,
      cm_board_category: false,
      selector: false,
    },
    {
      code: 117,
      text: '종합격투기',
      value: 'ufight',
      crossBetting: false,
      enabled: true,
      cm_board_category: false,
      selector: false,
    },
    {
      code: 40,
      text: '레이싱',
      value: 'race',
      enabled: true,
      cm_board_category: false,
      selector: false,
    },
    {
      code: 22,
      text: '다트',
      value: 'dart',
      enabled: true,
      cm_board_category: false,
      selector: false,
    },
    {
      code: 150,
      text: '바둑',
      value: 'baduk',
      enabled: true,
      cm_board_category: false,
      selector: false,
    },
  ],
});

const DUMMY_DATA = {
  code: -1,
  text: 'UNKNWON',
  value: 'unknown',
  enabled: false,
  cm_board_category: false,
  crossBetting: false,
};

const getters = {
  getSport: (state) => (code) => {
    const result = state.sports.find((sport) => {
      return sport.code === code && sport.enabled;
    });
    if (result) {
      return result;
    } else {
      return DUMMY_DATA;
    }
  },
  getSports: (state) => {
    return state.sports;
  },
  getSportForSelector: (state, getters) => {
    return getters.getSports.filter((sport) => sport.selector);
  },
  getSportForHomeResult: (state, getters) => {
    return getters.getSports.filter((sport) => sport.homeResult);
  },
  getSportText: (state, getters) => (code) => {
    return getters.getSport(code).text;
  },
  getSportValue: (state, getters) => (code) => {
    return getters.getSport(code).value;
  },
  getEnabledSports: (state, getters) => {
    return getters.getSports.filter((sport) => {
      return sport.enabled;
    });
  },
  getSportByValue: (state) => (value) => {
    const result = state.sports.find((sport) => {
      return sport.value === value && sport.enabled;
    });
    if (result) {
      return result;
    } else {
      return DUMMY_DATA;
    }
  },
  getSportByKrText: (state) => (text) => {
    const result = state.sports.find((sport) => {
      return sport.text === text && sport.cm_board_category;
    });
    if (result) {
      return result;
    } else {
      return {
        code: -1,
        text: '기타',
        value: 'other',
      };
    }
  },
  isCanCrossBetting: (state) => (SportId) => {
    const result = state.sports.find((s) => s.code === SportId).crossBetting;
    console.log(result);
    if (result === undefined) {
      return true;
    }
    return result;
  },
};

export default {
  namespaced: true,
  state,
  getters,
};
