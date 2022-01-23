<template>
  <div class="default-ctn">
    <div class="button-group flex">
      <button
        v-for="(item, index) in items"
        :key="`select-history-modal-tabs-${item.value}-${index}`"
        :class="`${current === item.value ? 'on' : ''}`"
        @click="current = item.value"
      >
        <p>
          {{ item.text }}
          <span v-if="index === 0" class="today">오늘</span>
        </p>
      </button>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    items: { type: Array, default: () => [{ text: 'Text', value: 'Value' }] },
  },
  data() {
    return {
      current: null,
    };
  },
  watch: {
    current(v) {
      this.$emit('change', v);
    },
  },
  beforeMount() {
    this.current = this.items[0].value;
  },
};
</script>

<style scoped>
div.default-ctn {
  margin-bottom: 10px;
}

.button-group {
  margin: 0 auto;
  width: fit-content;
}

.button-group button {
  min-width: 150px;
  height: 45px;
  background-color: unset;
  outline: unset;
  box-shadow: unset;
  border: unset;
  color: #aaaaaa;
  font-size: 14px;
  font-weight: 800;
  padding: 0;
  border-top: 4px solid transparent;
  border-bottom: 4px solid transparent;
}

.button-group button:hover {
  border-bottom: 4px solid #3c577eaa;
}

.button-group button:active,
.button-group button.on {
  color: #444444;
  border-bottom: 4px solid #3c577e;
}

.button-group button,
.button-group button:hover,
.button-group button:focus,
.button-group button:active {
  background-color: unset;
  outline: unset;
  box-shadow: unset;
  border-radius: unset;
}

.button-group button > p {
  margin: 0;
}

.button-group button span.today {
  color: white;
  background-color: #3eb2c0;
  padding: 2px 8px 0;
  border-radius: 5px;
  font-size: 12px;
  font-weight: 700;
  display: inline-block;
}
</style>
