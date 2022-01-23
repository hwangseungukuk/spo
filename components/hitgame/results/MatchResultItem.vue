<template>
  <div class="match-r-item">
    <p class="status">
      {{ statusData.text }}
    </p>
    <p class="sport">
      <i :class="`icon-svg ${getSportValue(sportId)}`"></i>
      {{ getSportText(sportId) }}
    </p>
    <p class="league">
      {{ league }}
    </p>
    <p class="prepared time">
      {{ $moment(matchDate).format('HH:mm') }}
    </p>
    <p :class="`home-name ${statusData.ended && homeWon ? 'won' : ''}`">
      {{ homeName }}
    </p>
    <div :class="`home-score ${statusData.ended && homeWon ? 'won' : ''}`">
      <span
        :class="
          statusData.canceled || statusData.prepared || statusData.progress
            ? 'hide'
            : ''
        "
      >
        {{ homeWon ? 'W' : awayWon ? 'L' : 'D' }}
      </span>
      <p>
        {{
          statusData.canceled || statusData.prepared
            ? '-'
            : homeScore.toLocaleString()
        }}
      </p>
    </div>
    <span>:</span>
    <div :class="`away-score ${statusData.ended && awayWon ? 'won' : ''}`">
      <p>
        {{
          statusData.canceled || statusData.prepared
            ? '-'
            : awayScore.toLocaleString()
        }}
      </p>
      <span
        :class="
          statusData.canceled || statusData.prepared || statusData.progress
            ? 'hide'
            : ''
        "
      >
        {{ awayWon ? 'W' : homeWon ? 'L' : 'D' }}
      </span>
    </div>
    <p :class="`away-name ${statusData.ended && awayWon ? 'won' : ''}`">
      {{ awayName }}
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
    matchDate: { type: Date, default: new Date() },
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
};
</script>

<style scoped>
div.match-r-item {
  width: 100%;
  height: 40px;
  color: #888888;
  padding: 10px 0px;
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
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

p.status {
  width: 70px;
  padding: 0 10px;
}

p.sport {
  width: 95px;
  color: #3eb2c0;
  font-weight: 700;
  text-align: left;
  padding: 0 10px 0 20px;
}

p.sport > i.icon-svg {
  width: 16px;
  height: 16px;
  margin-bottom: -4px;
  margin-right: 10px;
  background-color: #3eb2c0;
}

p.league {
  width: 140px;
  padding: 0 10px;
}

p.prepared.time {
  width: 70px;
  padding: 0 10px;
}

p.away-name,
p.home-name,
div.home-score > p,
div.away-score > p {
  font-weight: 400;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

p.away-name {
  text-align: left;
}

p.home-name,
p.away-name {
  width: 205px;
  padding: 0 10px;
}

p.home-name {
  text-align: right;
  margin-left: 10px;
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
  width: 20px;
  height: 20px;
  font-size: 10px;
  font-weight: 800;
  border-radius: 50%;
  line-height: 2;
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
