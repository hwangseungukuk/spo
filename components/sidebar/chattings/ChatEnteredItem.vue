<template>
  <div class="chat-item">
    <p>
      {{ message }}
    </p>
  </div>
</template>

<script>
export default {
  props: {
    message: { type: String, default: 'message' },
  },
};
</script>

<style scoped>
div.chat-item {
  position: relative;
}

p {
  font-weight: 800;
  color: #666666;
  margin-bottom: 6px;
}
</style>
