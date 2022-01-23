<template>
  <div class="league-selector-container">
    <div class="leagues flex">
      <b-btn
        variant="light"
        size="sm"
        :class="mCurrentSport === 0 ? 'on' : ''"
        @click="onSportClick(0)"
      >
        <i class="icon-svg all circle"></i>
        <span>전체</span>
      </b-btn>
      <template v-for="(mSport, index) in getSportForSelector">
        <b-btn
          :key="`selector-sport-${index}-${mSport.value}`"
          variant="light"
          size="sm"
          class="modal-open"
          :class="mCurrentSport === mSport.code ? 'on' : ''"
          @click="onSportClick(mSport.code)"
        >
          <i :class="`icon-svg ${mSport.value}`"></i>
          <span>
            {{ mSport.text }}
          </span>
        </b-btn>
      </template>
      <b-btn
        variant="light"
        size="sm"
        :class="`selector ${mCurrentSport === -1 ? 'on' : ''}`"
        @click="$emit('selector')"
      >
        <span>
          리그선택
          <i v-if="hasData" class="dotted badge"></i>
        </span>
      </b-btn>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    currentSport: { type: Number, default: 0 },
    hasData: { type: Boolean, default: false },
  },
  data() {
    return {
      mCurrentSport: 0,
    };
  },
  watch: {
    currentSport(v) {
      console.log('selector watch sport', v);
      this.mCurrentSport = v;
    },
  },
  methods: {
    onSportClick(v) {
      this.mCurrentSport = v;
      this.$emit('sport', v);
    },
  },
};
</script>

<style scoped>
div.league-selector-container {
  position: relative;
  background-color: #fff;
  border-radius: 0 0 10px 10px;
  font-size: 14px;
  padding: 10px 20px;
  margin-bottom: 20px;
}

.leagues.flex,
.leagues.flex .btn {
  align-items: center;
  justify-content: center;
}

.leagues.flex {
  width: 100%;
}

.leagues.flex .btn {
  flex: auto;
  display: flex;
  margin-right: 5px;
  color: #aaaaaa;
  font-size: 14px;
  font-weight: 800;
  line-height: 1;
  height: 35px;
  border: unset;
  background-color: transparent;
}

.leagues.flex .btn.selector {
  background-color: #f2f2f2;
  padding: 0;
  width: 110px;
  max-width: 110px;
}

.leagues.flex .btn:hover,
.leagues.flex .btn:focus,
.leagues.flex .btn:active,
.leagues.flex .btn.on {
  outline: unset;
  box-shadow: unset;
  border: unset;
}

.leagues.flex .btn:hover,
.leagues.flex .btn:focus {
  color: #3eb2c0aa;
  background-color: transparent;
}

.leagues.flex .btn.selector:hover,
.leagues.flex .btn.selector:focus {
  background-color: #f2f2f2;
}

.leagues.flex .btn:active,
.leagues.flex .btn.on {
  color: #3eb2c0;
  background-color: #ebf7f9;
}

.leagues.flex .btn:last-child {
  margin-right: 0;
}

.leagues.flex .btn .icon-svg {
  width: 16px;
  height: 16px;
  margin-right: 5px;
  background-color: #aaaaaa;
  transition: all 0.3s;
}

.leagues.flex .btn:hover .icon-svg,
.leagues.flex .btn:focus .icon-svg {
  background-color: #3eb2c0aa;
}

.leagues.flex .btn.on .icon-svg {
  background-color: #3eb2c0;
}

i.dotted.badge {
  width: 5px;
  height: 5px;
  border-radius: 50%;
  background-color: #df2f5d;
  display: inline-block;
  vertical-align: top;
  transition: all 0.3s;
  padding: 0;
}
</style>
