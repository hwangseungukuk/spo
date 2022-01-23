<template>
  <div class="m-container">
    <head-navigator
      icon="header mypage"
      title="마이페이지"
      description="나의 스포라이브 이용 현황을 확인해보세요!"
      :items="MENUS"
    ></head-navigator>
    <nuxt-child></nuxt-child>
  </div>
</template>

<script>
import HeadNavigator from '~/components/common/HeadNavigator';

const MENUS = [
  {
    label: '적중내역',
    name: 'mypage-hitgame',
  },
  {
    label: '인벤토리',
    name: 'mypage-inventory',
  },
  {
    label: '구매내역',
    name: 'mypage-history',
  },
  {
    label: '고객센터',
    name: 'mypage-customer',
  },
];

export default {
  components: {
    HeadNavigator,
  },
  asyncData({ redirect, route }) {
    if (route.name.includes('mypage') && route.name !== 'mypage') {
      return;
    }
    redirect({ name: 'mypage-hitgame' });
  },
  data() {
    return {
      MENUS,
    };
  },
  watch: {
    $route(route) {
      if (route.name.includes('mypage') && route.name !== 'mypage') {
        return;
      }
      this.$router.push({ name: 'mypage-hitgame' });
    },
  },
};
</script>

<style scoped></style>
