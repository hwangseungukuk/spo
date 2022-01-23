<template>
  <div class="m-container">
    <head-navigator
      icon="header introduce"
      title="게임소개"
      description="스포라이브의 게임 방법을 확인해보세요!"
      :items="menus"
    ></head-navigator>
    <nuxt-child></nuxt-child>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import HeadNavigator from '~/components/common/HeadNavigator';

export default {
  auth: false,
  components: {
    HeadNavigator,
  },
  asyncData({ store, redirect, route }) {
    const firstMenu = store.state.info.menu.menus[0];
    if (route.name.includes('info') && route.name !== 'info') {
      return;
    }
    redirect({ name: firstMenu.name });
  },
  computed: {
    ...mapState('info/menu', ['menus']),
  },
  watch: {
    $route(route) {
      if (route.name.includes('info') && route.name !== 'info') {
        return;
      }
      this.$router.push({ name: this.menus[0].name });
    },
  },
};
</script>

<style scoped></style>
