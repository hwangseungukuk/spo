<template>
  <div class="m-container">
    <head-navigator
      icon="header news"
      title="새소식"
      description="스포라이브의 소식을 확인해보세요!"
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
    if (route.name.includes('news') && route.name !== 'news') {
      return;
    }
    const firstMenu = store.state.news.menu.menus[0];
    redirect({
      name: firstMenu.name,
      params: { ...firstMenu.params },
      query: { page: 1 },
    });
  },
  data() {
    return {
      path: null,
    };
  },
  computed: {
    ...mapState('news/menu', ['menus']),
  },
  watch: {
    $route(route) {
      this.path = route.params
        ? route.params.path
          ? route.params.path
          : 'notice'
        : 'notice';
      if (route.name.includes('news') && route.name !== 'news') {
        return;
      }
      this.$router.push({
        name: this.menus[0].name,
        params: { ...this.menus[0].params },
        query: { page: 1 },
      });
    },
  },
  path(v, o) {
    if (v === null && (o || o !== null)) {
      this.path = o;
      return;
    }
    console.log('path', v);
  },
  beforeMount() {
    this.path = this.$route.params.path || 'notice';
  },
};
</script>

<style scoped>
div.board-container {
  margin-bottom: 40px;
}
</style>
