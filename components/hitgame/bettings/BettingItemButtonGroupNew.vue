<template>
  <div class="bt-row flex">
    <p class="game-type">{{ type }}</p>
    <div class="bet-items flex">
      <slot name="bet-items"></slot>
    </div>
    <div class="buttons">
      <slot name="buttons"></slot>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    type: { type: String, default: null },
  },
};
</script>

<style scoped>
div.bt-row {
  min-height: 30px;
  padding-bottom: 5px;
  align-items: center;
}

div.bt-row:last-of-type {
  padding-bottom: 0;
}

p {
  display: inline-block;
  width: 40px;
  margin-right: 15px;
  margin-bottom: 0;
}

p.game-type {
  text-align: center;
  color: #888888;
  font-weight: 400;
}

div.bet-items {
  flex: 1;
}

div.buttons {
  width: 100px;
}
</style>
