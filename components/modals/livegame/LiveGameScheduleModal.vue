<template>
  <div class="live-game-schedule default-ctn">
    <p class="title">LIVE 게임 일정</p>
    <live-game-schedule-header
      :items="dateList"
      @change="onDateChange"
    ></live-game-schedule-header>
    <div class="default-ctn">
      <div class="flex">
        <div style="width: 12px"></div>
        <table style="flex: 1">
          <thead>
            <tr>
              <th>
                <span>종목</span>
              </th>
              <th>
                <span>리그</span>
              </th>
              <th>
                <span>시작시간</span>
              </th>
              <th>
                <span>팀명</span>
              </th>
            </tr>
          </thead>
        </table>
        <div style="width: 12px"></div>
      </div>
      <div class="scroll">
        <table>
          <tbody>
            <template v-if="loading">
              <div class="spinner"></div>
            </template>
            <template v-else>
              <template v-if="items.length > 0">
                <live-game-schedule-item
                  v-for="(item, index) in items"
                  :key="`live-game-schedule-${item.id}-${index}`"
                  :sport="item.SportId"
                  :league-name="
                    getSportLeagueName(item.TournamentId) ||
                    item.TournamentNameKo
                  "
                  :date="item.MatchDate"
                  :detail="`${getTeamName(
                    item.HomeTeam_UniqueId,
                    item.HomeTeam_Name
                  )} VS ${getTeamName(
                    item.AwayTeam_UniqueId,
                    item.AwayTeam_Name
                  )}`"
                ></live-game-schedule-item>
              </template>
              <template v-else>
                <div class="no-has-items default-ctn flex">
                  <p>예정된 경기가 없습니다.</p>
                </div>
              </template>
            </template>
          </tbody>
        </table>
      </div>
    </div>
    <i class="icon-svg close" @click="$emit('close')"></i>
  </div>
</template>

<script>
import { createNamespacedHelpers } from 'vuex';

import LiveGameScheduleHeader from '~/components/modals/livegame/LiveGameScheduleHeader';

import LiveGameScheduleItem from '~/components/hitgame/live/modal/schedule/LiveGameScheduleItem';

const {
  mapState: liveScheduleState,
  mapActions: liveScheduleActions,
} = createNamespacedHelpers('gamecenter/betting/list/live/schedule');

export const MODAL_OPTIONS = {
  width: 780,
  height: 600,
  adaptive: true,
  clickToClose: true,
};

export default {
  components: {
    LiveGameScheduleHeader,
    LiveGameScheduleItem,
  },
  computed: {
    ...liveScheduleState(['success', 'loading', 'error', 'items']),
  },
  beforeMount() {
    const currentDate = new Date();
    this.dateList = [
      {
        text: this.$moment(currentDate).format('YYYY.MM.DD. dd'),
        value: currentDate,
      },
      {
        text: this.$moment(currentDate).add(1, 'day').format('YYYY.MM.DD. dd'),
        value: this.$moment(currentDate).add(1, 'day').toDate(),
      },
      {
        text: this.$moment(currentDate).add(2, 'day').format('YYYY.MM.DD. dd'),
        value: this.$moment(currentDate).add(2, 'day').toDate(),
      },
    ];
  },
  async mounted() {
    await this.getSchedule(new Date());
  },
  beforeDestroy() {
    this.clear();
  },
  methods: {
    ...liveScheduleActions(['getSchedule', 'clear']),
    async onDateChange(v) {
      await this.getSchedule(v);
    },
  },
};
</script>

<style scoped>
.live-game-schedule {
  margin: 0 auto;
  width: 780px;
  height: 600px;
  padding: 20px 20px 0;
  background-color: #f2f2f2;
  position: relative;
}

.live-game-schedule .title {
  color: #444444;
  font-weight: 800;
  font-size: 16px;
  margin-bottom: 10px;
}

i.icon-svg.close {
  position: absolute;
  top: 20px;
  right: 20px;
  width: 16px;
  height: 16px;
  background-color: #cccccc;
  cursor: pointer;
}

table {
  width: 100%;
}

table >>> th:nth-of-type(1) {
  width: 15%;
}

table thead th:nth-of-type(2),
table tbody >>> td:nth-of-type(1) {
  width: 20%;
}

table thead th:nth-of-type(3),
table tbody >>> td:nth-of-type(2) {
  width: 15%;
}

table thead th:nth-of-type(4),
table tbody >>> td:nth-of-type(3) {
  width: 50%;
  padding-right: 15px;
}

table thead > tr {
  height: 40px;
  border-bottom: 1px solid #e6e6e6;
}

table thead th {
  text-align: center;
  font-weight: 800;
  color: #444444;
  font-size: 12px;
}

div.scroll {
  overflow-x: hidden;
  overflow-y: auto;
  height: 420px;
  padding-left: 12px;
}

table tbody tr {
  height: 35px;
}

table tbody tr:nth-child(odd) {
  background-color: #f7f7f7;
}

div.spinner {
  margin-top: 145px;
}

.no-has-items {
  height: 400px;
  border-bottom: unset;
  margin-bottom: unset;
}
</style>
