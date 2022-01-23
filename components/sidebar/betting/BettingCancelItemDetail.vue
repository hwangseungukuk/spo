<template>
  <div class="bet-cancel-detail flex">
    <div>
      <p>
        {{ getGameType(type).text }}
        {{ allotted !== null ? `(${getAllotted})` : '' }}
        <span>{{ getLabel }}</span>
      </p>
      <p class="teams">{{ `${homeName} VS ${awayName}` }}</p>
    </div>
    <p class="rate">
      {{ rate.toFixed(2) }}
    </p>
  </div>
</template>

<script>
import { createNamespacedHelpers } from 'vuex';

const { mapGetters: gameTypeGetters } = createNamespacedHelpers(
  'mapper/game-type'
);
export default {
  props: {
    type: { type: String, default: 'type' },
    allotted: { type: Number, default: null },
    homeName: { type: String, default: 'home team name' },
    awayName: { type: String, default: 'away team name' },
    label: { type: String, default: 'Label' },
    rate: { type: Number, default: 0 },
  },
  computed: {
    ...gameTypeGetters(['getGameType']),
    getLabel() {
      const { label } = this;
      if (label === '1') {
        return '홈 승';
      }
      if (label === '2') {
        return '홈 패';
      }
      if (label === 'Under') {
        return '언더';
      }
      if (label === 'Over') {
        return '오버';
      }
      return '무';
    },
    getAllotted() {
      const { type, allotted } = this;
      if (type === 'totals') {
        return allotted;
      } else {
        return `H${allotted >= 0 ? `+${allotted}` : allotted}`;
      }
    },
  },
};
</script>

<style scoped>
.bet-cancel-detail {
  font-size: 14px;
  font-weight: 700;
  color: #888888;
  align-items: center;
  justify-content: center;
  min-height: 70px;
  position: relative;
  transition: all 0.3s;
}

.bet-cancel-detail > div:first-child {
  flex: 1;
  margin-right: 10px;
}

.bet-cancel-detail > div p {
  line-height: 1;
  margin-bottom: 10px;
}

.bet-cancel-detail > div p:first-child span {
  padding-left: 10px;
  margin-left: 5px;
  color: #444444;
  border-left: 1px solid #888888;
  display: inline-block;
  transition: all 0.3s;
}

.bet-cancel-detail > div p:last-child {
  margin-bottom: 0;
}

p.teams {
  font-size: 12px;
}

p.rate {
  font-size: 16px;
  font-weight: 800;
  margin-bottom: 0;
  color: #3eb2c0;
}
</style>
