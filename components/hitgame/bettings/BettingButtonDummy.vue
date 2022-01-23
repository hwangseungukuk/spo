<template>
  <button class="btn btn-sm bet inline-flex dummy" disabled>
    <span class="label">
      {{ label !== null ? label : '' }}
    </span>
  </button>
</template>

<script>
export default {
  props: {
    label: { type: [String, Number], default: null },
  },
};
</script>

<style scoped>
.btn.bet.dummy {
  position: relative;
  font-size: 12px;
  font-weight: 400;
  color: #888888;
  border-radius: 5px;
  border: 1px solid #e6e6e6;
  background-color: #f2f2f2;
  height: 30px;
  padding: 2px 10px 0;
  align-items: center;
  justify-content: center;
}

.btn.bet:disabled {
  opacity: 1;
}

span.label {
  max-width: calc(100% - 60px);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>
