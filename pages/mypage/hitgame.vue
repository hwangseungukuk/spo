<template>
  <div>
    <sub-head-navigator :items="MENUS"></sub-head-navigator>
    <nuxt-child></nuxt-child>
  </div>
</template>

<script>
import { createNamespacedHelpers } from 'vuex';

import SubHeadNavigator from '~/components/common/SubHeadNavigator';

const MENUS = [
  {
    label: '승무패',
    name: 'mypage-hitgame-srs',
  },
  {
    label: '라이브',
    name: 'mypage-hitgame-live',
  },
  {
    label: '스페셜',
    name: 'mypage-hitgame-special',
  },
  {
    label: '캐주얼게임',
    name: 'mypage-hitgame-casual',
  },
];

export default {
  components: {
    SubHeadNavigator,
  },
  asyncData({ redirect, route }) {
    if (
      route.name.includes('mypage-hitgame') &&
      route.name !== 'mypage-hitgame'
    ) {
      return;
    }
    redirect({ name: 'mypage-hitgame-srs' });
  },
  data() {
    return {
      MENUS,
    };
  },
  watch: {
    $route(route) {
      if (
        route.name.includes('mypage-hitgame') &&
        route.name !== 'mypage-hitgame'
      ) {
        return;
      }
      this.$router.push({ name: 'mypage-hitgame-srs' });
    },
  },
};
</script>

<style scoped>
div.sub-tabs {
  width: 1000px;
  height: 50px;
  padding: 10px 20px;
  background-color: white;
  display: flex;
  align-items: center;
  border-radius: 0 0 10px 10px;
}

div.sub-tabs .sub-tab {
  width: 100px;
  height: 35px;
  border-radius: 10px;
  background-color: transparent;
  border: unset;
  color: #888888;
  transition: all 0.5s;
}

div.sub-tabs .sub-tab:hover,
div.sub-tabs .sub-tab:active,
div.sub-tabs .sub-tab.on {
  outline: unset;
  box-shadow: unset;
}

div.sub-tabs .sub-tab:hover {
  background-color: #ebf7f9cc;
  color: #3eb2c0cc;
}

div.sub-tabs .sub-tab.on {
  font-weight: 800;
  background-color: #ebf7f9;
  color: #3eb2c0;
}
</style>
