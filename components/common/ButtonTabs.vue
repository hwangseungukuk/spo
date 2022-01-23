<template>
  <div class="button-tabs">
    <div class="button-group flex">
      <b-btn
        v-for="(item, index) in items"
        :key="`button-tabs-${item.value}-${index}`"
        size="sm"
        variant="secondary"
        :class="current === item.value ? 'on' : ''"
        @click="onItemClick(item.value)"
      >
        <span>{{ item.text }}</span>
      </b-btn>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    items: { type: Array, default: () => [{ text: 'Text', value: 'value' }] },
    value: { type: [String, Number], default: null },
  },
  data() {
    return {
      current: null,
    };
  },
  watch: {
    value(v) {
      this.current = v;
    },
  },
  beforeMount() {
    if (this.value) this.current = this.value;
    else this.current = this.items[0].value;
  },
  methods: {
    onItemClick(value) {
      this.current = value;
      this.$emit('change', this.current);
    },
  },
};
</script>

<style scoped>
.button-tabs {
  width: 100%;
  text-align: center;
}

.button-group {
  border-radius: 10px;
  background-color: #f2f2f2;
  width: fit-content;
  margin: 0 auto;
}

.button-group .btn {
  width: 150px;
  height: 35px;
  font-size: 14px;
  font-weight: 700;
  border-radius: 10px;
  color: #aaaaaa;
}

.button-group .btn,
.button-group .btn:hover,
.button-group .btn:focus {
  background-color: transparent;
  border: 1px solid transparent;
  outline: unset;
  box-shadow: unset;
}

.button-group .btn:active,
.button-group .btn.on {
  color: #3eb2c0;
  border: 1px solid #3eb2c0;
  background-color: #d8f0f3;
}
</style>
