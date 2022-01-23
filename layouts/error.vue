<template>
  <div class="error-container default-ctn">
    <h2 v-if="error.statusCode === 404">
      <span>페이지를 찾을 수 없습니다.</span>
    </h2>
    <h1 v-else>오류가 발생하였습니다.</h1>
    <nuxt-link :to="{ name: 'index' }">메인으로 돌아가기</nuxt-link>
  </div>
</template>

<script>
export default {
  props: {
    error: { type: Object, default: () => {} },
  },
  mounted() {
    console.error(this.error.statusCode);
    console.error(this.error);
  },
};
</script>

<style scoped>
div.error-container {
  padding: 40px 40px 25px;
  min-height: 320px;
}
</style>
