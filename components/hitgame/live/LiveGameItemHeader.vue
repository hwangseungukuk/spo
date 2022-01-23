<template>
  <div
    :class="`header flex ${isGameWaiting ? 'wait' : ''}`"
    @click="$emit('click')"
  >
    <p class="team-name home">
      {{ homeTeam }}
    </p>
    <div class="score-status">
      <p class="score">
        <i
          v-if="!isGameWaiting && setScore"
          :class="`dotted serve ${serve === 1 ? 'show' : 'hide'}`"
          style="margin-right: 10px"
        ></i>
        {{ status !== 0 ? homeScore : '-' }}
      </p>
      <p
        :class="`status ${setScore ? 'set' : ''} ${
          isGameWaiting ? 'wait' : ''
        }`"
      >
        <span v-if="!isGameWaiting && setScore" class="set-score">
          {{ homeSetScore }}
        </span>
        {{ getStatusText }}
        <span v-if="!isGameWaiting && setScore" class="set-score">
          {{ awaySetScore }}
        </span>
      </p>
      <p class="score">
        {{ status !== 0 ? awayScore : '-' }}
        <i
          v-if="!isGameWaiting && setScore"
          :class="`dotted serve ${serve === 2 ? 'show' : 'hide'}`"
          style="margin-left: 10px"
        ></i>
      </p>
    </div>
    <p class="team-name away">
      {{ awayTeam }}
    </p>
    <button class="btn analysis btn-sm" @click="onAnalysisClick">
      <i class="icon-svg analysis"></i>
    </button>
  </div>
</template>

<script>
export default {
  props: {
    id: { type: Number, default: 0 },
    status: { type: Number, default: 0 },
    date: { type: Date, default: () => new Date() },
    remainingTime: { type: String, default: null },
    awayTeam: { type: String, default: 'Away team' },
    awayScore: { type: Number, default: 0 },
    awaySetScore: { type: Number, default: 0 },
    homeTeam: { type: String, default: 'Home team' },
    homeScore: { type: Number, default: 0 },
    homeSetScore: { type: Number, default: 0 },
    setScore: { type: Boolean, default: false },
    serve: { type: Number, default: null },
  },
  computed: {
    isGameWaiting() {
      return this.status === 0;
    },
    getStatusText() {
      const { status, remainingTime, date } = this;
      if (status === 0) {
        return this.$moment(date).format('MM.DD HH:mm');
      }
      return `${this.getMatchStatusText(status)}${
        remainingTime !== null ? ` ${remainingTime}` : ''
      }`;
    },
  },
  methods: {
    onAnalysisClick(e) {
      e.stopPropagation();
      this.$emit('analysis', this.id);
    },
  },
};
</script>

<style scoped>
.header {
  margin-bottom: 10px;
  height: 20px;
  align-items: center;
}

.header p {
  margin-bottom: 0;
}

.header:hover:not(.wait) {
  cursor: pointer;
}

.header.wait {
  margin-bottom: unset;
}

p.team-name {
  font-weight: 700;
  font-size: 14px;
  color: #888888;
  flex: 1;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}

p.team-name:first-child {
  text-align: right;
}

div.score-status {
  text-align: center;
  flex: 1;
}

div.score-status > * {
  display: inline-block;
}

p.score {
  font-weight: 800;
  font-size: 14px;
  color: #444444;
}

p.status {
  margin: 0 10px;
  background-color: #df2f5d;
  border-radius: 25px;
  width: 110px;
  max-width: 110px;
  height: 20px;
  color: white;
  font-weight: 700;
  font-size: 12px;
  padding: 2px 5px 0;
  text-align: center;
}

p.status.set {
  position: relative;
}

p.status.set:not(p.status.set.wait) {
  color: #fffb9b;
}

p.status.set > .set-score {
  position: absolute;
  color: white;
}

p.status.set > .set-score:first-child {
  left: 10px;
}

p.status.set > .set-score:last-child {
  right: 10px;
}

p.status.wait {
  background-color: #4673b5;
}

.btn.analysis {
  width: 30px;
  height: 30px;
  padding: 4px;
}

.btn.analysis .icon-svg {
  background-color: #3eb2c0;
  width: 20px;
  height: 20px;
}

i.dotted.serve {
  width: 5px;
  height: 5px;
  border-radius: 50%;
  background-color: #3eb2c0;
  display: inline-block;
  vertical-align: middle;
  transition: all 0.3s;
  opacity: 0;
}

i.dotted.serve.show {
  opacity: 1;
}
</style>
