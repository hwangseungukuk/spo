const state = () => ({
  menus: [
    {
      title: '스포츠게시판',
      path: 'analysis_new',
      pageSize: 5,
    },
    {
      title: '자유게시판',
      path: 'free',
      pageSize: 5,
    },
    {
      title: '스포미디어',
      path: 'spomedia',
      pageSize: 3,
    },
  ],
});

export default {
  namespaced: true,
  state,
};
