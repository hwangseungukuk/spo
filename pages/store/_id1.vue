<template>
  <div class="guide-container">
    <sub-head-navigator
      v-if="!$route.params.id"
      :items="getSubMenu(`${$route.params.id1}`)"
    ></sub-head-navigator>
    <nuxt-child></nuxt-child>
  </div>
</template>

<script>
import { mapState, mapGetters } from 'vuex';

import SubHeadNavigator from '~/components/common/SubHeadNavigator';

export default {
  components: {
    SubHeadNavigator,
  },
  asyncData({ store, route, redirect }) {
    console.log('asyncData:1');
    if (route.name.includes('store-id1') && route.name !== 'store-id1') {
      return;
    }
    const firstMenu =
      store.state.store.menu.menus[route.params.id1 === '10' ? 0 : 1].subs[0];
    redirect({ name: firstMenu.name, params: { ...firstMenu.params } });
  },
  computed: {
    ...mapState('store/menu', ['menus']),
    ...mapGetters('store/menu', ['getSubMenu']),
  },
  watch: {
    $route(store, route, redirect) {
      console.log('asyncData:2');
      if (route.name.includes('store-id1') && route.name !== 'store-id1') {
        return;
      }
      this.$router.push({
        name: this.menus[route.params.id1 === '10' ? 0 : 1].subs[0].name,
        params: {
          ...this.menus[route.params.id1 === '10' ? 0 : 1].subs[0].params,
        },
      });
      // const firstMenu =
      //   store.state.store.menu.menus[route.params.id1 === '10' ? 0 : 1].subs[0];
      // redirect({ name: firstMenu.name, params: { ...firstMenu.params } });
    },
  },
  beforeMount() {
    // if (route.name.includes('store-id1') && route.name !== 'store-id1') {
    //   return;
    // }
    // const firstMenu =
    //   store.state.store.menu.menus[route.params.id1 === '10' ? 0 : 1].subs[0];
    // redirect({ name: firstMenu.name, params: { ...firstMenu.params } });
  },
};
</script>

<style scoped>
div.guide-container >>> div.guide-content {
  padding: 20px;
}
</style>
