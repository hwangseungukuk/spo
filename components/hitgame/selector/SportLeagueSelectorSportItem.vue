<template>
  <button
    :class="`btn ${selected ? 'selected' : ''} ${on ? 'on' : ''}`"
    @click="$emit('click', { code })"
  >
    <i :class="`icon-svg ${value}`"></i>
    <p>
      {{
        `${text} ${
          selectedAll
            ? '(전체)'
            : selectedLength > 0
            ? `(${selectedLength})`
            : ''
        }`
      }}
    </p>
  </button>
</template>

<script>
export default {
  props: {
    code: { type: Number, default: 0 },
    text: { type: String, default: 'sport.text' },
    value: { type: String, default: 'sport.value' },
    selected: { type: Boolean, default: false },
    selectedAll: { type: Boolean, default: false },
    selectedLength: { type: Number, default: 0 },
  },
  computed: {
    on() {
      const { selectedAll, selectedLength } = this;
      return selectedAll || selectedLength > 0;
    },
  },
};
</script>

<style scoped>
.btn {
  width: 100%;
  height: 35px;
  display: inline-flex;
  border-radius: 0;
  color: #aaaaaa;
  padding: 20px;
  font-weight: 800;
  align-items: center;
  font-size: 12px;
  transition: all 0.3s;
  border-top: unset;
  border-right: unset;
  border-left: unset;
  border-bottom: 1px solid transparent;
}

.btn,
.btn:hover,
.btn:focus,
.btn:active,
.btn.on {
  background-color: unset;
  outline: unset;
  box-shadow: unset;
}

.btn:active,
.btn.on,
.btn.selected {
  color: #3eb2c0;
}

.btn:hover,
.btn.selected {
  background-color: #ebf7f9;
}

.btn i.icon-svg {
  width: 16px;
  height: 16px;
  margin-bottom: 2px;
  margin-right: 10px;
  background-color: #aaaaaa;
  transition: all 0.3s;
}

.btn:active i.icon-svg,
.btn.on i.icon-svg,
.btn.selected i.icon-svg {
  background-color: #3eb2c0;
}
</style>
