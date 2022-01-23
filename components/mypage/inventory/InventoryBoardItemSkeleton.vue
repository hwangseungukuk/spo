<template>
  <div class="board gallery item skeleton flex">
    <div class="label image">
      <b-skeleton-img height="180px"></b-skeleton-img>
    </div>
    <div class="desc">
      <div class="label title">
        <b-skeleton
          :style="`width: ${getRandomWidth(238, 128)}px`"
        ></b-skeleton>
      </div>
      <div class="label count">
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
.board.gallery {
  position: relative;
  width: 279px;
  min-height: 300px;
  display: inline-block;
  border: 1px solid #d9d9d9;
  border-radius: 10px;
  margin-right: 21px;
  margin-bottom: 20px;
  text-align: center;
  transform: skew(-0.03deg);
  z-index: 1;
}

.board.gallery:nth-child(3n + 3) {
  margin-right: 0px;
}

.board.gallery .desc {
  display: flex;
  justify-content: space-between;
  border-top: 1px solid #e6e6e6;
}

.label {
  padding: 10px;
}

.label.image {
  width: 170px;
  height: 200px;
  margin: 40px auto 40px auto;
  z-index: 2;
}

.label.count {
  width: 39px;
}
</style>
