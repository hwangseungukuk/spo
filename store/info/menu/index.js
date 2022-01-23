const state = () => ({
  menus: [
    {
      label: '게임 소개',
      name: 'info-introduce',
    },
    {
      label: '게임 가이드',
      name: 'info-guide',
      subs: [
        {
          label: '기초가이드',
          name: 'info-guide-general',
        },
        {
          label: '인터페이스',
          name: 'info-guide-interface',
        },
        {
          label: '승무패 적중',
          name: 'info-guide-srs',
        },
        {
          label: '스페셜 적중',
          name: 'info-guide-special',
        },
        {
          label: '점프볼',
          name: 'info-guide-jumpball',
        },
        {
          label: '코인토스',
          name: 'info-guide-cointoss',
        },
        {
          label: '프리킥',
          name: 'info-guide-freekick',
        },
        {
          label: '슈팅스타',
          name: 'info-guide-shooting',
        },
        // {
        //   label: '승부차기',
        //   name: 'info-guide-penaltyshootout',
        // },
      ],
    },
    {
      label: '베팅 규정',
      name: 'info-rules',
      subs: [
        {
          label: '승무패 적중',
          name: 'info-rules-srs',
        },
        {
          label: '라이브게임',
          name: 'info-rules-live',
        },
        {
          label: '스페셜 적중',
          name: 'info-rules-special',
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
