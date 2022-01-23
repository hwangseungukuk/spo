<template>
  <footer>
    <div class="container">
      <div class="logo-container">
        <img src="~assets/images/footer/neowiz.svg" alt="neowiz logo" />
        <img src="~assets/images/spolive-white.png" alt="spolive logo" />
      </div>
      <div class="info-container">
        <nav class="info-nav">
          <template
            v-for="({ name, href, popup, router, highlight }, index) in menus"
          >
            <a
              v-if="href"
              :key="`footer_nav-menu_${index}`"
              :href="href"
              target="_blank"
              :class="highlight ? 'highlight' : ''"
            >
              {{ name }}
            </a>
            <a
              v-if="popup"
              :key="`footer_nav-menu_${index}`"
              href="javascript:void(0);"
              @click="onClickPopup(popup)"
            >
              {{ name }}
            </a>
            <nuxt-link
              v-if="router"
              :key="`footer_nav-menu_${index}`"
              tag="a"
              :to="{ name: router }"
              :class="highlight ? 'highlight' : ''"
            >
              {{ name }}
            </nuxt-link>
          </template>
        </nav>
        <div class="flex">
          <div class="f-info">
            <p class="neowiz">
              ㈜네오위즈 | 대표이사 : 문지수, 김승철 | 경기도 성남시
              분당구&nbsp; 대왕판교로 645번길 14 네오위즈판교타워<br />
              TEL : 1600-8870 | FAX: 031-8039-1692 | E-mail :
              <a href="mailto:help@help.pmang.com">help@help.pmang.com</a><br />
              사업자 등록번호 : 120-87-14245 | 통신판매업신고번호 : 제&nbsp;
              2010-경기성남-0562호&nbsp;
              <a
                href="http://www.ftc.go.kr/bizCommPop.do?wrkr_no=1208714245"
                target="_blank"
              >
                사업자정보확인 </a
              ><br />
              © NEOWIZ. All rights reserved
            </p>
            <p class="spolive">
              ㈜스포라이브 | 대표이사 : 김홍민 | 서울시 강남구 학동로 206,
              2층<br />
              TEL : 1522-6437 | FAX: 02-541-8063 | E-mail :
              contact@spolive.com<br />
              사업자 등록번호 : 264-81-21573 | 통신판매업신고번호 :&nbsp;
              2015-서울강남-02053호&nbsp;
              <a
                href="http://www.ftc.go.kr/bizCommPop.do?wrkr_no=2648121573"
                target="_blank"
              >
                사업자정보확인
              </a>
              <br />
              © 2013 - 2021, SPOLIVE Co.,Ltd. All rights reserved
            </p>
          </div>
          <div class="game-grade">
            <div class="grade-logo">
              <img
                src="~assets/images/footer/footer_mark_gamble.webp"
                alt="game grade gamble"
                style="margin-bottom: 4px"
              />
              <img
                src="~assets/images/footer/footer_mark_rating.webp"
                alt="game grade over 18"
              />
            </div>
            <div class="grade-info">
              <ul>
                <li>
                  <span>제명</span>
                  <p>단골스포츠축구</p>
                  <p>단골스포츠농구</p>
                  <p>스포라이브 야구</p>
                </li>
                <li>
                  <span>이용등급</span>
                  <p>청소년이용불가</p>
                </li>
                <li>
                  <span>등급분류일자</span>
                  <p>2013.10.31</p>
                  <p>2013.10.31</p>
                  <p>2016.04.07</p>
                </li>
              </ul>
              <ul>
                <li>
                  <span>상호</span>
                  <p>스포라이브(주)</p>
                </li>
                <li>
                  <span>등급분류번호</span>
                  <p>CC-NP-131031-009</p>
                  <p>CC-NP-131031-008</p>
                  <p>CC-NP-16-0407-001</p>
                </li>
                <li>
                  <span>제작업 신고번호</span>
                  <p>제2015-000043호</p>
                </li>
                <li>
                  <span>제작배급신고번호</span>
                  <p>제2015-000032호</p>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  </footer>
</template>

<script>
import { mapState } from 'vuex';

export default {
  computed: {
    ...mapState('appfooter', { menus: 'menu' }),
  },
  methods: {
    onClickPopup(popup) {
      window.open(popup.url, popup.target, popup.options);
    },
  },
};
</script>

<style scoped>
footer {
  background-color: #222222;
  width: 100%;
  min-width: 1320px;
  height: 350px;
  padding: 60px 0 40px;
  color: #d9d9d9;
  margin-top: 200px;
}

footer > div.container {
  display: flex;
  width: 1320px;
  min-width: 1320px;
  margin: 0 auto;
}

div.logo-container {
  width: 184px;
  margin-right: 15px;
}

div.logo-container > img {
  width: 184px;
  height: 30px;
  opacity: 0.7;
  margin-bottom: 20px;
}

div.f-info {
  flex: 1;
  margin-left: 15px;
  margin-right: 15px;
}

nav.info-nav {
  font-size: 14px;
  font-weight: 400;
  margin-bottom: 30px;
  margin: 5px 15px 25px;
}

nav.info-nav > a {
  color: #d9d9d9;
  margin-left: 10px;
  padding-right: 8px;
  border-right: 1px solid #d9d9d9;
}

nav.info-nav > a:first-child {
  margin-left: 0;
}

nav.info-nav > a:last-child {
  border-right: unset;
}

nav.info-nav > a.highlight {
  color: #fffb9b;
}

div.f-info p {
  font-weight: 300;
  margin-bottom: 20px;
  font-size: 12px;
}

div.f-info p:last-child {
  margin-bottom: 0;
}

div.f-info p > span {
  color: #808080;
  text-decoration: underline;
  cursor: pointer;
}

div.game-grade {
  display: flex;
  margin-left: 15px;
  width: 470px;
}

div.game-grade .grade-logo {
  width: 58px;
  margin-right: 8px;
}

div.game-grade .grade-info {
  display: inline-flex;
  width: 404px;
  height: 138px;
  background-color: #cb2929;
  padding: 4px 8px;
}

div.game-grade .grade-info ul {
  list-style-type: none;
  padding: 0;
  flex: 1;
}

div.game-grade .grade-info ul li {
  position: relative;
  font-size: 10px;
  padding-left: 80px;
}

div.game-grade .grade-info ul li span {
  position: absolute;
  top: 0;
  left: 0;
  font-weight: 700;
}

div.game-grade .grade-info ul li p {
  margin-bottom: 4px;
}
</style>
