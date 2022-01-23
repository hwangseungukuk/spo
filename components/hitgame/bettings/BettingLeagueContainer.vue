<template>
  <div class="league-container">
    <div class="header default-ctn">
      <i
        v-if="arrow"
        class="icon-svg arrow left thin"
        @click="$emit('arrow')"
      ></i>
      <i :class="`icon-svg ${getSportValue(sport)}`"></i>
      <p>
        {{ league }}
      </p>
    </div>
    <div class="game-list default-ctn">
      <slot></slot>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    sport: { type: Number, default: 0 },
    league: { type: String, default: null },
    arrow: { type: Boolean, default: false },
  },
};
</script>

<style scoped>
.league-container {
  width: 100%;
}

.header {
  align-items: center;
  color: #fffb9b;
  display: flex;
  font-weight: 800;
  min-height: 35px;
  padding: 0px 16px;
  background: transparent linear-gradient(90deg, #5da9d6 0%, #70d0c9 100%) 0% 0%
    no-repeat padding-box;
}

.header > p {
  font-size: 14px;
  margin: 0;
  line-height: 1.2;
}

.icon-svg:not(.arrow) {
  background-color: #fffb9b;
  margin-right: 8px;
  width: 16px;
  height: 16px;
}

.icon-svg.arrow {
  background-color: white;
  opacity: 0.8;
  width: 12px;
  height: 12px;
  margin-right: 12px;
}

.icon-svg.arrow:hover {
  opacity: 1;
  cursor: pointer;
}

div.game-list {
  background-color: white;
}
</style>
