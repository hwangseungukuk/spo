<template>
  <div>
    <title-more-comp title="경기 일정 및 결과"></title-more-comp>
    <div class="b-result-container default-ctn">
      <div class="leagues flex">
        <div>
          <p class="date">
            {{ $moment(date).format('YYYY년 MM월 DD일') }}
          </p>
          <div class="flex">
            <b-btn variant="link" @click="prev">
              <i class="icon-svg prev"></i>
              이전
            </b-btn>
            <div class="spacer"></div>
            <b-btn variant="link" @click="next">
              다음
              <i class="icon-svg next"></i>
            </b-btn>
          </div>
          <b-btn
            variant="light"
            :class="currentSport === null ? 'on' : ''"
            @click="currentSport = null"
          >
            <i class="icon-svg mr-all"></i>
            <span>전체</span>
          </b-btn>
          <template v-for="(sport, index) in getSportForHomeResult">
            <b-btn
              :key="`home-match-result-${index}-${sport.value}`"
              variant="light"
              :class="currentSport === sport.value ? 'on' : ''"
              @click="currentSport = sport.value"
            >
              <i :class="`icon-svg ${sport.value}`"></i>
              <span>{{ sport.text }}</span>
            </b-btn>
          </template>
          <b-btn
            variant="light"
            class="more"
            @click="$router.push({ name: 'hitgame-results' })"
          >
            <span>more</span>
          </b-btn>
        </div>
      </div>
      <div class="list">
        <slot></slot>
      </div>
    </div>
  </div>
</template>

<script>
import TitleMoreComp from '~/components/home/TitleMoreComp';

export default {
  components: {
    TitleMoreComp,
  },
  data() {
    return {
      date: new Date(),
      currentSport: null,
    };
  },
  watch: {
    date(v) {
      this.$emit('onChangeDate', { date: v });
    },
    currentSport(v) {
      this.$emit('onChangeSport', { sport: v });
    },
  },
  methods: {
    prev() {
      this.date = this.$moment(this.date).add(-1, 'days').toDate();
    },
    next() {
      this.date = this.$moment(this.date).add(1, 'days').toDate();
    },
  },
};
</script>

<style scoped>
div.b-result-container {
  width: 100%;
  height: 400px;
  padding: 20px;
  display: inline-flex;
  margin-bottom: 20px;
}

div.b-result-container > *:last-child {
  flex: auto;
}

div.leagues {
  width: 150px;
  height: 360px;
  background-color: #d8f0f2;
  border-radius: 10px 0 0 10px;
  align-items: center;
  justify-content: center;
}

div.leagues > div {
  width: fit-content;
  text-align: center;
  width: 120px;
}

div.leagues div.flex {
  margin-bottom: 20px;
}

p.date {
  font-size: 15px;
  font-weight: 800;
  color: #444444;
  text-align: center;
  letter-spacing: -0.4px;
  margin-bottom: 8px;
}

div.leagues div.flex button.btn-link {
  color: #3eb2c0;
  font-size: 12px;
  font-weight: 400;
  margin: 0;
  padding: 0;
}

div.leagues div.flex button.btn-link:focus,
div.leagues div.flex button.btn-link:hover,
div.leagues div.flex button.btn-link:active {
  outline: none;
  box-shadow: none;
}

div.leagues div.flex button.btn-link:focus,
div.leagues div.flex button.btn-link:active {
  text-decoration: none;
}

div.leagues div.flex i.icon-svg {
  background-color: #3eb2c0;
  height: 12px;
  margin-bottom: -2px;
  width: 12px;
}

div.leagues button.btn-light {
  background-color: #cdecef;
  border: 1px solid #a2dae1;
  color: #7fc5cd;
  font-size: 14px;
  font-weight: 400;
  height: 35px;
  margin-bottom: 10px;
  width: 110px;
  transition: all 0.3s;
}

div.leagues button.btn-light:hover {
  background-color: #3eb2c0;
  color: white;
  border: unset;
}

div.leagues button.btn-light:last-child {
  margin-bottom: 0;
}

div.leagus button.btn-light:focus,
div.leagus button.btn-light:active,
div.leagues button.btn-light.on {
  outline: none;
  box-shadow: none;
}

div.leagues button.btn-light:active:not(.more),
div.leagues button.btn-light.on:not(.more) {
  color: white;
  background: linear-gradient(90deg, #5da9d6 0%, #70d0c9 100%);
  border: none;
}

div.leagues button.btn-light > i {
  background-color: #7fc5cd;
  width: 18px;
  height: 18px;
  margin-right: 20px;
  margin-bottom: -5px;
  transition: all 0.3s;
}

div.leagues button.btn-light > i.icon-svg.mr-all {
  width: 24px;
  height: 18px;
  margin-bottom: 0;
  vertical-align: inherit;
}

div.leagues button.btn-light:hover > i,
div.leagues button.btn-light:active > i,
div.leagues button.btn-light.on > i {
  background-color: white;
}

.icon-svg.prev {
  -webkit-mask-image: url(~assets/icons/main-swipe-prev.svg);
  mask-image: url(~assets/icons/main-swipe-prev.svg);
}
.icon-svg.next {
  -webkit-mask-image: url(~assets/icons/main-swipe-next.svg);
  mask-image: url(~assets/icons/main-swipe-next.svg);
}

div.b-result-container div.list > div.match-r-item:first-child {
  border-radius: 0px 10px 0px 0px;
}

div.b-result-container div.list > div.match-r-item:last-child {
  border-radius: 0px 0px 10px 0px;
}

div.b-result-container div.list > div.match-r-item:nth-child(odd) {
  background-color: #f2f2f2;
}
div.b-result-container div.list > div.match-r-item:nth-child(even) {
  background-color: transparent;
}

.icon-svg.mr-all {
  -webkit-mask-image: url(~assets/icons/match-result/match-result-all.svg);
  mask-image: url(~assets/icons/match-result/match-result-all.svg);
}

div.leagues button.btn-light.more {
  border: 1px solid #94ced5;
  background-color: #a9dde3;
  font-weight: 700;
  color: white;
}

div.leagues button.btn-light.more:hover,
div.leagues button.btn-light.more:focus,
div.leagues button.btn-light.more:active {
  border: 1px solid #3eb2c0;
  background-color: #3eb2c0;
}
</style>
