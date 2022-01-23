<template>
  <div>
    <title-more-comp
      title="경기 일정 및 결과"
      router-name="gamecenter-betting-results"
    ></title-more-comp>
    <div class="b-result-container default-ctn">
      <div class="leagues flex">
        <div>
          <p class="date">
            {{ $moment(date).format('YYYY년 MM월 DD일') }}
          </p>
          <div class="flex">
            <b-btn variant="link" @click="prev">
              <i class="icon-svg prev"></i>
              <p>이전</p>
            </b-btn>
            <div class="spacer"></div>
            <b-btn variant="link" @click="next">
              <p>다음</p>
              <i class="icon-svg next"></i>
            </b-btn>
          </div>
          <b-btn
            variant="light"
            :class="selected === null ? 'on' : ''"
            @click="selected = null"
          >
            <i class="icon-svg all"></i>
            전체경기
          </b-btn>
          <b-btn
            variant="light"
            :class="selected === 'soccer' ? 'on' : ''"
            @click="selected = 'soccer'"
          >
            <i class="icon-svg soccer"></i>
            축구경기
          </b-btn>
          <b-btn
            variant="light"
            :class="selected === 'baseball' ? 'on' : ''"
            @click="selected = 'baseball'"
          >
            <i class="icon-svg baseball"></i>
            야구경기
          </b-btn>
          <b-btn
            variant="light"
            :class="selected === 'basketball' ? 'on' : ''"
            @click="selected = 'basketball'"
          >
            <i class="icon-svg basketball"></i>
            농구경기
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
      selected: null,
    };
  },
  watch: {
    date(v) {
      this.$emit('condition', { date: v, selected: this.selected });
    },
    selected(v) {
      this.$emit('condition', { date: this.date, selected: v });
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
  width: 1000px;
  height: 400px;
  padding: 20px;
  display: inline-block;
  margin-bottom: 20px;
}

div.b-result-container > * {
  float: left;
}

div.leagues {
  width: 180px;
  height: 360px;
  background-color: #d8f0f2;
  border-radius: 10px 0 0 10px;
  align-items: center;
  justify-content: center;
}

div.leagues > div {
  width: fit-content;
  text-align: center;
  width: 140px;
}

div.leagues div.flex {
  margin-bottom: 20px;
}

p.date {
  font-size: 16px;
  font-weight: 800;
  color: #444444;
  text-align: center;
  letter-spacing: -0.4px;
  margin-bottom: 8px;
}

div.leagues div.flex button.btn-link {
  color: #3eb2c0;
  font-size: 12px;
  font-weight: 700;
  margin: 0 5px;
  padding: 0;
}

div.leagues div.flex button.btn-link > p {
  margin-bottom: 0;
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
  width: 10px;
}

div.leagues button.btn-light {
  background-color: #3eb2c022;
  border: 1px solid #3eb2c0;
  color: #7fc5cd;
  font-size: 14px;
  font-weight: 400;
  height: 40px;
  margin-bottom: 10px;
  width: 140px;
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

div.leagues button.btn-light:active,
div.leagues button.btn-light.on {
  color: white;
  background: transparent linear-gradient(90deg, #5da9d6 0%, #70d0c9 100%) 0% 0%
    no-repeat padding-box;
  border: none;
}

div.leagues button.btn-light > i {
  background-color: #7fc5cd;
  height: 20px;
  margin-right: 20px;
  margin-bottom: -5px;
  width: 20px;
}

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
</style>
