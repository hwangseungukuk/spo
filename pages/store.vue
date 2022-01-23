<template>
  <div class="m-container">
    <head-navigator
      icon="header store"
      title="상점"
      description="스포코인으로 상품을 구입해 보세요!"
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
    if (route.name.includes('store') && route.name !== 'store') {
      return;
    }
    const firstMenu = store.state.store.menu.menus[0];
    redirect({ name: firstMenu.name, params: { ...firstMenu.params } });
  },
  computed: {
    ...mapState('store/menu', ['menus']),
  },
  watch: {
    $route(route) {
      if (route.name.includes('store') && route.name !== 'store') {
        return;
      }
      this.$router.push({
        name: this.menus[0].name,
        params: { ...this.menus[0].params },
      });
    },
  },
};
</script>

<style scoped>
div.board-container {
  margin-bottom: 40px;
}
</style>
