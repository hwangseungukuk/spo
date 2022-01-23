const state = () => ({
  categories: [
    {
      code: 1,
      text: '계정',
      order: 4,
    },
    {
      code: 2,
      text: '결제',
      order: 1,
    },
    {
      code: 3,
      text: '게임 이용',
      order: 2,
    },
    {
      code: 4,
      text: '경기/베팅',
      order: 3,
    },
    {
      code: 5,
      text: '기타',
      order: 5,
    },
  ].sort((a, b) => a.order - b.order),
});

export default {
  namespaced: true,
  state,
};
