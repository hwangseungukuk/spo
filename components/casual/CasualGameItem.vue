<template>
  <b-col class="casual-game-item" cols="6" @click="$emit('click')">
    <img :src="image" alt="Jump ball Start" />
    <p>{{ description }}</p>
  </b-col>
</template>

<script>
export default {
  props: {
    image: { type: [Object, String], default: () => {} },
    description: { type: String, default: 'description' },
  },
};
</script>

<style scoped>
div.casual-game-item {
  padding-bottom: 20px;
}

div.casual-game-item img {
  width: 425px;
  height: 130px;
  border-radius: 10px;
  transition: all 0.3s;
}

div.casual-game-item:hover img {
  cursor: pointer;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.5);
}

div.casual-game-item:active img {
  box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.8);
}

div.casual-game-item p {
  padding: 20px 0;
  margin-bottom: 0;
  color: #444444;
  text-align: center;
}
</style>
