import { createNamespacedHelpers } from 'vuex';

const { mapGetters: _sportsDataGetters } = createNamespacedHelpers(
  'mapper/sports'
);

export default {
  computed: {
    ..._sportsDataGetters({
      getEnabledSports: 'getEnabledSports',
      getSportByCode: 'getSport',
      getSportByValue: 'getSportByValue',
      getSportByKrText: 'getSportByKrText',
      getSportText: 'getSportText',
      getSportValue: 'getSportValue',
      getSportForHomeResult: 'getSportForHomeResult',
      getSportForSelector: 'getSportForSelector',
      isCanCrossBetting: 'isCanCrossBetting',
    }),
  },
};
