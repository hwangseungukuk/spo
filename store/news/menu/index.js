const state = () => ({
  menus: [
    {
      label: '공지사항',
      name: 'news-path',
      params: {
        path: 'notice',
      },
    },
    {
      label: '업데이트',
      name: 'news-path',
      params: {
        path: 'update',
      },
    },
    {
      label: '이벤트',
      name: 'news-path',
      params: {
        path: 'event',
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
};

export default {
  namespaced: true,
  state,
  getters,
};
