<template>
  <div class="live-status-bar default-ctn flex">
    <p class="live">
      <span class="status">LIVE</span>
      {{ live }}
    </p>
    <p class="wait">
      <span class="status">예정</span>
      {{ wait }}
    </p>
    <div class="spacer"></div>
    <p class="current-time">
      <span>TIME</span>
      <span v-html="getCurrentTime"></span>
    </p>
    <button class="btn btn-sm match-schedule" @click="$emit('schedule')">
      <i class="icon-svg calendar"></i>
      <span>LIVE 게임 일정</span>
    </button>
  </div>
</template>

<script>
let timerInterval = null;

export default {
  props: {
    live: { type: Number, default: 0 },
    wait: { type: Number, default: 0 },
  },
  data() {
    return {
      currentTime: new Date(),
    };
  },
  computed: {
    getCurrentTime() {
      const time = this.$moment(this.currentTime);
      if (time.get('hour') >= 12) {
        return `${time.format('h : mm : ss')}&nbsp;&nbsp;PM`;
      } else {
        return `${time.format('h : mm : ss')}&nbsp;&nbsp;AM`;
      }
    },
  },
  mounted() {
    timerInterval = setInterval(() => {
      this.currentTime = new Date();
    }, 1000);
  },
  beforeDestroy() {
    clearInterval(timerInterval);
  },
};
</script>

<style scoped>
.live-status-bar {
  border-radius: 0 0 10px 10px;
  height: 55px;
  padding: 10px 20px;
  align-items: center;
}

span.status {
  display: inline-block;
  font-weight: 700;
  width: 58px;
  height: 22px;
  color: white;
  text-align: center;
  border-radius: 25px;
  padding-top: 3px;
  margin-right: 10px;
  font-size: 12px;
}

p.live span.status::before {
  content: '';
  margin-right: 5px;
  width: 6px;
  height: 6px;
  vertical-align: middle;
  border-radius: 50%;
  margin-bottom: 2px;
  background-color: white;
  display: inline-block;
}

p {
  font-size: 14px;
  font-weight: 800;
  margin-bottom: 0;
}

p:first-child {
  margin-right: 20px;
}

p.live {
  color: #df2f5e;
}

p.live span.status {
  background-color: #df2f5e;
}

p.wait {
  color: #4673b6;
}

p.wait span.status {
  background-color: #4673b6;
}

p.wait span.status::before {
  content: unset;
  margin-right: unset;
}

p.current-time {
  margin-right: 20px;
  font-weight: 800;
}

p.current-time span:first-child {
  color: #3eb2c0;
  margin-right: 8px;
}

.btn.match-schedule {
  font-size: 14px;
  font-weight: 800;
  height: 35px;
  padding: 0 12px;
}

.btn.match-schedule .icon-svg {
  width: 16px;
  height: 16px;
  background-color: #aaaaaa;
  vertical-align: middle;
  margin-right: 10px;
}

.btn.match-schedule,
.btn.match-schedule:focus {
  background-color: #f2f2f2;
  color: #aaaaaa;
}

.btn.match-schedule:hover {
  color: #888888;
  background-color: #e9e9e9;
}

.btn.match-schedule:active {
  color: #444444;
  background-color: #d6d6d6;
}

.btn.match-schedule:hover .icon-svg,
.btn.match-schedule:active .icon-svg {
  background-color: #888888;
}
</style>
