<template>
  <div class="wrapper">
    <div v-if="header" class="header">
      <span>
        LIVE
        {{ `(${live})` }}
      </span>
    </div>
    <slot name="leagues"></slot>
  </div>
</template>

<script>
export default {
  props: {
    live: { type: Number, default: 0 },
    header: { type: Boolean, default: true },
  },
  data() {
    return {};
  },
};
</script>

<style scoped>
.wrapper {
  width: 192px;
  max-width: 192px;
  background-color: white;
  border-radius: 10px;
  margin-bottom: 10px;
}

.header {
  padding: 15px 20px;
  color: #444444;
  font-size: 14px;
  font-weight: 800;
  border-bottom: 1px solid #f2f2f2;
}
</style>
