<template>
  <div class="modal-container default-ctn">
    <div class="winner-bg image">
      <p class="get-golds">
        {{ `${getGolds.toLocaleString()} 골드 획득` }}
      </p>
    </div>
    <div class="hits-list-container">
      <div class="header flex">
        <p style="width: 90px">베팅 일자</p>
        <p style="flex: 1">경기</p>
        <p style="width: 100px">베팅골드</p>
        <p style="width: 75px">배당률</p>
        <p style="width: 110px">당첨골드</p>
      </div>
      <div class="list">
        <template v-for="(item, index) in list">
          <div
            :key="`betting-winner-item-${index}-${item.id}`"
            class="item flex"
          >
            <p style="width: 90px">
              {{
                $moment(item.DateDrawn, 'YYYY-MM-DD HH:mm:ss').format(
                  'YY-MM-DD'
                )
              }}
            </p>
            <p class="match-name" style="flex: 1">
              {{ getTeamName(item.HomeTeam_UniqueId, item.HomeTeam_Name) }}
              <span>VS</span>
              {{ getTeamName(item.AwayTeam_UniqueId, item.AwayTeam_Name) }}
              <span v-if="getMarketIdSize(item) > 0">
                외 {{ getMarketIdSize(item) }}건
              </span>
            </p>
            <p style="width: 100px">
              {{ parseInt(item.SpoGold).toLocaleString() }}
            </p>
            <p style="width: 75px">
              {{ parseFloat(item.AggregatedOdd).toLocaleString() }}
            </p>
            <p style="width: 110px">
              {{ parseInt(item.WinSpoGold).toLocaleString() }}
            </p>
          </div>
        </template>
      </div>
    </div>
    <div class="button-group flex">
      <div class="spacer"></div>
      <b-btn variant="info" class="btn-confirm" @click="onConfirmClick">
        <p>적중내역 보기</p>
      </b-btn>
      <b-btn variant="light" class="btn-cancel" @click="onCancelClick">
        <p>닫기</p>
      </b-btn>
      <div class="spacer"></div>
    </div>
  </div>
</template>

<script>
export const MODAL_OPTIONS = {
  height: 660,
  width: 710,
  adaptive: true,
  clickToClose: false,
};

export default {
  props: {
    list: { type: Array, default: () => [] },
    onConfirm: { type: Function, default: () => {} },
    onCancel: { type: Function, default: () => {} },
  },
  computed: {
    getGolds() {
      return this.list.reduce((calc, item) => {
        return (calc += parseInt(item.WinSpoGold));
      }, 0);
    },
    getMarketIdSize() {
      return ({ MarketIdsRef }) => {
        if (!MarketIdsRef || MarketIdsRef.length <= 0) {
          return 0;
        }
        const result = MarketIdsRef.split(',').length - 1;
        if (result <= 0) {
          return 0;
        }
        return result;
      };
    },
  },
  methods: {
    onConfirmClick() {
      this.onConfirm();
      this.$router.push({
        name: 'mypage-hitgame-srs',
      });
      this.$emit('close');
    },
    onCancelClick() {
      this.onCancel();
      this.$emit('close');
    },
  },
};
</script>

<style scoped>
@import url(~assets/css/modal.css);

div.modal-container {
  width: 710px;
  height: 660px;
  padding: 20px 10px 20px 20px;
}

div.winner-bg {
  background-image: url(~assets/images/betting-winner-bg.png);
  background-size: contain;
  width: 670px;
  height: 300px;
  position: relative;
}

div.hits-list-container {
  color: #888888;
  font-size: 12px;
}

div.hits-list-container .header {
  width: 670px;
  background-color: #f2f2f2;
  color: #888888;
  align-items: center;
  justify-content: center;
  height: 40px;
  border-bottom: 1px solid #3eb2c0;
  font-weight: 700;
}

div.hits-list-container p {
  margin-bottom: 0;
}

div.hits-list-container .list {
  height: 200px;
  overflow-y: scroll;
  overflow-x: hidden;
}

div.hits-list-container .list .item {
  height: 40px;
  align-items: center;
  justify-content: center;
  border-bottom: 1px solid #e6e6e6;
}

div.hits-list-container .list .item p.match-name {
  max-width: 290px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

div.hits-list-container .list .item p > span {
  color: #3eb2c0;
}

div.winner-bg p.get-golds {
  position: absolute;
  bottom: 30px;
  font-size: 24px;
  font-weight: 800;
  color: #fffb9b;
  margin-bottom: 0;
  left: 0;
  right: 0;
  text-shadow: 2px 2px 5px black;
}
</style>
