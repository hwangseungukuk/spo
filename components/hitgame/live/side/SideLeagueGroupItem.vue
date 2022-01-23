<template>
  <div
    :class="`league-group ${on ? 'on' : ''} ${
      selected ? 'expanded' : 'collapsed'
    }`"
  >
    <button
      :class="`btn btn-sm inline-flex ${selected ? 'expanded' : 'collapsed'}`"
      :disabled="count === 0"
      @click="$emit('onGroupClick', { id, selected })"
    >
      <i :class="`icon-svg live ${icon}`"></i>
      <span>{{ `${name} (${count})` }}</span>
      <div class="spacer"></div>
      <i :class="`icon-svg arrow ${selected ? 'up' : 'down'} thin`"></i>
    </button>
    <b-collapse v-model="selected">
      <div class="league-items">
        <slot name="league-items"></slot>
      </div>
    </b-collapse>
    <div class="dummy"></div>
  </div>
</template>

<script>
export default {
  props: {
    on: { type: Boolean, default: false },
    selected: { type: Boolean, default: false },
    id: { type: Number, default: null },
    icon: { type: String, default: null },
    name: { type: String, default: null },
    count: { type: Number, default: 0 },
  },
};
</script>

<style scoped>
.league-group {
  padding: 0 15px;
}

.league-group .btn {
  font-size: 12px;
  font-weight: 700;
  height: 40px;
  width: calc(100% - 10px);
  padding: 0;
  margin: 0 5px;
  color: #888888;
  align-items: center;
}

.league-group .btn:disabled {
  opacity: 1;
}

.league-group .btn.expanded,
.league-group.on .btn {
  color: #3eb2c0;
}

.league-group .btn .icon-svg {
  width: 16px;
  height: 16px;
  background-color: #888888;
  margin-right: 10px;
}

.league-group .btn .icon-svg.arrow {
  width: 14px;
  height: 14px;
  background-color: #e6e6e6;
  margin-right: 0;
}

.league-group.on .btn .icon-svg,
.league-group .btn.expanded .icon-svg {
  background-color: #3eb2c0;
}

div.dummy {
  height: 0;
  transition: all 0.3s;
}

.league-group:last-child.expanded .dummy {
  height: 15px;
}
</style>
