const state = () => ({
  status: [
    {
      code: 'opened',
      text: '대기',
      search: false,
      cancelable: true,
    },
    {
      code: 'await',
      text: '대기',
      search: true,
      cancelable: true,
    },
    {
      code: 'special',
      text: '적중특례',
      search: true,
      cancelable: false,
    },
    {
      code: 'failed',
      text: '적중실패',
      search: true,
      cancelable: false,
    },
    {
      code: 'succeeded',
      text: '적중성공',
      search: true,
      cancelable: false,
    },
    {
      code: 'sell',
      text: '판매중',
      search: false,
      cancelable: true,
    },
    {
      code: 'refunding',
      text: '베팅취소',
      search: false,
      cancelable: false,
    },
  ],
  types: [
    // {
    //   code: 'SRS',
    //   text: '승무패',
    // },
    {
      code: 'Special',
      text: '스페셜',
    },
    {
      code: 'Series',
      text: '주간',
    },
    {
      code: 'Live',
      text: '라이브',
    },
  ],
});

const getters = {
  getSearchStatusList: (state) => {
    return state.status.filter((stat) => {
      return stat.search;
    });
  },
  getStatus: (state) => (code) => {
    const result = state.status.find((stat) => {
      return stat.code === code;
    });
    if (result) {
      return result;
    } else {
      return {
        // code: 'cancel',
        // text: '베팅취소',
        code: 'special',
        text: '적중특례',
        search: true,
        cancelable: false,
      };
    }
  },
  getType: (state) => (code) => {
    console.log(code);
    const result = state.types.find((type) => {
      return type.code === code;
    });
    if (result) {
      console.log(result);
      return result;
    } else {
      return {
        code: 'SRS',
        text: '승무패',
      };
    }
  },
};

export default {
  namespaced: true,
  state,
  getters,
};
