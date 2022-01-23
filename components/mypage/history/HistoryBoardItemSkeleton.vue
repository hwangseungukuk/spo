<template>
  <div class="board item skeleton flex">
    <div class="label number">
      <b-skeleton></b-skeleton>
    </div>
    <div class="label title">
      <b-skeleton :style="`width: ${getRandomWidth(450, 150)}px`"></b-skeleton>
    </div>
    <div class="label writer">
      <b-skeleton :style="`width: ${getRandomWidth(110, 50)}px`"></b-skeleton>
    </div>
    <div class="label date">
      <b-skeleton></b-skeleton>
    </div>
    <div class="label read">
      <b-skeleton></b-skeleton>
    </div>
  </div>
</template>

<script>
export default {
  methods: {
    getRandomWidth(max, min) {
      return Math.random() * (max - min) + min;
    },
  },
};
</script>

<style scoped>
div.board.item {
  height: 40px;
  align-items: center;
}

.label {
  padding: 10px;
}

.label:not(.title) > * {
  margin: 0 auto;
}

.label.number,
.label.read {
  width: 80px;
}

.label.title {
  flex: 1;
}

.label.title > * {
  max-width: 450px;
}

.label.writer,
.label.date {
  width: 125px;
}
</style>
