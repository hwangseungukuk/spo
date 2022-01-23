<template>
  <div class="m-container">
    <template v-if="!isPopup">
      <head-navigator
        icon="header hitgame"
        title="승부예측"
        description="국내 최대 승부 예측 게임을 즐겨보세요!"
        :items="
          _getSubMenuByRouter('hitgame').map((sm) => {
            return {
              label: sm.name,
              name: sm.router,
            };
          })
        "
        radius="true"
      ></head-navigator>
    </template>
    <nuxt-child></nuxt-child>
  </div>
</template>

<script>
import { createNamespacedHelpers } from 'vuex';

import HeadNavigator from '~/components/common/HeadNavigator';

const { mapGetters: _abMenuGetters } = createNamespacedHelpers('appbar');

export default {
  components: {
    HeadNavigator,
  },
  asyncData({ redirect, route }) {
    if (route.name.includes('hitgame') && route.name !== 'hitgame') {
      return;
    }
    redirect({ name: 'hitgame-srs' });
  },
  computed: {
    ..._abMenuGetters({
      _getSubMenuByRouter: 'getSubMenuByRouter',
    }),
    isPopup() {
      return this.$route.name.includes('popup');
    },
  },
  watch: {
    $route(route) {
      if (route.name.includes('hitgame') && route.name !== 'hitgame') {
        return;
      }
      this.$router.push({ name: 'hitgame-srs' });
    },
  },
};
</script>

<style scoped></style>
