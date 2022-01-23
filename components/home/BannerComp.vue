<template>
  <div :class="`swiper-slide ${single ? 'single' : ''}`">
    <a :href="link" :target="target">
      <div class="image" :style="`background-image: url(${image})`">
        <p>{{ title }}</p>
      </div>
    </a>
  </div>
</template>

<script>
export default {
  props: {
    link: { type: String, default: null },
    target: { type: String, default: null },
    image: { type: String, default: null },
    title: { type: String, default: null },
    single: { type: Boolean, default: null },
  },
};
</script>

<style scoped>
div.image {
  width: 100%;
  height: 100%;
}

div.image p {
  color: transparent;
  display: none;
}
</style>
