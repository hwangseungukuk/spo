<template>
  <div class="switch-group">
    <b-form-checkbox
      v-model="mChecked"
      :checked="checked"
      name="enabled-scroll-lock"
      switch
      size="lg"
    ></b-form-checkbox>
    <p>{{ label }}</p>
  </div>
</template>

<script>
export default {
  props: {
    label: { type: String, default: 'label' },
    checked: { type: Boolean, default: false },
  },
  data() {
    return {
      mChecked: false,
    };
  },
  watch: {
    mChecked(v) {
      this.$emit('change', v);
    },
  },
  beforeMount() {
    this.mChecked = this.checked;
  },
};
</script>

<style scoped>
div.switch-group {
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

div.switch-group > p {
  margin-bottom: 0;
  font-size: 12px;
  color: #888888;
}
</style>
