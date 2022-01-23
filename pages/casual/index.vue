<template>
  <div class="casual-game-container">
    <b-row style="display: none">
      <template v-for="(game, index) in games">
        <casual-game-item
          :key="`casual-game-${index}`"
          :image="game.image"
          :description="game.description"
        ></casual-game-item>
      </template>
    </b-row>
    <div>
      <h1>
        <img
          src="~assets/images/casual/tit_casual.png"
          alt="Sports Casual
        Game 순간의 선택! 짜릿한 적중 쾌감!"
        />
      </h1>
      <ul class="casual_list">
        <li class="ball">
          <h2>
            <img src="~assets/images/casual/tit_ball.png" alt="점프볼" />
          </h2>
          <div>
            <p>
              공은 어디로 튈지 모른다!<br />순간의 선택에 엇갈리는<br />대박의
              꿈!
            </p>
            <button @click="openCasualGame('jumpball')">게임입장</button>
          </div>
        </li>
        <li class="coin">
          <h2>
            <img src="~assets/images/casual/tit_coin.png" alt="코인토스" />
          </h2>
          <div>
            <p>
              코인은 이미 던져졌다!<br />어마어마한 스포골드는<br />누구에게?
            </p>
            <button @click="openCasualGame('cointoss')">게임입장</button>
          </div>
        </li>
        <li class="star">
          <h2>
            <img src="~assets/images/casual/tit_star.png" alt="슈팅스타" />
          </h2>
          <div>
            <p>
              이 골에 팀의 승리가 달렸다!<br />짜릿하고 흥미넘치는<br />
              게임의 세계!
            </p>
            <button @click="openCasualGame('shootout')">게임입장</button>
          </div>
        </li>
        <li class="free">
          <h2>
            <img src="~assets/images/casual/tit_free.png" alt="프리킥" />
          </h2>
          <div>
            <p>
              수비를 피해 골을 넣는 짜릿함!<br />나의 오른발에<br />스포골드가
              걸렸다!
            </p>
            <button @click="openCasualGame('freekick')">게임입장</button>
          </div>
        </li>
      </ul>
      <div>
        <h2>캐주얼 게임<br />안내사항</h2>
        <p>
          1. 캐주얼 게임은 게임 입장을 클릭하여 해당 게임을 이용할 수
          있습니다.<br />
          2. 캐주얼 게임(점프볼, 코인토스, 프리킥)은 고정배당률로 게임 마다
          배당률이 상이합니다.<br />
          <span
            >(캐주얼 게임 별 배당률은 점프볼, 코인토스 1.95배,프리킥은
            2.9배입니다.)</span
          ><br />
          3. 캐주얼 게임(점프볼, 코인토스, 프리킥)은 시작 후 마감 30초 전까지
          참여가 가능합니다.<br />
          4. 캐주얼 게임(점프볼, 코인토스, 프리킥)은 베팅 금액을 클릭하여 참여할
          수 있습니다. <br />
          <span
            >(캐주얼 게임 베팅금액은 최소 1만 스포골드에서 최대 5천만
            스포골드입니다.)</span
          ><br />
          5. 캐주얼 게임(점프볼, 코인토스, 프리킥)은 [이전 베팅 취소] 또는 [전체
          취소]를 통해 베팅 취소를 할 수 있습니다.<br />
          6. 캐주얼 게임(점프볼, 코인토스, 프리킥)결과는 화면 하단 [내 결과
          보기]를 통해 확인할 수 있습니다.<br />
          7. 캐주얼 게임(점프볼, 코인토스, 프리킥) 우측 상단 메뉴를 통해 회차 별
          결과 및 랭킹 정보를 확인할 수 있습니다.<br />
          8. 캐주얼 게임 자세한 이용 방법은 도움말 메뉴를 통해 확인할 수
          있습니다.<br />
          9. 슈팅스타의 경우 게임방법이 상이할 수 있습니다.
        </p>
      </div>
    </div>
  </div>
</template>

<script>
import { createNamespacedHelpers } from 'vuex';

import CasualGameItem from '~/components/casual/CasualGameItem';

import casualMixin from '~/mixins/casual';

const { mapState: casualMenuState } = createNamespacedHelpers(
  'gamecenter/casual/menu'
);

export default {
  components: {
    CasualGameItem,
  },
  mixins: [casualMixin],
  computed: {
    ...casualMenuState(['games']),
  },
};
</script>

<style scoped>
div.casual-game-container {
  width: 920px;
  padding: 65px 38px 42px 41px;
  background: url(~assets/images/casual/bg_casual.jpg) no-repeat;
  border-radius: 10px;
  color: #fff;
}

div.casual-game-container h1 {
  text-align: center;
}
.casual_list {
  height: 526px;
  padding: 0;
  margin-top: 38px;
  margin-bottom: 80px;
}
.casual_list li {
  width: 395px;
  height: 231px;
  float: left;
  border-radius: 10px;
  list-style: none;
  margin-bottom: 64px;
}
.casual_list li:nth-of-type(2n-1) {
  margin-right: 51px;
}
.casual_list li > div {
  padding-left: 210px;
  padding-top: 40px;
  font-size: 12px;
  font-weight: 700;
  height: 175px;
}
.casual_list li > div:hover {
  transition: 0.3s;
}
.casual_list .ball > div {
  background-image: url(~assets/images/casual/casual_ball.png);
}
.casual_list .ball > div:hover {
  background-image: url(~assets/images/casual/casual_ball_over.png);
}
.casual_list .coin > div {
  background-image: url(~assets/images/casual/casual_coin.png);
}
.casual_list .coin > div:hover {
  background-image: url(~assets/images/casual/casual_coin_over.png);
}
.casual_list .star > div {
  background-image: url(~assets/images/casual/casual_star.png);
}
.casual_list .star > div:hover {
  background-image: url(~assets/images/casual/casual_star_over.png);
}
.casual_list .free > div {
  background-image: url(~assets/images/casual/casual_free.png);
}
.casual_list .free > div:hover {
  background-image: url(~assets/images/casual/casual_free_over.png);
}
.casual_list li > div p {
  margin-left: 10px;
  line-height: 1.4;
}
.casual_list li > div button {
  width: 170px;
  height: 40px;
  font-size: 0;
  background: url(~assets/images/casual/btn_casual.png) no-repeat;
  border-radius: 30px;
  border: none;
}
.casual_list li.coin > div button {
  background-position: 0 -40px;
}
.casual_list li.star > div button {
  background-position: 0 -80px;
}
.casual_list li.free > div button {
  background-position: 0 -120px;
}
.casual_list li > div button:hover {
  box-shadow: 0 0 1px 4px rgba(255, 255, 255, 0.3);
  transition: 0.3s;
}

.casual_list li h2 {
  text-align: center;
}

.casual_list + div {
  display: flex;
  align-items: center;
  font-weight: 700;
}
.casual_list + div h2 {
  text-align: center;
  font-size: 16px;
  line-height: 1.6;
  margin-right: 65px;
  width: 120px;
  color: #ccc;
}
.casual_list + div p {
  line-height: 1.8;
  color: #999;
}
.casual_list + div p span {
  margin-left: 12px;
}

/*
div.row > div.casual-game-item {
  padding-bottom: 20px;
}

div.row > div.casual-game-item:nth-child(odd) {
  padding-right: 10px;
}

div.row > div.casual-game-item:nth-child(even) {
  padding-left: 10px;
}

div.casual-game-item img {
  width: 420px;
  height: 130px;
  border-radius: 10px;
  transition: all 0.3s;
}

div.casual-game-item:hover img {
  cursor: pointer;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.5);
}

div.casual-game-item:active img {
  box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.8);
}

div.casual-game-item p {
  padding: 20px 0;
  margin-bottom: 0;
  color: #444444;
  text-align: center;
}
*/
</style>
