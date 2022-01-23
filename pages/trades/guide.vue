<template>
  <div class="guide-container">
    <sub-head-navigator
      :items="getSubMenu('trades-guide')"
    ></sub-head-navigator>
    <nuxt-child></nuxt-child>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import SubHeadNavigator from '~/components/common/SubHeadNavigator';

export default {
  components: {
    SubHeadNavigator,
  },
  asyncData({ route, redirect }) {
    if (route.name.includes('trades-guide') && route.name !== 'trades-guide') {
      return;
    }
    redirect({ name: 'trades-guide-idx' });
  },
  computed: {
    ...mapGetters('trades/menu', ['getSubMenu']),
  },
  watch: {
    $route(route) {
      if (
        route.name.includes('trades-guide') &&
        route.name !== 'trades-guide'
      ) {
        return;
      }
      this.$router.push({ name: 'trades-guide-idx' });
    },
  },
};
</script>

<style scoped>
div.guide-container >>> div.guide-content {
  padding: 0 0 20px;
}

div.guide-container .sub-tabs >>> .sub-tab {
  min-width: 130px;
  margin-right: 10px;
  width: fit-content;
}
</style>
