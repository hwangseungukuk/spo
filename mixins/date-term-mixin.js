const DATE_TERMS = [
  {
    text: '오늘',
    value: 0,
    target: 'days',
  },
  {
    text: '1주일',
    value: 7,
    target: 'days',
  },
  {
    text: '15일',
    value: 15,
    target: 'days',
  },
  {
    text: '1개월',
    value: 1,
    target: 'months',
  },
  {
    text: '3개월',
    value: 3,
    target: 'months',
  },
  {
    text: '기간검색',
    value: -1,
    target: 'none',
  },
];

export default {
  data() {
    return {
      DATE_TERMS,
    };
  },
};
