<template>
  <div class="match-item" @click="onClick">
    <template v-if="scheduled">
      <p class="status scheduled">
        {{ $moment(date).format('MM.DD HH:mm') }}
      </p>
    </template>
    <template v-else>
      <p class="status">
        LIVE
        {{ getMatchStatusText(status) }}
        {{ remainingTime }}
      </p>
    </template>
    <div class="match-info">
      <div class="team flex">
        <p class="name">{{ homeName }}</p>
        <div class="spacer"></div>
        <p :class="`score ${setScore ? 'with-set-score' : ''}`">
          <i
            v-if="!scheduled && setScore"
            :class="`dotted serve ${serve === 1 ? 'show' : 'hide'}`"
            style="margin-right: 10px"
          ></i>
          <span v-if="!scheduled && setScore" class="set-score">
            {{ homeSetScore }}
          </span>
          {{ scheduled ? 'H' : homeScore }}
        </p>
      </div>
      <div class="team flex">
        <p class="name">{{ awayName }}</p>
        <div class="spacer"></div>
        <p :class="`score ${setScore ? 'with-set-score' : ''}`">
          <i
            v-if="!scheduled && setScore"
            :class="`dotted serve ${serve === 2 ? 'show' : 'hide'}`"
            style="margin-right: 10px"
          ></i>
          <span v-if="!scheduled && setScore" class="set-score">
            {{ awaySetScore }}
          </span>
          {{ scheduled ? 'A' : awayScore }}
        </p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    id: { type: Number, default: 0 },
    date: { type: Date, default: () => new Date() },
    remainingTime: { type: String, default: '' },
    status: { type: Number, default: 0 },
    homeName: { type: String, default: 'Home Name' },
    homeScore: { type: Number, default: 0 },
    homeSetScore: { type: Number, default: 0 },
    awayName: { type: String, default: 'Away Name' },
    awayScore: { type: Number, default: 0 },
    awaySetScore: { type: Number, default: 0 },
    setScore: { type: Boolean, default: false },
    serve: { type: Number, default: null },
    scheduled: { type: Boolean, default: false },
  },
  data() {
    return {
      timestamp: new Date().getTime(),
    };
  },
  computed: {
    // remainingTime() {
    //   const { date, timestamp } = this;
    //   const remaining = timestamp - date.getTime();
    //   const result = this.$moment.utc(remaining);
    //   if (result.get('hour') > 0) {
    //     return result.format('H:mm:ss');
    //   } else {
    //     return result.format('mm:ss');
    //   }
    // },
  },
  mounted() {
    this.$timestamp.$on('timestamp', (v) => (this.timestamp = v));
  },
  beforeDestroy() {
    this.$timestamp.$off('timestamp');
  },
  methods: {
    onClick() {
      if (this.scheduled) {
        return;
      }
      this.$emit('onMatchClick', { id: this.id });
    },
  },
};
</script>

<style scoped>
.match-item {
  background-color: #f2f2f2;
  border-bottom: 1px dashed #d9d9d9;
  padding: 10px;
  transition: all 0.3s;
}

.match-item:hover {
  cursor: pointer;
  background-color: white;
}

.match-item:last-child {
  border-bottom: unset;
}

p.status {
  font-size: 12px;
  font-weight: 700;
  margin-bottom: 5px;
  color: #df2f5e;
}

p.status.scheduled {
  color: #4673b6;
}

p.status::before {
  content: '';
  margin-right: 2px;
  width: 6px;
  height: 6px;
  vertical-align: middle;
  border-radius: 50%;
  margin-bottom: 2px;
  background-color: #df2f5e;
  display: inline-block;
}

p.status.scheduled::before {
  background-color: #4673b6;
}

div.match-info p {
  margin-bottom: 0;
}

div.match-info div.team {
  align-items: center;
}

div.match-info div.team .name {
  color: #888888;
  line-height: 14px;
  max-height: 28px;
  overflow: hidden;
}

div.match-info div.team .score {
  font-weight: 800;
  margin-left: 10px;
  text-align: right;
}

div.match-info div.team .score.with-set-score {
  min-width: 50px;
}

div.match-info div.team .score > .set-score {
  color: #df2f5e;
  margin-right: 5px;
}

div.match-info > div.team:first-child {
  margin-bottom: 5px;
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
