const state = () => ({
  types: [
    {
      code: '2way',
      text: '승무패',
    },
    {
      code: '3way',
      text: '승무패',
    },
    {
      code: 'handicap',
      text: '핸디캡',
    },
    {
      code: 'totals',
      text: 'U / O',
    },
  ],
});

const getters = {
  getGameType: (state) => (code) => {
    const result = state.types.find((type) => {
      return type.code === code;
    });
    if (result) {
      return result;
    } else {
      return null;
    }
  },
};

export default {
  namespaced: true,
  state,
  getters,
};
