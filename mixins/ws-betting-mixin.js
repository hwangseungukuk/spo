import { createNamespacedHelpers } from 'vuex';

const { mapActions: mainBettingList } = createNamespacedHelpers('main/betting');

const { mapActions: srsBettingList } = createNamespacedHelpers(
  'gamecenter/betting/list/srs'
);

const { mapActions: specialBettingList } = createNamespacedHelpers(
  'gamecenter/betting/list/special'
);

const { mapActions: liveBettingList } = createNamespacedHelpers(
  'gamecenter/betting/list/live'
);

export default {
  methods: {
    ...mainBettingList({
      subscribeMain: 'subscribe',
      unsubscribeMain: 'unsubscribe',
    }),
    ...srsBettingList({
      subscribeSRS: 'subscribe',
      unsubscribeSRS: 'unsubscribe',
    }),
    ...specialBettingList({
      subscribeSpecial: 'subscribe',
      unsubscribeSpecial: 'unsubscribe',
    }),
    ...liveBettingList({
      subscribeLive: 'subscribe',
      unsubscribeLive: 'unsubscribe',
    }),
  },
};
