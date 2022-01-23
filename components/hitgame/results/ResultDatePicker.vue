<template>
  <div class="date-select-container gradient-bg inline-flex">
    <i
      class="icon-svg prev"
      @click="currentDate = $moment(currentDate).add(-1, 'days').toDate()"
    ></i>
    <p class="date-selected">
      {{ $moment(currentDate).format('YYYY년 MM월 DD일 ddd요일') }}
    </p>
    <i
      class="icon-svg next"
      @click="currentDate = $moment(currentDate).add(1, 'days').toDate()"
    ></i>
    <button class="today" @click="currentDate = new Date()">오늘</button>
    <div class="btn-calendar position-absolute">
      <datepicker
        v-model="currentDate"
        format=""
        :value="currentDate"
      ></datepicker>
      <i class="icon-svg calendar"></i>
    </div>
  </div>
</template>

<script>
import Datepicker from 'vuejs-datepicker';

export default {
  components: {
    Datepicker,
  },
  data() {
    return {
      currentDate: new Date(),
    };
  },
  watch: {
    currentDate(v) {
      this.$emit('change', v);
    },
  },
};
</script>

<style scoped>
div.date-select-container {
  width: 100%;
  height: 40px;
  border-radius: 10px;
  position: relative;
  align-items: center;
  justify-content: center;
  padding: 10px 20px;
}

i.icon-svg.next,
i.icon-svg.prev {
  width: 8px;
  height: 12px;
  -webkit-mask-image: url(~assets/icons/gamecenter/results/icon-result-right.svg);
  mask-image: url(~assets/icons/gamecenter/results/icon-result-right.svg);
  background-color: white;
  opacity: 0.8;
  transition: all 0.3s;
}

i.icon-svg.next:hover,
i.icon-svg.prev:hover {
  opacity: 1;
  cursor: pointer;
}

i.icon-svg.prev {
  transform: rotate(180deg);
}

p.date-selected {
  margin-bottom: 0;
  color: #fffb9b;
  font-weight: 800;
  margin: 0 30px;
  font-size: 16px;
}

i.icon-svg.calendar {
  width: 16px;
  height: 16px;
  background-color: white;
}

button.today,
.btn-calendar {
  height: 25px;
  border: 1px solid white;
  border-radius: 5px;
  background-color: rgba(255, 255, 255, 0.15);
  transition: all 0.3s;
}

.btn-calendar > i.icon-svg {
  pointer-events: none;
  position: absolute;
  top: 4px;
  left: 4px;
  transition: all 0.3s;
}

button.today:focus,
.btn-calendar:focus,
button.today:active,
.btn-calendar:active {
  outline: unset;
  box-shadow: unset;
}

button.today:hover,
.btn-calendar:hover {
  background-color: #ffffffcc;
  color: #3eb2c0;
}

.btn-calendar:hover > i.icon-svg {
  background-color: #3eb2c0;
}

button.today:active,
.btn-calendar:active {
  background-color: white;
  color: #3eb2c0;
}

.btn-calendar:active > i.icon-svg {
  background-color: #3eb2c0;
}

button.today {
  width: 70px;
  position: absolute;
  right: 45px;
  color: white;
}

div.btn-calendar {
  width: 25px;
  position: absolute;
  right: 10px;
}

div.btn-calendar div.vdp-datepicker >>> input {
  width: 30px;
  height: 30px;
  opacity: 0;
}

div.btn-calendar div.vdp-datepicker >>> input:hover {
  cursor: pointer;
}

div.btn-calendar .vdp-datepicker >>> .vdp-datepicker__calendar {
  right: -20px;
  top: 35px;
}
</style>
