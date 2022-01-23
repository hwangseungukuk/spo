<template>
  <div class="match-item-container">
    <b-row class="match-item">
      <b-col v-if="isSpecial" class="status flex">
        <p>{{ status }}</p>
      </b-col>
      <b-col class="info">
        <div class="team-name">
          <p>{{ homeName }}</p>
          <span>VS</span>
          <p>{{ awayName }}</p>
        </div>
        <p class="date">
          {{ $moment(matchDate).format('YYYY. MM. DD HH:mm') }}
        </p>
      </b-col>
      <b-col class="games">
        <slot name="games"></slot>
      </b-col>
    </b-row>
    <div
      :class="`game-closed ${isCanceled ? '' : isClosed ? '' : 'hide'}`"
      @click="(e) => e.stopPropagation()"
    >
      <p>
        {{ isCanceled ? '경기가 취소 되었습니다.' : '베팅이 마감되었습니다.' }}
      </p>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    id: { type: Number, default: 0 },
    sportId: { type: Number, default: 0 },
    bMatchId: { type: Number, default: 0 },
    status: { type: String, default: 'status' },
    isSpecial: { type: Boolean, default: false },
    homeName: { type: String, default: 'Home team' },
    awayName: { type: String, default: 'Away name' },
    matchDate: { type: Date, default: new Date() },
    isClosed: { type: Boolean, default: false },
    isCanceled: { type: Boolean, default: false },
  },
};
</script>

<style scoped>
div.match-item-container {
  position: relative;
}

div.game-closed {
  background-color: rgba(0, 0, 0, 0.5);
  color: white;
  font-size: 16px;
  font-weight: 800;
  display: flex;
  align-items: center;
  justify-content: center;
  position: absolute;
  top: 0;
  right: 0;
  left: 0;
  bottom: 0;
}

div.game-closed.hide {
  visibility: hidden;
}

div.game-closed p {
  margin-bottom: 0;
}

div.match-item {
  display: flex;
  padding: 10px;
}

div.match-item div.status {
  max-width: 90px;
  align-items: center;
}

div.match-item div.status p {
  width: 70px;
  height: 30px;
  text-align: center;
  font-size: 12px;
  padding: 6px 10px;
  background-color: #f2f2f2;
  color: #999999;
  border-radius: 5px;
  border: 1px solid #e6e6e6;
}
</style>
