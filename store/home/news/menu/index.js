const state = () => ({
  menus: [
    {
      title: '공지사항',
      path: 'notice',
      pageSize: 5,
    },
    {
      title: '업데이트',
      path: 'update',
      pageSize: 5,
    },
    {
      title: '이벤트',
      path: 'event',
      pageSize: 5,
    },
  ],
});

export default {
  namespaced: true,
  state,
};
