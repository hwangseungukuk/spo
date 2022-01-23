<template>
  <div class="match-r-item">
    <p class="status">
      {{ statusData.text }}
    </p>
    <p class="league">
      <i :class="`icon-svg ${getSportValue(sportId)}`"></i>
      <span>
        {{ league }}
      </span>
    </p>
    <p :class="`home-name ${statusData.ended && homeWon ? 'won' : ''}`">
      {{ homeName }}
    </p>
    <template v-if="statusData.prepared">
      <p class="prepared time">
        {{ $moment(matchDate).format('HH:mm') }}
      </p>
    </template>
    <template v-else>
      <div :class="`home-score ${homeWon ? 'won' : ''}`">
        <span :class="statusData.canceled || statusData.progress ? 'hide' : ''">
          {{ homeWon ? 'W' : awayWon ? 'L' : 'D' }}
        </span>
        <p>
          {{ statusData.canceled ? '-' : homeScore.toLocaleString() }}
        </p>
      </div>
      <span>:</span>
      <div :class="`away-score ${awayWon ? 'won' : ''}`">
        <p>
          {{ statusData.canceled ? '-' : awayScore.toLocaleString() }}
        </p>
        <span :class="statusData.canceled || statusData.progress ? 'hide' : ''">
          {{ awayWon ? 'W' : homeWon ? 'L' : 'D' }}
        </span>
      </div>
    </template>
    <p :class="`away-name ${statusData.ended && awayWon ? 'won' : ''}`">
      {{ awayName }}
    </p>
    <p class="record" @click="onAnalysisClick">
      <i class="icon-svg analysis"></i>
      기록
    </p>
    <p class="tracker" @click="openBroadCast">
      <i class="icon-svg tracker"></i>
      중계
    </p>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  props: {
    id: { type: Number, default: 0 },
    status: { type: Number, default: 0 },
    sportId: { type: Number, default: 0 },
    league: { type: String, default: 'league' },
    homeName: { type: String, default: 'Home team' },
    awayName: { type: String, default: 'Away team' },
    homeScore: { type: Number, default: 0 },
    awayScore: { type: Number, default: 0 },
    homeWon: { type: Boolean, default: false },
    awayWon: { type: Boolean, default: false },
    matchDate: { type: Date, default: () => new Date() },
    analysis: { type: String, default: null },
  },
  data() {
    return {
      statusData: null,
    };
  },
  computed: {
    ...mapGetters('mapper/game-status', ['getStatus']),
  },
  beforeMount() {
    this.statusData = this.getStatus(this.status);
  },
  methods: {
    onAnalysisClick() {
      const options =
        'top=100, left=100, width=710, height=655, status=no, menubar=no, toolbar=no, resizable=no, scrollbars=no';
      window.open(this.analysis, 'spolive_match_result_analysis', options);
    },
    openBroadCast() {
      const options =
        'top=100, left=100, width=710, height=655, status=no, menubar=no, toolbar=no, resizable=no, scrollbars=no';
      const url = `${process.env.SRS_URL}/Match/${this.id}/broadcast`;
      window.open(url, 'spolive_broadcast', options);
    },
  },
};
</script>

<style scoped>
div.match-r-item {
  width: 730px;
  height: 40px;
  color: #888888;
  padding: 10px 20px;
  display: flex;
  align-items: center;
  justify-content: center;
}

p {
  display: inline-block;
  margin-bottom: 0;
  text-align: center;
  font-size: 12px;
  font-weight: 400;
}

p.prepared.time {
  width: 118px;
}

p.league > i.icon-svg {
  width: 16px;
  height: 16px;
  margin-bottom: -4px;
  margin-right: 10px;
  background-color: #3eb2c0;
}

p.status {
  width: 45px;
  margin-right: 24px;
}

p.league,
p.away-name,
p.home-name,
div.home-score > p,
div.away-score > p {
  font-weight: 400;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

p.league,
p.away-name {
  text-align: left;
}

p.league {
  width: 134px;
  margin-right: 10px;
}

p.home-name,
p.away-name {
  width: 115px;
}

p.home-name {
  text-align: right;
  margin-right: 10px;
}

p.away-name {
  margin-left: 10px;
  margin-right: 10px;
}

p.home-name.won,
p.away-name.won {
  font-weight: 800;
  color: #3eb2c0;
}

div.home-score,
div.away-score {
  width: 56px;
  display: inline-flex;
  text-align: center;
}

div.home-score > p,
div.away-score > p {
  flex: 1;
  margin-top: 2px;
}

div.home-score > span,
div.away-score > span {
  display: inline-block;
  background-color: #d9d9d9;
  color: #999999;
  width: 18px;
  height: 18px;
  font-size: 10px;
  font-weight: 800;
  border-radius: 50%;
  line-height: 1.8;
}

p.home-score > span {
  margin-right: 5px;
}
p.away-score > span {
  margin-left: 5px;
}

div.home-score > span.hide,
div.away-score > span.hide {
  background-color: transparent;
  color: transparent;
}

div.home-score.won > span,
div.away-score.won > span {
  background-color: #3eb2c0;
  color: white;
}

div.home-score.won > p,
div.away-score.won > p {
  color: #3eb2c0;
  font-weight: 800;
}

p.record:hover,
p.tracker:hover {
  cursor: pointer;
}

p.record > i.icon-svg,
p.tracker > i.icon-svg {
  width: 16px;
  height: 16px;
  background-color: #cccccc;
  margin-bottom: -3px;
  margin-right: 3px;
}

p.record {
  margin-right: 10px;
}
</style>
