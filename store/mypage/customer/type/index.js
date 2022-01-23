const state = () => ({
  status: [
    {
      code: 0,
      label: '답변대기',
      css: 'wait',
      editable: true,
    },
    {
      code: 2,
      label: '처리 중',
      css: 'progressing',
      editable: false,
    },
    {
      code: 1,
      label: '답변완료',
      css: 'completed',
      editable: false,
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
        code: 0,
        label: '답변대기',
        css: 'wait',
      };
    }
  },
};

export default {
  namespaced: true,
  state,
  getters,
};
