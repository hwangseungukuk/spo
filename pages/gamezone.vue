<template>
  <div class="m-container">
    <head-navigator
      icon="header gamezone"
      title="게임존"
      description="다양한 게임을 만나보세요!"
      :items="null"
    ></head-navigator>
    <nuxt-child></nuxt-child>
  </div>
</template>

<script>
import HeadNavigator from '~/components/common/HeadNavigator';

export default {
  components: {
    HeadNavigator,
  },
};
</script>

<style scoped></style>
