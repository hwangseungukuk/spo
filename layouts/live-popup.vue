<template>
  <div class="live-popup">
    <nuxt></nuxt>
  </div>
</template>

<script>
export default {
  head() {
    return {
      style: [{ cssText: 'body { overflow: hidden; }', type: 'text/css' }],
    };
  },
};
</script>

<style scoped>
.live-popup {
  overflow: hidden;
  background-color: white;
  min-height: 850px;
}

.m-container {
  width: 100%;
}
</style>
