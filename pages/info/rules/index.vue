<template>
  <div>
    <p>{{ path }}</p>
  </div>
</template>

<script>
export default {
  data() {
    return {
      path: null,
    };
  },
  beforeMount() {
    const pathSplitted = this.$route.path.split('/');
    this.path = pathSplitted[pathSplitted.length - 1];
  },
};
</script>

<style scoped></style>
