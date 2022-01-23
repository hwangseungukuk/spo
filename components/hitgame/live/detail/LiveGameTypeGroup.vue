<template>
  <div class="game-type-group">
    <button class="btn btn-sm label flex" @click="expanded = !expanded">
      <span>{{ label }}</span>
      <div class="spacer"></div>
      <i :class="`icon-svg arrow ${expanded ? 'up' : 'down'} thin`"></i>
    </button>
    <b-collapse v-model="expanded">
      <slot></slot>
    </b-collapse>
  </div>
</template>

<script>
export default {
  props: {
    label: { type: String, default: 'label' },
    type: { type: String, default: 'type' },
  },
  data() {
    return {
      expanded: true,
    };
  },
};
</script>

<style scoped>
.game-type-group {
  border-radius: 5px;
  border: 1px solid #e6e6e6;
  background-color: #f2f2f2;
}

.btn.label {
  width: 100%;
  font-weight: 700;
  font-size: 12px;
  padding: 0 10px;
  height: 35px;
  color: #444444;
  align-items: center;
}

.btn.label .icon-svg {
  width: 12px;
  height: 12px;
  background-color: #3eb2c0;
}

div.buttons {
  border-top: 2px dashed #e6e6e6;
  padding: 10px;
}
</style>
