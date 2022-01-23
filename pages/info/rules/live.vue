<template>
  <div class="white_cover">
    <div class="guide-content default-ctn">
      <div class="descriptionHead">
        <span>라이브 게임</span>
        <p>
          라이브 게임은 현재 진행중인 경기의 예상 결과를 맞히는 게임으로
          서비스하는 모든 종목의 국내 및 해외 경기를 기준으로 참여가 가능합니다.
        </p>
      </div>
      <dl class="noLine">
        <dt>게임 규정</dt>
      </dl>
      <div class="descriptionDetail">
        <section>
          <p><strong>1. 대상경기</strong></p>
          <p class="mb-3">축구, 농구, 야구, 배구 등 각종 전세계 스포츠 경기</p>
          <p><strong>2. 게임종류</strong></p>
          <p class="mb-3">
            승무패, 핸디캡, 언더/오버 등 다양한 타입의 베팅 방식 제공
          </p>
          <p><strong>3. 참여 가능 시간</strong></p>
          <p class="mb-3">경기 시작 후 해당 베팅 타입 마감 전까지 참여 가능</p>
          <p><strong>4. 베팅제한</strong></p>
          <p class="mb-3">
            - 최대 선택 가능 경기 : 1경기(폴더) <br />
            - 1회 최소 베팅 골드: 10,000 / 1회 최대 베팅 골드: 50,000,000 <br />
            - 동일 경기 팀 포함 최대 누적 베팅 골드 : 2,000,000,000
          </p>
          <p><strong>5. 베팅 페널티 </strong></p>
          <p class="mb-3">배당률 페널티 없음</p>
          <p><strong>6. 결과 처리</strong></p>
          <p class="mb-3">종목 및 게임 타입 별 연장시간 적용/미적용으로 구분</p>
          <p><strong>7. 정산 처리 시간</strong></p>
          <p class="mb-3">
            - 베팅 타입 별로 마감 후 1시간 이내로 처리 <br />
            - 특정 경기의 경우 정산 처리가 지연될 수 있습니다.
          </p>
          <p><strong>8. 베팅 취소 </strong></p>
          <p class="mb-3">베팅 취소가 불가능 합니다.</p>
          <p><strong>9. 적중 특례</strong></p>
          <p class="mb-3">
            무승부가 선택되지 않는 경기에서 무승부가 발생한 경우 배당률을
            1.0배로 처리합니다. <br />
            단, 핸디캡 언더/오버 등 사전에 조건이 주어진 경우 반영된 결과를
            적용합니다.
          </p>
          <p><strong>10. 주의사항 </strong></p>
          <p class="mb-3">
            - 게임 참여 시 베팅 규정 및 타입 설명을 확인해 보시기 바랍니다.
            <br />
            - 게임에 의도하지 않은 상황이 발생하는 경우 운영팀의 판단 하에
            베팅이 취소될 수 있습니다. <br />
            - 경기가 정상적으로 종료까지 진행되지 않더라도 경기 단체의 규정에
            의해 정식경기가 성립될 경우 그 결과가 인정될 수 있습니다. <br />
            - 경기에 따라 부득이하게 경우 결과 처리 및 배당금 지급이 지연될 수
            있습니다.
          </p>
        </section>
      </div>
      <dl>
        <dt>종목규정</dt>
      </dl>
      <div id="sports-btns" class="row">
        <template v-for="item in games">
          <div :key="item.name" class="col-3">
            <b-btn
              variant="info"
              @click="showGameInfoModal(item.code, item.name)"
            >
              <span>
                <i :class="`icon-svg ${item.code}`"></i>
                {{ item.name }}경기
              </span>
              <img src="~/assets/images/info/circle-arrow.png" alt="" />
            </b-btn>
          </div>
        </template>
      </div>
    </div>
    <nuxt-child></nuxt-child>
  </div>
</template>

<script>
export default {
  auth: false,
  data() {
    return {
      games: [
        {
          name: '축구',
          code: 'soccer',
        },
        {
          name: '야구',
          code: 'baseball',
        },
        {
          name: '농구',
          code: 'basketball',
        },
        {
          name: '배구',
          code: 'volleyball',
        },
      ],
    };
  },
  methods: {
    showGameInfoModal(sport, name) {
      this.$router.push({
        name: `info-rules-live-sport`,
        params: {
          sport,
        },
        query: {
          name,
        },
      });
    },
  },
};
</script>

<style scoped>
@import url(~assets/css/info_pages.css);
div.guide-content > dl {
  padding: 30px 0;
}

#sports-btns span {
  font-size: 14px;
  font-weight: 800;
}

#sports-btns span i {
  background-color: #3eb2c0;
  width: 16px;
  height: 16px;
  vertical-align: middle;
  margin-right: 5px;
}

#sports-btns button {
  width: 100%;
  height: 35px;
  padding: 0 10px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: #3eb2c0;
  border: 1px solid #3eb2c0;
  background-color: #d8f0f2;
}

div.row > div {
  padding-right: 10px !important;
}
</style>
