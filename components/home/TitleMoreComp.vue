<template>
  <div v-if="title !== null" class="title">
    {{ title }}
    <nuxt-link
      v-if="routerName !== null"
      tag="button"
      class="btn btn-light btn-sm"
      :to="{
        name: routerName,
        params: { path: routerPath },
      }"
    >
      more
    </nuxt-link>
  </div>
</template>

<script>
export default {
  props: {
    title: { type: String, default: null },
    routerName: { type: String, default: null },
    routerPath: { type: String, default: null },
  },
};
</script>

<style scoped>
div.title {
  font-size: 18px;
  font-weight: 800;
  margin-bottom: 5px;
  position: relative;
}

button.btn {
  background-color: #e6e6e6;
  border: 1px solid #d9d9d9;
  border-radius: 5px;
  color: #999999;
  font-size: 12px;
  font-weight: 400;
  height: 25px;
  width: 60px;
  margin-left: 10px;
  line-height: 1;
  position: absolute;
  right: 0;
  top: 0;
}
</style>
