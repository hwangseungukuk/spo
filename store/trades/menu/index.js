const state = () => ({
  menus: [
    {
      label: '거래소',
      name: 'trades-idx',
      thead: [
        // {
        //   text: '고유번호',
        //   className: 'tradeNo',
        //   width: 67,
        // },
        {
          text: '폴더',
          className: 'folder',
          width: 125,
        },
        // {
        //   text: '베팅골드',
        //   className: 'betGold',
        //   width: 93,
        // },
        {
          text: '총배당',
          className: 'totOdds',
          width: 125,
        },
        {
          text: '예상 당첨골드',
          className: 'winGold',
          width: 125,
        },
        {
          text: '판매골드',
          className: 'sellPrice',
          width: 125,
        },
        {
          text: '남은시간',
          className: 'statsTime',
          width: 125,
        },
        {
          text: '적중전적',
          className: 'hitRate',
          width: 125,
        },
        // {
        //   text: '등록시간',
        //   className: 'writeTime',
        //   width: 78,
        // },
      ],
    },
    {
      label: '판매등록',
      name: 'trades-sell',
      thead: [
        {
          text: '게임종류',
          className: 'type',
          width: '113',
        },
        {
          text: '베팅일시',
          className: 'date',
          width: '134',
        },
        {
          text: '베팅골드',
          className: 'golds',
          width: '135',
        },
        {
          text: '배당률',
          className: 'rate',
          width: '127',
        },
        {
          text: '예상 당첨골드',
          className: 'expected',
          width: '143',
        },
        {
          text: '상태',
          className: 'state',
          width: '75',
        },
      ],
    },
    {
      label: '판매내역',
      name: 'trades-mysell',
      thead: [
        // {
        //   text: '고유번호',
        //   className: 'tradeNo',
        //   width: 67,
        // },
        {
          text: '폴더',
          className: 'folder',
          width: 103,
        },
        {
          text: '베팅골드',
          className: 'betGold',
          width: 93,
        },
        {
          text: '총배당',
          className: 'totOdds',
          width: 93,
        },
        {
          text: '예상 당첨골드',
          className: 'winGold',
          width: 133,
        },
        {
          text: '판매골드',
          className: 'sellPrice',
          width: 97,
        },
        {
          text: '남은시간',
          className: 'statsTime',
          width: 92,
        },
        {
          text: '적중전적',
          className: 'hitRate',
          width: 62,
        },
        {
          text: '등록시간',
          className: 'writeTime',
          width: 78,
        },
      ],
    },
    {
      label: '구매내역',
      name: 'trades-buylist',
      thead: [
        // {
        //   text: '고유번호',
        //   className: 'tradeNo',
        //   width: 67,
        // },
        {
          text: '폴더',
          className: 'folder',
          width: 97,
        },
        {
          text: '베팅골드',
          className: 'betGold',
          width: 97,
        },
        {
          text: '총배당',
          className: 'totOdds',
          width: 97,
        },
        {
          text: '예상 당첨골드',
          className: 'winGold',
          width: 104,
        },
        {
          text: '판매골드',
          className: 'sellPrice',
          width: 97,
        },
        {
          text: '남은시간',
          className: 'statsTime',
          width: 97,
        },
        {
          text: '적중전적',
          className: 'hitRate',
          width: 97,
        },
        {
          text: '구매시간',
          className: 'buytime',
          width: 104,
        },
      ],
    },
    {
      label: '이용가이드',
      name: 'trades-guide',
      subs: [
        {
          label: '거래소 이용방법',
          name: 'trades-guide-idx',
        },
        {
          label: '판매 등록 이용방법',
          name: 'trades-guide-sell',
        },
        {
          label: '판매 내역 이용방법',
          name: 'trades-guide-mmysell',
        },
        {
          label: '구매 내역 이용방법',
          name: 'trades-guide-buylist',
        },
      ],
    },
  ],
});

const getters = {
  getSubMenu: (state) => (routerName) => {
    const result = state.menus.find((menu) => {
      return menu.name === routerName;
    });
    if (!result) {
      return [];
    }
    if (result.subs !== undefined && result.subs !== null) {
      return result.subs;
    } else {
      return [];
    }
  },
};

export default {
  namespaced: true,
  state,
  getters,
};
