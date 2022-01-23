<template>
  <div class="news-board detail contents">
    <div v-if="!loading" class="html-contents" v-html="contents"></div>
    <b-skeleton-img v-if="loading" aspect="3:1"></b-skeleton-img>
    <b-skeleton v-if="loading" :width="`${getWidth}px`"></b-skeleton>
    <b-skeleton v-if="loading" :width="`${getWidth}px`"></b-skeleton>
    <b-skeleton v-if="loading" :width="`${getWidth}px`"></b-skeleton>
  </div>
</template>

<script>
export default {
  props: {
    loading: { type: Boolean, default: false },
    contents: { type: String, default: null },
  },
  computed: {
    getWidth() {
      return Math.random() * (800 - 200) + 200;
    },
  },
};
</script>

<style scoped>
div.detail.contents {
  padding: 0 20px 10px;
  margin-bottom: 10px;
  min-height: 320px;
}

.b-aspect,
.b-skeleton {
  margin-bottom: 10px;
}
</style>
