<template>
  <div class="gather-button">
    <div>
      <p class="hot" @click="$emit('casual', 'jumpball')"></p>
      <span>점프볼</span>
    </div>
    <div>
      <p @click="$emit('casual', 'cointoss')"></p>
      <span>코인토스</span>
    </div>

    <div>
      <p @click="$emit('casual', 'freekick')"></p>
      <span>프리킥</span>
    </div>

    <div>
      <p class="new" @click="$emit('casual', 'shootout')"></p>
      <span>슈팅스타</span>
    </div>
  </div>
</template>

<style scoped>
.gather-button {
  width: 350px;
  text-align: center;
  height: 124px;
  padding: 20px;
  background: url(~assets/images/side/cgame_bg.png) no-repeat;
  box-sizing: border-box;
  margin-bottom: 15px;
}
.gather-button > div {
  margin-right: 5px;
  position: relative;
  display: inline-block;
  box-sizing: border-box;
  cursor: pointer;
  width: 71px;
}
.gather-button > div > p {
  margin-bottom: 0px;
  position: relative;
  display: inline-block;
  box-sizing: border-box;
  cursor: pointer;
  width: 71px;
  height: 71px;
}
.gather-button > div:nth-last-of-type(1) {
  margin-right: 0;
}
.gather-button > div:nth-of-type(1) > p {
  background: url(~assets/images/side/cgame_1.png) no-repeat;
}
.gather-button > div:nth-of-type(1):hover > p {
  background: url(~assets/images/side/cgame_1_on.png) no-repeat;
}
.gather-button > div:nth-of-type(2) > p {
  background: url(~assets/images/side/cgame_2.png) no-repeat;
}
.gather-button > div:nth-of-type(2):hover > p {
  background: url(~assets/images/side/cgame_2_on.png) no-repeat;
}
.gather-button > div:nth-of-type(3) > p {
  background: url(~assets/images/side/cgame_3.png) no-repeat;
}
.gather-button > div:nth-of-type(3):hover > p {
  background: url(~assets/images/side/cgame_3_on.png) no-repeat;
}
.gather-button > div:nth-last-of-type(1) > p {
  background: url(~assets/images/side/cgame_4.png) no-repeat;
}
.gather-button > div:nth-last-of-type(1):hover > p {
  background: url(~assets/images/side/cgame_4_on.png) no-repeat;
}
.gather-button > div:hover > p {
  transition: 0.3s;
}

.gather-button > div > p.hot::after {
  position: absolute;
  content: '';
  width: 38px;
  height: 22px;
  top: -5px;
  right: -4px;
  background: url(~assets/images/side/cgame_hot.png) no-repeat center;
}

.gather-button > div > p.new::after {
  position: absolute;
  content: '';
  width: 38px;
  height: 22px;
  top: -5px;
  right: -4px;
  background: url(~assets/images/side/cgame_new.png) no-repeat center;
}

.gather-button > div span {
  color: #fff;
  font-weight: 700;
  transform: skew(-0.03deg);
}

img.casual-game-button:last-child {
  margin-bottom: 0;
}

img.casual-game-button:hover {
  cursor: pointer;
}
</style>
