<template>
  <div class="history-casual-item default-ctn">
    <div class="status-type">
      <p :class="`status ${status}`">
        {{ getStatus(status) }}
      </p>
      <p class="name-inning">
        {{ `${name} (${inning}회차)` }}
      </p>
    </div>
    <div class="date-gold">
      <p class="date">
        베팅 일시 :&nbsp;
        {{ $moment(date).format('YY-MM-DD HH:mm:ss') }}
      </p>
      <p class="gold">
        베팅 골드 :&nbsp;
        {{ golds.toLocaleString() }}
      </p>
    </div>
    <div class="rate-expected">
      <p class="rate">
        배당률 :&nbsp;
        {{ `${rate.toLocaleString()}` }}
      </p>
      <p class="expected">
        당첨 골드 :&nbsp;
        {{ getting.toLocaleString() }}
      </p>
    </div>
    <div
      class="casual-result inline-flex"
      :style="noButtons ? 'border-right: unset' : ''"
    >
      <div class="selected flex">
        <span>선택</span>
        <i :class="`icon-svg casual-result ${eng} ${userSelected}`"></i>
      </div>
      <div class="result flex">
        <span>결과</span>
        <i :class="`icon-svg casual-result ${eng} ${result}`"></i>
      </div>
      <template v-if="selectable">
        <button
          :class="`btn select ${selected ? 'on' : ''}`"
          style="margin-left: 5px"
          @click="$emit('select', { selected })"
        >
          <p>선택</p>
        </button>
      </template>
      <template v-else-if="noButtons"></template>
      <template v-else>
        <b-btn class="share" @click="$emit('share', { id })">
          <p>베팅 공유</p>
        </b-btn>
      </template>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    id: { type: Number, default: 0 },
    succeeded: { type: Boolean, default: false },
    inning: { type: Number, default: 0 },
    name: { type: String, default: 'name' },
    eng: { type: String, default: 'eng' },
    date: { type: Date, default: () => new Date() },
    golds: { type: Number, default: 0 },
    rate: { type: Number, default: 0 },
    getting: { type: Number, default: 0 },
    result: { type: Number, default: 1 },
    userSelected: { type: Number, default: 1 },
    selectable: { type: Boolean, default: false },
    selected: { type: Boolean, default: false },
    status: { type: String, default: 'wait' },
    noButtons: { type: Boolean, default: false },
  },
  computed: {
    getStatus() {
      return (status) => {
        if (status === 'wait') {
          return '대기중';
        }
        return status === 'succeeded' ? '적중성공' : '적중실패';
      };
    },
  },
};
</script>

<style scoped>
div.history-casual-item {
  width: 100%;
  height: 60px;
  display: flex;
  border-bottom: 1px solid #e6e6e6;
}
div.history-casual-item.default-ctn {
  border-radius: 0;
}

div.history-casual-item > div {
  padding: 10px 15px;
  border-right: 2px solid #f2f2f2;
  height: 100%;
}

div.history-casual-item .name-inning {
  font-weight: 800;
  font-size: 14px;
  color: #444444;
  margin-bottom: 0;
  margin-top: 0;
}

div.history-casual-item > div:first-child {
  padding-left: 0;
}

div.history-casual-item > div:last-child {
  border-right: unset;
  padding-right: 0;
}

div.history-casual-item > div.status-type {
  width: 230px;
  display: inline-flex;
  align-items: center;
}

p {
  margin: 2px 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

button p {
  margin: 0;
}

p.status {
  width: 80px;
  height: 30px;
  font-size: 13px;
  font-weight: 800;
  color: white;
  margin: 0 10px 0 0;
  border-radius: 5px;
  background-color: #557097;
  text-align: center;
  padding-top: 6px;
}

p.status.failed {
  background-color: #999999;
}

p.status.succeeded {
  background: linear-gradient(90deg, #5da9d6 0%, #70d0c9 100%);
}

div.history-casual-item > div.date-gold,
div.history-casual-item > div.rate-expected {
  width: 200px;
}

div.history-casual-item div.casual-result {
  min-width: 180px;
}

div.history-casual-item div.casual-result,
div.history-casual-item div.casual-result div {
  align-items: center;
  justify-content: center;
}

div.history-casual-item div.casual-result div {
  margin-right: 10px;
}

div.history-casual-item div.casual-result div:last-child {
  margin-right: 0;
}

div.rate-expected {
  color: #3eb2c0;
  font-weight: 700;
}

button.btn,
button.btn:focus,
button.btn:active {
  outline: unset;
  border: unset;
}

button.btn {
  width: 80px;
  height: 30px;
  border-radius: 5px;
  font-size: 12px;
}

.btn.select {
  width: fit-content;
  background-color: #d8f0f2;
  color: #3eb2c0;
}
/*
.btn.select:focus {
  outline: unset;
  box-shadow: unset;
  background-color: #d8f0f2;
} */

.btn.select.on {
  background-color: #3eb2c0;
  /* border: 1px solid #3eb2c0; */
  color: #fff;
  outline: unset;
  box-shadow: unset;
}

button.btn.share,
button.btn.share:focus,
button.btn.share:active {
  background-color: #3eb2c0;
}

button.btn.share:focus,
button.btn.share:active {
  box-shadow: 0 0 0 2px #3eb2c0aa;
}

.history-casual-item div.casual-result > div span {
  font-size: 14px;
  margin-right: 5px;
  font-weight: 700;
  color: #444444;
  width: 30px;
}

.icon-svg.casual-result {
  width: 25px;
  height: 25px;
}
</style>
