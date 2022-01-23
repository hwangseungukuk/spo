<template>
  <div class="live-game-item default-ctn">
    <live-game-item-header
      :id="id"
      :status="status"
      :date="date"
      :remaining-time="remainingTime"
      :away-team="awayTeam"
      :away-score="awayScore"
      :away-set-score="awaySetScore"
      :home-team="homeTeam"
      :home-score="homeScore"
      :home-set-score="homeSetScore"
      :set-score="setScore"
      :serve="serve"
      @analysis="(v) => $emit('analysis', v)"
      @click="onHeaderClick"
    ></live-game-item-header>
    <div v-if="status !== 0" class="srs-game">
      <div class="button-group">
        <slot></slot>
      </div>
      <button class="btn func btn-sm">
        <i class="icon-svg new-window" @click="$emit('popup')"></i>
      </button>
    </div>
  </div>
</template>

<script>
import LiveGameItemHeader from '~/components/hitgame/live/LiveGameItemHeader';

export default {
  components: {
    LiveGameItemHeader,
  },
  props: {
    id: { type: Number, default: 0 },
    status: { type: Number, default: 0 },
    date: { type: Date, default: () => new Date() },
    remainingTime: { type: String, default: null },
    awayTeam: { type: String, default: 'Away team' },
    awayScore: { type: Number, default: 0 },
    homeTeam: { type: String, default: 'Home team' },
    homeScore: { type: Number, default: 0 },
    homeSetScore: { type: Number, default: 0 },
    awaySetScore: { type: Number, default: 0 },
    setScore: { type: Boolean, default: false },
    serve: { type: Number, default: null },
  },
  methods: {
    onHeaderClick() {
      const { status } = this;
      if (status === 0 || (status >= 60 && status <= 100)) {
        return;
      }
      this.$emit('onHeaderClick', { MatchId: this.id });
    },
  },
};
</script>

<style scoped>
.live-game-item {
  border-bottom: 1px dashed #e6e6e6;
  padding: 10px;
}

.live-game-item p {
  margin: 0;
}

.live-game-item:first-child {
  border-top-left-radius: 10px;
  border-top-right-radius: 10px;
}

.live-game-item:last-child {
  border-bottom-left-radius: 10px;
  border-bottom-right-radius: 10px;
  border-bottom: unset;
}

.live-game-item .srs-game div.button-group {
  width: calc(100% - 30px);
  display: inline-flex;
}

.live-game-item div.srs-game .button-group > * {
  /* width: calc(100% / 3 - 5px); */
  flex: 1;
  margin-right: 5px;
}

.live-game-item div.srs-game .button-group span.label {
  display: inline-block;
  max-width: 140px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.live-game-item .btn.func {
  width: 30px;
  height: 30px;
  padding: 4px;
}

.live-game-item .btn.func .icon-svg {
  background-color: #3eb2c0;
  width: 20px;
  height: 20px;
}
</style>
