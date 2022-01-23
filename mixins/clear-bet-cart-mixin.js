import { createNamespacedHelpers } from 'vuex';

const { mapActions: bettingCartActions } = createNamespacedHelpers(
  'gamecenter/betting/cart'
);

export default {
  methods: {
    ...bettingCartActions({
      _clearBetCarts: 'removeAll',
    }),
  },
};
