<template>
  <div class="inline-flex">
    <div class="label-tabs">
      <template v-for="(item, index) in items">
        <button
          :key="`label_tabs_${index}_${item.value}`"
          :class="`label-tab ${selected === item.value ? 'on' : ''}`"
          @click="selected = item.value"
        >
          <i
            v-if="item.icon !== undefined && item.icon !== null"
            :class="`icon-svg ${item.icon}`"
          ></i>
          <p>{{ item.label }}</p>
        </button>
      </template>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    items: {
      type: Array,
      default: () => [{ icon: 'all', value: 'value', label: 'label' }],
    },
  },
  data() {
    return {
      selected: null,
    };
  },
  watch: {
    selected(v) {
      this.$emit('change', v);
    },
  },
  beforeMount() {
    this.selected = this.items[0].value;
  },
};
</script>

<style scoped>
.label-tabs {
  padding-bottom: 10px;
  /*padding-top: 10px;*/
}

.label-tabs .label-tab {
  display: inline-flex;
  color: #aaaaaa;
  align-items: center;
  justify-content: center;
  width: 140px;
  height: 40px;
  background-color: #e6e6e6;
  border-top: 1px solid transparent;
  border-right: 1px solid transparent;
  border-left: 1px solid transparent;
  border-bottom: unset;
  border-radius: 10px 10px 0 0;
  transition: all 0.3s;
  margin-right: 2px;
}

.label-tabs .label-tab:hover {
  color: #3eb2c0;
}

.label-tabs .label-tab:hover .icon-svg {
  background-color: #3eb2c0;
}

.label-tabs .label-tab:focus,
.label-tabs .label-tab:active,
.label-tabs .label-tab.on {
  outline: unset;
  box-shadow: unset;
}

.label-tabs .label-tab p {
  margin-bottom: 0;
  font-size: 14px;
  font-weight: 800;
}

.label-tabs .label-tab.on {
  color: #3eb2c0;
  background-color: transparent;
  border-top: 1px solid #3eb2c0;
  border-right: 1px solid #3eb2c0;
  border-left: 1px solid #3eb2c0;
  border-bottom: unset;
}

.label-tabs .label-tab .icon-svg {
  width: 20px;
  height: 20px;
  background-color: #aaaaaa;
  margin-right: 5px;
  transition: all 0.3s;
  margin-bottom: 1px;
}

.label-tabs .label-tab.on .icon-svg {
  background-color: #3eb2c0;
}

.label-tabs .label-tab .icon-svg.all {
  -webkit-mask-image: url(~assets/icons/gamecenter/hitgame/gamecenter-hitgame-all.svg);
  mask-image: url(~assets/icons/gamecenter/hitgame/gamecenter-hitgame-all.svg);
}
</style>
