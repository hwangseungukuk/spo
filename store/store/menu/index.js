const state = () => ({
  menus: [
    {
      label: '게임스킨',
      name: 'store-id1',
      params: {
        id1: '10',
      },
      subs: [
        // {
        //   label: '전체',
        //   name: 'store-id1-id2',
        //   params: {
        //     id1: '10',
        //     id2: '0',
        //   },
        // },
        {
          label: '축구',
          name: 'store-id1-id2',
          params: {
            id1: '10',
            id2: '1010',
          },
        },
        {
          label: '농구',
          name: 'store-id1-id2',
          params: {
            id1: '10',
            id2: '1020',
          },
        },
        {
          label: '야구',
          name: 'store-id1-id2',
          params: {
            id1: '10',
            id2: '1030',
          },
        },
      ],
    },
    {
      label: '아이템',
      name: 'store-id1',
      params: {
        id1: '20',
      },
      subs: [
        {
          label: '소비 아이템',
          name: 'store-id1-id2',
          params: {
            id1: '20',
            id2: '2010',
          },
        },
        {
          label: '기간제 아이템',
          name: 'store-id1-id2',
          params: {
            id1: '20',
            id2: '2020',
          },
        },
      ],
    },
  ],
});

const getters = {
  getPath: (state) => (routerName) => {
    return state.menus.find((menu) => {
      return menu.name === routerName;
    });
  },
  getMenuByPath: (state) => (id1) => {
    const result = state.menus.find((menu) => {
      return menu.params.id1 === id1;
    });
    if (result) {
      return result;
    } else {
      return {
        label: 'none',
        name: 'store-id1',
        params: {
          id1: null,
        },
        controller: {
          pagesize: 15,
        },
      };
    }
  },
  getSubMenu: (state) => (id1) => {
    const result = state.menus.find((menu) => {
      return menu.params.id1 === id1;
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
