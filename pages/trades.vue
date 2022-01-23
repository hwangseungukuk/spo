<template>
  <div class="m-container">
    <head-navigator
      icon="header trades"
      title="거래소"
      description="베팅내역을 판매해보세요!"
      :items="menus"
    ></head-navigator>
    <nuxt-child></nuxt-child>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import HeadNavigator from '~/components/common/HeadNavigator';

export default {
  components: {
    HeadNavigator,
  },
  asyncData({ store, redirect, route }) {
    const firstMenu = store.state.trades.menu.menus[0];
    if (route.name.includes('trades') && route.name !== 'trades') {
      return;
    }
    redirect({ name: firstMenu.name });
  },
  // mounted() {
  //   this.$timestamp.$on('timestamp', (v) => {
  //     console.log(v);
  //   });
  // },
  // beforeDestroy() {
  //   this.$timestamp.$off('timestamp');
  // },
  computed: {
    ...mapState('trades/menu', ['menus']),
  },
  watch: {
    $route(route) {
      if (route.name.includes('trades') && route.name !== 'trades') {
        return;
      }
      this.$router.push({ name: this.menus[0].name });
    },
  },
};
</script>

<style scoped></style>
