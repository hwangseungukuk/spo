<template>
  <div class="m-container">
    <head-navigator
      icon="header community"
      title="커뮤니티"
      description="경기 영상과 정보 공유 및 의견을 나누어보세요!"
      :items="menus"
    ></head-navigator>
    <div class="board-container">
      <nuxt-child :path="path"></nuxt-child>
    </div>
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
    if (route.name.includes('community') && route.name !== 'community') {
      return;
    }
    const firstMenu = store.state.community.menu.menus[0];
    redirect({ name: firstMenu.name, params: { ...firstMenu.params } });
    return {
      path: firstMenu.params.path,
    };
  },
  data() {
    return {
      path: null,
    };
  },
  computed: {
    ...mapState('community/menu', ['menus']),
  },
  watch: {
    $route(route) {
      this.path = route.params
        ? route.params.path
          ? route.params.path
          : 'analysis_new'
        : 'analysis_new';
      if (route.name.includes('community') && route.name !== 'community') {
        return;
      }
      this.$router.push({
        name: this.menus[0].name,
        params: { ...this.menus[0].params },
      });
    },
    path(v, o) {
      if (v === null && (o || o !== null)) {
        this.path = o;
        return;
      }
      console.log('path', v);
    },
  },
  beforeMount() {
    this.path = this.$route.params.path || 'analysis_new';
  },
};
</script>

<style scoped>
div.board-container {
  margin-bottom: 40px;
}
</style>
