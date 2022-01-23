<template>
  <div>
    <div class="construction bg-white">
      <div>
        <select v-model="status" class="selectbox trades">
          <option
            v-for="(tab, index) in labelTabs"
            :key="`option-${index}`"
            :value="tab.value"
          >
            {{ tab.label }}
          </option>
        </select>
        <select v-model="order" class="selectbox trades">
          <option
            v-for="(tab, index) in typeTabs"
            :key="`option-${index}`"
            :value="tab.value"
          >
            {{ tab.type }}
          </option>
        </select>
        <select v-model="event" class="selectbox trades">
          <option
            v-for="(tab, index) in eventTabs"
            :key="`option-${index}`"
            :value="tab.value"
          >
            {{ tab.type }}
          </option>
        </select>
        <select v-model="search" class="selectbox trades">
          <option
            v-for="(tab, index) in searchTabs"
            :key="`option-${index}`"
            :value="tab.value"
          >
            {{ tab.type }}
          </option>
        </select>
      </div>
      <div class="input-num">
        <input type="text" placeholder="[숫자]시작" />
        <span>~</span>
        <input type="text" placeholder="[숫자]종료" />
        <b-btn variant="info">조회하기</b-btn>
      </div>
    </div>
  </div>
</template>

<script>
import { createNamespacedHelpers } from 'vuex';

const { mapGetters: tradeStatSelectGetters } = createNamespacedHelpers(
  'trades'
);

export default {
  data() {
    return {
      status: null,
      order: null,
      event: null,
      search: null,
      labelTabs: [],
      typeTabs: [],
      eventTabs: [],
      searchTabs: [],
    };
  },
  computed: {
    ...tradeStatSelectGetters({
      tradeStatSelectList: 'tradeStatSelectGetters',
      orderType: 'orderStatSelectGetters',
      eventType: 'eventStatSelectGetters',
      searchType: 'searchStatSelectGetters',
    }),
  },
  beforeMount() {
    this.labelTabs = [
      ...this.tradeStatSelectList.map((stat) => ({
        label: stat.text,
        value: stat.value,
      })),
    ];
    this.status = this.labelTabs[0].value;
    this.typeTabs = [
      ...this.orderType.map((stat) => ({
        type: stat.text,
        value: stat.value,
      })),
    ];
    this.order = this.typeTabs[0].value;
    this.eventTabs = [
      { type: '종목선택' },
      ...this.eventType.map((stat) => ({
        type: stat.text,
        value: stat.value,
      })),
    ];
    this.event = this.eventTabs[0].value;
    this.searchTabs = [
      { type: '검색선택' },
      ...this.searchType.map((stat) => ({
        type: stat.text,
        value: stat.value,
      })),
    ];
    this.search = this.searchTabs[0].value;
  },
};
</script>

<style scoped>
div.construction {
  padding: 20px 0;
  display: flex;
  justify-content: space-between;
}

img {
  display: block;
  margin: 300px auto;
}

select.trades {
  width: 120px;
  margin-right: 10px;
}

.construction .input-num input {
  width: 110px;
  height: 30px;
  font-size: 12px;
  background-color: white;
  border-radius: 5px;
  color: #999999;
  border: 1px solid #d9d9d9;
  position: relative;
  padding: 0 32px 0 10px;
  text-align: left;
}

.construction .input-num input:focus {
  outline: unset;
}

.construction .input-num input::placeholder {
  color: #999999;
}

.construction .input-num span {
  padding: 0 10px;
  display: inline-block;
}

.construction .input-num button {
  font-size: 12px;
  margin-left: 10px;
  padding: 7px 16px;
  color: #ffffff;
  background-color: #3eb2c0;
  border: none;
  border-radius: 5px;
}
</style>
