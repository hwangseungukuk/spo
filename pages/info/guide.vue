<template>
  <div class="guide-container">
    <sub-head-navigator :items="getSubMenu('info-guide')"></sub-head-navigator>
    <nuxt-child></nuxt-child>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import SubHeadNavigator from '~/components/common/SubHeadNavigator';

export default {
  auth: false,
  components: {
    SubHeadNavigator,
  },
  asyncData({ route, redirect }) {
    if (route.name.includes('info-guide') && route.name !== 'info-guide') {
      return;
    }
    redirect({ name: 'info-guide-general' });
  },
  computed: {
    ...mapGetters('info/menu', ['getSubMenu']),
  },
  watch: {
    $route(route) {
      if (route.name.includes('info-guide') && route.name !== 'info-guide') {
        return;
      }
      this.$router.push({ name: 'info-guide-general' });
    },
  },
};
</script>

<style scoped>
div.guide-container >>> div.guide-content {
  padding: 0 0 20px;
}
</style>
