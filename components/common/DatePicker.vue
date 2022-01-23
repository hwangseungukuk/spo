<template>
  <div class="position-relative">
    <datepicker
      v-model="cDate"
      format="yyyy - MM - dd"
      :value="cDate"
      :disabled-dates="disabledDate ? disabledDatesOptions : undefined"
      @closed="$emit('closed')"
    ></datepicker>
    <i class="icon-svg calendar"></i>
  </div>
</template>

<script>
import Datepicker from 'vuejs-datepicker';

export default {
  components: {
    Datepicker,
  },
  props: {
    disabledDate: { type: Boolean, default: false },
    date: { type: Date, default: null },
    minAt: { type: Date, default: null },
    maxAt: { type: Date, default: null },
    format: { type: String, default: 'YYYY - MM - DD' },
  },
  data() {
    return {
      disabledDatesOptions: {
        from: new Date(),
      },
      cDate: null,
      showCalendar: false,
      isShowFirst: false,
    };
  },
  watch: {
    date(v) {
      this.cDate = v;
    },
    cDate(v, old) {
      this.$emit('change', v);
    },
    showCalendar(v) {
      if (this.isShowFirst) {
        return;
      }
      this.isShowFirst = true;
    },
  },
  beforeMount() {
    this.cDate = this.date === null ? new Date() : this.date;
  },
};
</script>

<style scoped>
.icon-svg.calendar {
  background-color: #3eb2c0;
  width: 20px;
  height: 20px;
  position: absolute;
  top: 5px;
  right: 5px;
  pointer-events: none;
}

div.vdp-datepicker >>> input {
  border-radius: 5px;
  border: 1px solid #d9d9d9;
  width: 130px;
  height: 30px;
  font-size: 12px;
  padding: 0 10px;
  line-height: 0.8;
  color: #999999;
}

div.vdp-datepicker >>> input:focus {
  outline: unset;
  box-shadow: 0 0 0 2px #3eb2c0aa;
}

@keyframes fadeIn {
  0% {
    visibility: visible;
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
}

@keyframes fadeOut {
  0% {
    opacity: 1;
  }
  99% {
    opacity: 0;
  }
  100% {
    opacity: 0;
    visibility: hidden;
  }
}
</style>
