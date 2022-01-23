<template>
  <div class="m-container">
    <head-navigator
      icon="header picks"
      title="픽정보"
      description="골라주는 스포츠 정보!"
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
