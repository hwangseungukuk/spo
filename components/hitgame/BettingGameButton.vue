<template>
  <button
    :class="`btn btn-sm bet inline-flex ${id} ${selected ? 'selected' : ''} ${
      rateUpdated ? 'updated' : ''
    }`"
    :disabled="!active"
    @click="onClick"
  >
    <span class="label">
      {{ label !== null ? label : '' }}
    </span>
    <div class="spacer"></div>
    <i
      v-show="active && arrow !== null"
      :class="`icon-svg rate ${arrow !== null ? arrow : ''}`"
    ></i>
    <span v-show="active">{{ rate !== null ? getRate(rate) : '' }}</span>
    <div v-show="!active" class="overlay">
      <i class="icon-svg locked"></i>
    </div>
  </button>
</template>

<script>
export default {
  props: {
    id: { type: [String, Number], default: null },
    active: { type: Boolean, default: false },
    label: { type: String, default: null },
    arrow: { type: String, default: null },
    rate: { type: Number, default: null },
    blink: { type: Boolean, default: false },
    selected: { type: Boolean, default: false },
  },
  data() {
    return {
      rateUpdated: false,
    };
  },
  watch: {
    rate(v) {
      this.rateUpdated = true;
      setTimeout(() => {
        this.rateUpdated = false;
      }, 500);
    },
  },
  methods: {
    getRate(rate) {
      try {
        return rate.toFixed(2);
      } catch (e) {
        return rate;
      }
    },
    onClick() {
      const { id, rate, label, selected, arrow, active } = this;
      this.$emit('click', {
        OutcomeId: id,
        Rate: rate,
        OutcomeIdName: label,
        Arrow: arrow,
        Active: active,
        selected,
      });
    },
  },
};
</script>

<style scoped>
.btn.bet {
  position: relative;
  font-size: 12px;
  font-weight: 700;
  color: #444444;
  border-radius: 5px;
  border: 1px solid #e6e6e6;
  background-color: white;
  height: 30px;
  padding: 2px 10px 0;
  align-items: center;
}

.btn.bet.updated {
  color: white;
  border-color: #3eb2c0;
  background-color: #3eb2c0;
}

.btn.bet:disabled {
  opacity: 1;
}

.btn.bet.selected {
  background: linear-gradient(90deg, #5da9d6 0%, #70d0c9 100%);
  color: white;
  border: 1px solid white;
}

span.label {
  max-width: calc(100% - 60px);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.btn.bet > .overlay {
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  position: absolute;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: rgba(0, 0, 0, 0.4);
  border-radius: 5px;
}

.btn.bet > .overlay .icon-svg.locked {
  width: 16px;
  height: 16px;
  background-color: white;
}

i.icon-svg.rate {
  width: 10px;
  height: 10px;
  margin-right: 10px;
  margin-bottom: 2px;
}

i.icon-svg.rate.null,
i.icon-svg.rate.equal {
  display: none;
}
</style>
