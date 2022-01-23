const COOKIE_KEY_SAVED_BET_CART_ITEMS = '_saved_bet_cart_items_';

export default {
  methods: {
    _getSavedCookie() {
      const saved = this.$auth.$storage.getCookie(
        COOKIE_KEY_SAVED_BET_CART_ITEMS
      );
      if (!saved || saved === null) {
        return null;
      }
      return JSON.parse(this.$LZString.decompressFromBase64(saved));
    },
    getSavedBetCartItems(userId) {
      const decompressed = this._getSavedCookie();
      console.log('decompressed', decompressed);
      if (!decompressed) {
        return [];
      }
      const result = decompressed[userId];
      if (!result || result === null) {
        return [];
      }
      return result.map((item) => {
        return {
          ...item,
          MatchDate: this.$moment(
            item.MatchDate,
            this.$moment.ISO_8601
          ).toDate(),
        };
      });
    },
    saveBetCartItems(userId, items) {
      let savedItems = this._getSavedCookie();
      console.log('_getSavedCookie', savedItems);
      if (!savedItems || savedItems === null) {
        savedItems = {};
      }
      if (!savedItems[userId]) {
        savedItems[userId] = [];
      }
      savedItems[userId] = items;
      console.log('savedItems', savedItems);
      this.$auth.$storage.setCookie(
        COOKIE_KEY_SAVED_BET_CART_ITEMS,
        this.$LZString.compressToBase64(JSON.stringify(savedItems))
      );
    },
  },
};
