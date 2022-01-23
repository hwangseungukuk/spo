<template>
  <div>
    <!-- <div :class="`head ${cExpanded ? 'expanded' : ''}`"></div>
    <b-collapse :id="`accodion-${id}`" v-model="cExpanded">
      <div class="card detail-info">
        <template v-if="loading">
          <div class="spinner hitgame"></div>
        </template>
        <template v-else>
          <history-detail-item></history-detail-item>
        </template>
      </div>
    </b-collapse>
    <div class="trades-board">
      <ul class="trades-board-header">
        <li class="number">고유번호</li>
        <li class="folder">폴더</li>
        <li>베팅골드</li>
        <li>총배당</li>
        <li>예상 당첨골드</li>
        <li>판매골드</li>
        <li>남은시간</li>
        <li>적중전적</li>
        <li>적중전적</li>
        <li>등록시간</li>
      </ul>
      <ul class="trades-board-list">
        <li>84945</li>
        <li>0/8</li>
        <li>10,000</li>
        <li>91,242.10</li>
        <li>912,461,000</li>
        <li>500,000,000</li>
        <li>445분 32초</li>
        <li>7.14%</li>
        <li>2021-01-27 16:17:23</li>
        <li>
          <b-btn variant="info">구매하기</b-btn>
          <template>
            <i
              v-if="!disabled"
              :class="`icon-svg more ${cExpanded ? 'expanded' : ''}`"
              :aria-expanded="cExpanded ? 'true' : 'false'"
              :aria-controls="`accodion-1`"
              @click="onExpandedClick"
            ></i>
          </template>
        </li>
      </ul>
    </div> -->
    <b-table-simple borderless>
      <b-thead>
        <b-tr>
          <b-th width="85">고유번호</b-th>
          <b-th width="65">폴더</b-th>
          <b-th width="85">베팅골드</b-th>
          <b-th width="85">총배당</b-th>
          <b-th width="85">예상 당첨골드</b-th>
          <b-th width="85">판매골드</b-th>
          <b-th width="95">남은시간</b-th>
          <b-th width="85">적중전적</b-th>
          <b-th>등록시간</b-th>
          <b-th></b-th>
        </b-tr>
      </b-thead>
      <b-tbody>
        <b-tr>
          <b-td>84945</b-td>
          <b-td>0/8</b-td>
          <b-td>10,000</b-td>
          <b-td>91,242.10</b-td>
          <b-td>912,461,000</b-td>
          <b-td>500,000,000</b-td>
          <b-td>445분 32초</b-td>
          <b-td>7.14%</b-td>
          <b-td width="95">2021-01-27 16:17:23</b-td>
          <b-td>
            <b-btn variant="info">구매하기</b-btn>
            <template>
              <i
                v-if="!disabled"
                :class="`icon-svg more ${cExpanded ? 'expanded' : ''}`"
                :aria-expanded="cExpanded ? 'true' : 'false'"
                :aria-controls="`accodion-1`"
                @click="onExpandedClick"
              ></i>
            </template>
          </b-td>
        </b-tr>
        <b-collapse :id="`accodion-1`" v-model="cExpanded">
          <div class="p-3">
            <p class="m-0">하ㅏㅏㅏㅏㅏㅏㅏㅏㅏㅏㅏㅏㅏㅏㅏㅏㅏㅏㅏㅏㅏㅏ</p>
          </div>
        </b-collapse>
        <b-tr>
          <b-td>84945</b-td>
          <b-td>0/8</b-td>
          <b-td>10,000</b-td>
          <b-td>91,242.10</b-td>
          <b-td>912,461,000</b-td>
          <b-td>500,000,000</b-td>
          <b-td>445분 32초</b-td>
          <b-td>7.14%</b-td>
          <b-td>2021-01-27 16:17:23</b-td>
          <b-td>
            <b-btn variant="info">구매하기</b-btn>
          </b-td>
        </b-tr>
      </b-tbody>
    </b-table-simple>
  </div>
</template>

<script>
export default {
  data() {
    return {
      cExpanded: false,
      disabled: false,
    };
  },
  beforeMount() {
    this.cExpanded = this.expanded;
  },
  methods: {
    onExpandedClick() {
      if (this.disabled) {
        return;
      }
      this.cExpanded = !this.cExpanded;
    },
  },
};
</script>

<style scoped>
.trades-board ul {
  list-style: none;
  padding: 0;
  display: flex;
}

ul.trades-board-header {
  width: 100%;
  background-color: #f7f7f7;
  align-items: center;
  height: 40px;
}

ul.trades-board-header li {
  color: #444444;
}

ul.trades-board-list li {
  text-align: center;
  /* padding: 0 20px; */
}

.trades-board-header li.number {
  width: 85px;
}

.trades-board-header li.folder {
  width: 65px;
}

table > thead tr {
  background-color: #f7f7f7;
  align-items: center;
  height: 40px;
  color: #444444;
  border: none;
}

table > tbody tr {
  border-top: 1px solid #e5e5e5;
  height: 60px;
}

/* table > tbody tr:first-child, */
table > tbody tr:last-child {
  border-bottom: 1px solid #e5e5e5;
}

table > tbody tr td,
table > thead tr th {
  vertical-align: inherit;
  text-align: center;
  padding: 10px 0;
}

table > tbody tr td > button {
  font-size: 12px;
  border-radius: 4px;
}

table > tbody tr td:last-child {
  display: flex;
  align-items: center;
}

i.icon-svg.more {
  width: 20px;
  height: 20px;
  margin-left: 10px;
  margin-bottom: 0px;
  background-image: url(~assets/icons/bettings/betting-more.svg);
  -webkit-mask-image: unset;
  mask-image: unset;
  background-color: transparent;
  cursor: pointer;
  transition: all 0.3s;
}

i.icon-svg.more.expanded {
  background-image: url(~assets/icons/bettings/betting-more-expanded.svg);
}
</style>
