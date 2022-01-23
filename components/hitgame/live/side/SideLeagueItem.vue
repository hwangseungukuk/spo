<template>
  <div
    :class="`league-item ${selected ? 'on' : ''} ${opened ? 'expanded' : ''}`"
  >
    <button
      :class="`btn header flex ${opened ? 'expanded' : 'collapsed'}`"
      @click="onExpandClick"
    >
      <div v-if="!scheduled" class="checkbox-ctn" @click="onCheckClick">
        <i v-show="selected" class="icon-svg checkbox inner"></i>
      </div>
      <span>{{ name }}</span>
      <div class="spacer"></div>
      <i :class="`icon-svg arrow ${opened ? 'up' : 'down'}`"></i>
    </button>
    <b-collapse v-model="opened">
      <div class="match-items">
        <slot name="match-items"></slot>
      </div>
    </b-collapse>
  </div>
</template>

<script>
export default {
  props: {
    id: { type: Number, default: 0 },
    name: { type: String, default: 'League name' },
    selected: { type: Boolean, default: false },
    opened: { type: Boolean, default: false },
    scheduled: { type: Boolean, default: false },
  },
  methods: {
    onCheckClick(e) {
      e.stopPropagation();
      const { id, selected } = this;
      this.$emit('select', { id, selected });
    },
    onExpandClick(e) {
      // e.stopPropagation();
      const { id, opened } = this;
      this.$emit('open', { id, opened });
    },
  },
};
</script>

<style scoped>
.league-item {
  background-color: #e6e6e6;
}

.league-item .checkbox-ctn {
  width: 12px;
  height: 12px;
  border-radius: 2px;
  background-color: white;
  margin-right: 5px;
  margin-bottom: 2px;
}

.league-item .checkbox-ctn .icon-svg {
  background-color: #3eb2c0;
  vertical-align: text-top;
  width: 8px;
  height: 8px;
  padding: 0;
}

.league-item > .btn.header {
  width: 100%;
  height: 30px;
  font-size: 12px;
  font-weight: 700;
  color: #444444;
  align-items: center;
  padding: 0 0 0 10px;
}

.league-item > .btn.header span {
  max-width: 120px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  vertical-align: text-top;
}

.league-item > .btn.header .icon-svg:not(.checkbox) {
  background-color: #cccccc;
  width: 8px;
  height: 8px;
  -webkit-mask-size: 8px;
  mask-size: 8px;
  padding: 15px;
}

.league-item.on {
  background-color: #3eb2c0;
}

.league-item.on > .btn.header {
  color: white;
}

.league-item.on > .btn.header .icon-svg:not(.checkbox) {
  background-color: white;
}
</style>
