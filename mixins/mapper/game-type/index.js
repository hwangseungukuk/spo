import { createNamespacedHelpers } from 'vuex';

const { mapGetters: _gameTypeGetters } = createNamespacedHelpers(
  'mapper/game-type'
);

export default {
  computed: {
    ..._gameTypeGetters({
      getSRSMarketType: 'getGameType',
    }),
  },
};
