<template>
  <div class="board item skeleton">
    <div>
      <div class="s-top">
        <b-skeleton
          :style="`width: ${getRandomWidth(450, 150)}px`"
        ></b-skeleton>
      </div>
    </div>
    <div class="s-body flex">
      <div class="s-left">
        <b-skeleton></b-skeleton>
        <b-skeleton></b-skeleton>
      </div>
      <div class="s-center">
        <b-skeleton></b-skeleton>
      </div>
      <div class="s-right">
        <b-skeleton></b-skeleton>
      </div>
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
  height: 160px;
  align-items: center;
  border: 1px solid red;
  margin-bottom: 20px;
}

.label {
  padding: 10px;
}

.s-top {
  height: 35px;
}
.s-body {
  height: 125px;
}
.s-body .s-left {
  width: 295px;
}
.s-body .s-center {
  width: 525px;
}
.s-body .s-right {
  width: 100px;
}

/* .label:not(.title) > * {
  margin: 0 auto;
} */

/* .label.number,
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
} */
</style>
