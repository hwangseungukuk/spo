const state = () => ({
  status: [
    {
      code: 0,
      prepared: true,
      text: '경기대기',
    },
    {
      code: 60,
      canceled: true,
      text: '경기연기',
    },
    {
      code: 70,
      canceled: true,
      text: '경기취소',
    },
    {
      code: 80,
      canceled: true,
      text: '경기취소',
    },
    {
      code: 90,
      canceled: true,
      text: '경기취소',
    },
    {
      code: 100,
      ended: true,
      text: '경기종료',
    },
    {
      code: 110,
      ended: true,
      text: '연장종료',
    },
    {
      code: 120,
      ended: true,
      text: '연장종료',
    },
  ],
});

const getters = {
  getStatus: (state) => (code) => {
    const result = state.status.find((stat) => {
      return stat.code === code;
    });
    if (result) {
      return result;
    } else {
      return {
        code: -1,
        text: '경기진행',
        prepared: false,
        canceled: false,
        ended: false,
        progress: true,
      };
    }
  },
};

export default {
  namespaced: true,
  state,
  getters,
};
