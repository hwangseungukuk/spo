const state = () => ({
  menus: [
    {
      label: '스포츠게시판',
      name: 'community-path',
      params: {
        path: 'analysis_new',
      },
      controller: {
        type: 'list',
        part: true,
        pagesize: 20,
        userWrite: true,
      },
    },
    {
      label: '자유게시판',
      name: 'community-path',
      params: {
        path: 'free',
      },
      controller: {
        type: 'list',
        part: false,
        pagesize: 20,
        userWrite: true,
      },
    },
    {
      label: '스포미디어',
      name: 'community-path',
      params: {
        path: 'spomedia',
      },
      controller: {
        type: 'gallery',
        part: false,
        pagesize: 15,
        userWrite: false,
      },
    },
  ],
  filter: [
    {
      text: '제목',
      value: 'wr_subject',
    },
    {
      text: '제목+내용',
      value: 'wr_subject||wr_content',
    },
    {
      text: '닉네임',
      value: 'wr_name',
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
        name: 'community-path',
        params: {
          path: null,
        },
        controller: {
          type: 'list',
          part: false,
          pagesize: 15,
          userWrite: false,
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
