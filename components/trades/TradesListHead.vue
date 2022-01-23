<template>
  <div class="header">
    <template v-for="(item, index) in headers">
      <div
        :key="`item_${item.className}_${index}`"
        :style="`width: ${item.width}px`"
      >
        <span>{{ item.text }}</span>
      </div>
    </template>
  </div>
</template>

<script>
export default {
  props: {
    headers: { type: Array, default: null },
  },
};
</script>

<style scoped>
div.header {
  width: 100%;
  height: 40px;
  display: flex;
  align-items: center;
  text-align: center;
  background: #f7f7f7;
  font-weight: 600;
}
</style>
