<template>
  <div class="board gallery item skeleton flex">
    <div class="label title">
      <b-skeleton :style="`width: ${getRandomWidth(188, 64)}px`"></b-skeleton>
    </div>
    <div class="label image">
      <b-skeleton-img width="188px" height="200px"></b-skeleton-img>
    </div>
    <div class="label desc">
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
.board.gallery {
  position: relative;
  width: 279px;
  min-height: 360px;
  display: inline-block;
  border: 1px solid #d9d9d9;
  border-radius: 10px;
  margin-right: 21px;
  margin-bottom: 20px;
  text-align: center;
  transform: skew(-0.03deg);
  z-index: 1;
  padding-bottom: 10px;
}

.board.gallery:nth-child(3n + 3) {
  margin-right: 0px;
}

.label.title {
  padding: 19px;
  border-bottom: 1px solid #f2f2f2;
  margin-bottom: 20px;
}

.label.image {
  margin: 0 0 20px;
}

.label.title .b-skeleton,
.label.image .b-skeleton {
  margin: 0 auto;
}

.label.desc {
  padding: 15px;
}
</style>
