import { createNamespacedHelpers } from 'vuex';

const { mapActions: userSafeboxActions } = createNamespacedHelpers(
  'user/safebox'
);

export default {
  mounted() {
    window.addEventListener('message', this.onReceivePopupMessage);
  },
  beforeDestroy() {
    window.removeEventListener('message', this.onReceivePopupMessage);
  },
  methods: {
    ...userSafeboxActions({
      updateUserAssetsInfo: 'updateUserInfo',
    }),
    onReceivePopupMessage({ data }) {
      if (data.from === 'safebox') {
        const { safebox, gold } = data;
        this.updateUserAssetsInfo({ safebox, gold });
      }

      if (data.from === 'payment') {
        this.$auth.fetchUser();
      }

      if (data.from === 'gold-charge') {
        this.$auth.fetchUser();
      }
    },
  },
};
