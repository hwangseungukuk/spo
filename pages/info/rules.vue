<template>
  <div class="guide-container">
    <sub-head-navigator :items="getSubMenu('info-rules')"></sub-head-navigator>
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
    if (route.name.includes('info-rules') && route.name !== 'info-rules') {
      return;
    }
    redirect({ name: 'info-rules-srs' });
  },
  computed: {
    ...mapGetters('info/menu', ['getSubMenu']),
  },
  watch: {
    $route(route) {
      if (route.name.includes('info-rules') && route.name !== 'info-rules') {
        return;
      }
      this.$router.push({ name: 'info-rules-srs' });
    },
  },
};
</script>

<style scoped>
div.guide-container >>> div.guide-content {
  padding: 0 0 20px;
  font-weight: 700;
}
</style>
