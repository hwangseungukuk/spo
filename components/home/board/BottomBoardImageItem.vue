<template>
  <div class="item" @click="$emit('click', { id, path })">
    <div class="image" :style="`background-image: url(${image})`"></div>
    <p>
      {{ title }}
    </p>
  </div>
</template>

<script>
export default {
  props: {
    id: { type: Number, default: 0 },
    path: { type: String, default: 'path' },
    title: { type: String, default: 'title' },
    image: { type: String, default: null },
  },
};
</script>

<style scoped>
div.item {
  position: relative;
  flex: 1;
}

div.image {
  width: 130px;
  height: 90px;
  text-align: center;
  border-radius: 10px;
  margin: 0 auto 10px;
  background-color: #e6e6e6;
  border: 1px solid #d9d9d9;
  transition: all 0.5s;
}

div.image:hover {
  cursor: pointer;
}

p {
  max-width: 120px;
  margin: 0 auto;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  text-align: center;
}

div.item:hover div.image {
  box-shadow: 0px 1px 1px 0 rgba(0, 0, 0, 0.2);
  transition: all 0.5s;
}

div.item:hover p {
  text-decoration: underline;
}
</style>
