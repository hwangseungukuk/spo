const state = () => ({
  menu: [
    {
      name: '승부예측',
      router: 'hitgame',
      width: 100,
      submenu: [
        {
          name: '승무패',
          router: 'hitgame-srs',
        },
        {
          name: '라이브',
          router: 'hitgame-live',
        },
        {
          name: '스페셜',
          router: 'hitgame-special',
        },
        {
          name: '적중내역',
          router: 'hitgame-history',
        },
        {
          name: '경기결과',
          router: 'hitgame-results',
        },
      ],
    },
    {
      name: '캐주얼',
      router: 'casual',
      width: 87,
      submenu: [],
    },
    {
      name: '게임소개',
      router: 'info',
      width: 100,
      submenu: [
        {
          name: '게임소개',
          router: 'info-introduce',
        },
        {
          name: '게임가이드',
          router: 'info-guide',
        },
        {
          name: '베팅규정',
          router: 'info-rules',
        },
      ],
    },
    {
      name: '거래소',
      router: 'trades',
      // construction: true,
      width: 90,
      submenu: [
        {
          name: '거래소',
          router: 'trades-idx',
          construction: true,
        },
        {
          name: '판매등록',
          router: 'trades-sell',
          construction: true,
        },
        {
          name: '판매내역',
          router: 'trades-mysell',
          // router: 'trades-sold',
          // construction: true,
        },
        {
          name: '구매내역',
          router: 'trades-buylist',
          // router: 'trades-bought',
          // construction: true,
        },
        {
          name: '이용가이드',
          router: 'trades-guide',
          // router: 'trades-guides',
          // construction: true,
        },
      ],
    },
    {
      name: '게임존',
      router: 'gamezone',
      // construction: true,
      width: 85,
      submenu: [],
    },
    {
      name: '픽정보',
      router: 'picks',
      // construction: true,
      width: 85,
      submenu: [],
    },
    {
      name: '커뮤니티',
      router: 'community',
      width: 100,
      submenu: [
        {
          name: '스포츠게시판',
          router: 'community-path',
          params: {
            path: 'analysis_new',
          },
        },
        {
          name: '자유게시판',
          router: 'community-path',
          params: {
            path: 'free',
          },
        },
        {
          name: '스포미디어',
          router: 'community-path',
          params: {
            path: 'spomedia',
          },
        },
      ],
    },
    // {
    //   name: '상점',
    //   router: 'store',
    //   width: 75,
    //   submenu: [
    //     {
    //       name: '게임스킨',
    //       router: 'store-id1',
    //       params: {
    //         id1: '10',
    //       },
    //     },
    //     {
    //       name: '아이템',
    //       router: 'store-id1',
    //       params: {
    //         id1: '20',
    //       },
    //     },
    //   ],
    // },
    {
      name: '새소식',
      router: 'news',
      width: 85,
      submenu: [
        {
          name: '공지사항',
          router: 'news-path',
          params: {
            path: 'notice',
          },
        },
        {
          name: '업데이트',
          router: 'news-path',
          params: {
            path: 'update',
          },
        },
        {
          name: '이벤트',
          router: 'news-path',
          params: {
            path: 'event',
          },
        },
      ],
    },
    // {
    //   name: '마이페이지',
    //   router: 'mypage',
    //   width: 114,
    //   submenu: [
    //     {
    //       name: '적중내역',
    //       router: 'mypage-hitgame',
    //     },
    //     {
    //       name: '인벤토리',
    //       router: 'mypage-inventory',
    //     },
    //     {
    //       name: '구매내역',
    //       router: 'mypage-history',
    //     },
    //     {
    //       name: '고객센터',
    //       router: 'mypage-customer',
    //     },
    //   ],
    // },
  ],
});

const getters = {
  getSubMenuByRouter: (state) => (routerName) => {
    const result = state.menu.find((m) => m.router === routerName);
    if (!result) {
      return null;
    }
    return result.submenu;
  },
};

export default {
  namespaced: true,
  state,
  getters,
};
