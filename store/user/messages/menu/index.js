const state = () => ({
  menus: [
    {
      label: '받은 쪽지',
      name: 'messages-path',
      params: {
        path: 'recv',
      },
      controller: {
        pagesize: 10,
      },
    },
    {
      label: '보낸 쪽지',
      name: 'messages-path',
      params: {
        path: 'send',
      },
      controller: {
        pagesize: 10,
      },
    },
  ],
});

const getters = {
  getPath: (state) => (routerName) => {
    return state.menus.find((menu) => {
      return menu.name === routerName;
    });
  },
  getMenuByPath: (state) => (path) => {
    const result = state.menus.find((menu) => {
      return menu.params.path === path;
    });
    if (result) {
      return result;
    } else {
      return {
        label: 'none',
        name: 'messages-path',
        params: {
          path: null,
        },
        controller: {
          pagesize: 10,
        },
      };
    }
  },
};

export default {
  namespaced: true,
  state,
  getters,
};
