<template>
  <div
    :class="`sport-leagues-selector-modal default-ctn flex ${showCss}`"
    @click="(e) => e.stopPropagation()"
  >
    <div class="sports">
      <div class="header flex">
        <span>종목</span>
      </div>
      <div class="list-container">
        <template v-for="(mSport, index) in getEnabledSports">
          <sport-item
            :key="`sport-leagues-selector-sports-${index}`"
            :code="mSport.code"
            :text="mSport.text"
            :value="mSport.value"
            :selected="sport === mSport.code"
            :selected-all="mAllLeagues[mSport.code]"
            :selected-length="
              sport === mSport.code
                ? currentSelectLeagues.length
                : getSelectedLength(mSport.code)
            "
            :league-length="
              openLeagues[mSport.code] ? openLeagues[mSport.code].length : 0
            "
            @click="sport = mSport.code"
          ></sport-item>
        </template>
      </div>
    </div>
    <div class="leagues">
      <div class="header flex">
        <span>리그</span>
        <div class="spacer"></div>
        <b-btn size="sm" variant="light" class="reset" @click="onResetClick">
          <i class="icon-svg reset"></i>
          <span>초기화</span>
        </b-btn>
        <b-btn size="sm" variant="info" @click="onConfirmClick">
          <span>확인</span>
        </b-btn>
      </div>
      <div class="list-container">
        <b-form-checkbox
          v-model="mAllLeagues[sport]"
          :class="`league-item ${isCheckedAllLeagues(sport) ? 'on' : ''}`"
          :aria-controls="`sports-check-group-${sport}`"
          @change="onAllLeaguesChange"
        >
          <span>{{ `${getSportText(sport)} 전체 리그` }}</span>
        </b-form-checkbox>
        <div v-if="getOpenLeagues(sport).length > 0" class="info flex">
          <p>현재 등록된 리그</p>
          <div class="spacer"></div>
          <p v-if="showDescription">
            <i class="icon-svg exclamation"></i>
            최초 전체선택 이후 활성화된 리그는 전체선택에 포함되지 않습니다.
          </p>
        </div>
        <div v-if="getOpenLeagues(sport).length > 0" class="list">
          <b-form-checkbox
            v-model="selectAll"
            :disabled="isCheckedAllLeagues(sport)"
            :class="`league-item ${selectAll ? 'on' : ''} ${
              isCheckedAllLeagues(sport) ? 'disabled' : ''
            }`"
            @change="onSelectAllLeagueCheck"
          >
            <span>전체 선택</span>
          </b-form-checkbox>
          <b-form-checkbox-group
            :id="`sports-check-group-${sport}`"
            v-model="currentSelectLeagues"
            :name="`sports-check-group-${sport}`"
            style="display: contents"
          >
            <template v-for="league in getOpenLeagues(sport)">
              <b-form-checkbox
                :key="`sport-league-${league}`"
                :class="`league-item ${
                  isCurrentLeagueSelected(league) ? 'on' : ''
                } ${isCheckedAllLeagues(sport) ? 'disabled' : ''}`"
                :disabled="isCheckedAllLeagues(sport)"
                :value="league"
              >
                <span>{{ getSportLeagueName(league) }}</span>
              </b-form-checkbox>
            </template>
          </b-form-checkbox-group>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import SportItem from '~/components/hitgame/selector/SportLeagueSelectorSportItem';

export default {
  components: {
    SportItem,
  },
  props: {
    show: { type: Boolean, default: null },
    leagues: { type: Object, default: () => ({}) },
    openLeagues: { type: Object, default: () => ({}) },
    selectedAll: { type: Object, default: () => ({}) },
    showDescription: { type: Boolean, default: true },
  },
  data() {
    return {
      sport: 1,
      mLeagues: {},
      mAllLeagues: {},
      currentSelectLeagues: [],
      selectAll: false,
    };
  },
  computed: {
    showCss() {
      const { show } = this;
      return show === null ? '' : show ? 'show' : 'hide';
    },
    isCheckedAllLeagues() {
      return (sport) => {
        const { mAllLeagues } = this;
        if (!mAllLeagues[sport]) {
          return false;
        }
        return mAllLeagues[sport];
      };
    },
    isCurrentLeagueSelected() {
      return (league) => {
        if (!this.currentSelectLeagues) {
          return false;
        }
        return this.currentSelectLeagues.includes(league);
      };
    },
    isLeagueChecked() {
      return (sport, league) => {
        if (!this.mLeagues[sport]) {
          return false;
        }
        return this.mLeagues[sport].includes(league);
      };
    },
    getSelectedLength() {
      return (sport) => {
        if (!this.mLeagues[sport]) {
          return 0;
        }
        return this.mLeagues[sport].length;
      };
    },
  },
  watch: {
    show(v) {
      const { leagues, selectedAll } = this;
      this.mLeagues = { ...leagues };
      this.mAllLeagues = { ...selectedAll };
    },
    openLeagues(v) {
      this.updateMutateLeagues(v);
    },
    sport(v, old) {
      this.mLeagues[old] = [...this.currentSelectLeagues];
      this.currentSelectLeagues = this.mLeagues[v] ? [...this.mLeagues[v]] : [];
      this.selectAll =
        this.currentSelectLeagues.length === this.getOpenLeagues(v).length;
    },
    currentSelectLeagues(v) {
      this.selectAll = v.length === this.getOpenLeagues(this.sport).length;
    },
  },
  beforeMount() {
    const { selected, sportSelectedAll, openLeagues } = this;

    this.mLeagues = { ...selected };
    this.mAllLeagues = { ...sportSelectedAll };

    this.updateMutateLeagues(openLeagues);
  },
  methods: {
    getOpenLeagues(sportId) {
      const result = this.openLeagues[sportId];
      if (!result) {
        return [];
      }
      return result;
    },
    updateMutateLeagues(leagues) {
      const keyList = Object.keys(leagues);
      console.log('updateMutateLeagues keyList', keyList);
      for (const key of keyList) {
        if (!this.mLeagues[key]) {
          this.mLeagues[key] = [];
        }
        if (!this.mAllLeagues[key]) {
          this.mAllLeagues[key] = false;
        }
      }
      const valueList = Object.values(leagues).flat();
      console.log('updateMutateLeagues valueList', valueList);
      Object.keys(this.mLeagues).map((sport) => {
        this.mLeagues[sport] = this.mLeagues[sport].filter((league) => {
          return valueList.includes(league);
        });
      });
      this.currentSelectLeagues = this.currentSelectLeagues.filter((league) => {
        return valueList.includes(league);
      });
    },
    onSelectAllLeagueCheck(check) {
      const { sport } = this;
      this.currentSelectLeagues = check ? [...this.getOpenLeagues(sport)] : [];
    },
    onAllLeaguesChange(checked) {
      const { sport } = this;
      this.mAllLeagues[sport] = checked;
      this.currentSelectLeagues = [];
    },
    onConfirmClick() {
      this.mLeagues[this.sport] = [...this.currentSelectLeagues];
      const { mLeagues: leagues, mAllLeagues: selectedAll } = this;
      this.$emit('confirm', { leagues, selectedAll });
      this.sport = 1;
      this.$emit('close');
    },
    onResetClick() {
      this.currentSelectLeagues = [];
      this.mLeagues = {};
      this.mAllLeagues = {};
      this.onConfirmClick();
    },
  },
};
</script>

<style scoped>
div.sport-leagues-selector-modal {
  position: absolute;
  width: 920px;
  left: 0;
  right: 0;
  top: 70px;
  z-index: 99;
  box-shadow: 0 5px 5px 2px rgba(0, 0, 0, 0.2);
  line-height: 1;
  transition: all 0.5s;
}

div.sport-leagues-selector-modal.show {
  transform: translateY(0);
  opacity: 1;
}

div.sport-leagues-selector-modal.hide {
  transform: translateY(-25px);
  opacity: 0;
  z-index: -1;
}

.sports {
  width: 200px;
  border-right: 1px solid #e6e6e6;
}

.leagues {
  flex: 1;
}

.sports > .header,
.leagues > .header {
  height: 40px;
  padding: 10px 10px 10px 20px;
  align-items: center;
  color: #444444;
  font-weight: 800;
  font-size: 12px;
  border-bottom: 1px dashed #e6e6e6;
}

.leagues > .header .btn {
  width: 80px;
  height: 25px;
  margin-right: 5px;
  font-size: 12px;
}

.leagues > .header .btn.btn-light {
  color: #aaaaaa;
  background-color: white;
  border: 1px solid #e6e6e6;
}

.leagues > .header .btn:last-child {
  margin-right: 0;
}

.leagues > .header .btn.reset .icon-svg {
  width: 12px;
  height: 12px;
  background-color: #aaaaaa;
  margin-bottom: -2px;
  margin-right: 5px;
}

.sports > .list-container,
.leagues > .list-container {
  height: 340px;
  overflow-x: hidden;
  overflow-y: scroll;
}

.leagues > .list-container {
  padding: 5px 0 5px 20px;
}

.leagues > .list-container .info {
  margin: 8px 20px 8px 4px;
}

.leagues > .list-container .info p {
  font-weight: 700;
  color: #444444;
  margin: 0;
}

.leagues > .list-container .info p:last-of-type {
  color: #888888;
  font-weight: 400;
}

.leagues > .list-container .info p:last-of-type .icon-svg {
  background-color: #aaaaaa;
  width: 14px;
  height: 14px;
  margin-right: 4px;
  vertical-align: bottom;
}

.bv-no-focus-ring p.header {
  margin-top: 15px;
  margin-bottom: 5px;
  padding-left: 5px;
  width: calc(100% - 30px);
  color: #888888;
}

.league-item {
  width: 220px;
  height: 30px;
  margin-right: 5px;
  margin-bottom: 5px;
  border: 1px solid #e6e6e6;
  border-radius: 5px;
  padding: 4px 10px 0 30px;
  display: inline-block;
  transition: all 0.3s;
  color: #888888;
}

.league-item.league-all {
  border-color: #3eb2c0;
  color: #3eb2c0;
}

.league-item span {
  font-size: 12px;
  font-weight: 700;
  line-height: 1.7;
  max-width: 170px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  display: block;
}

.league-item.on {
  background-color: #3eb2c0;
  border-color: #3eb2c0;
}

.league-item.on span {
  color: white;
}

.league-item.disabled {
  background-color: #f2f2f2;
  border-color: #f2f2f2;
}

.league-item.disabled span {
  color: #cccccc;
}

.league-item.league-all.custom-checkbox >>> .custom-control-label::after {
  border-color: #3eb2c0;
}

.league-item.disabled.custom-checkbox >>> .custom-control-label::before {
  background-color: #f2f2f2;
}

.league-item.disabled.custom-checkbox >>> .custom-control-label::after {
  border-color: #cccccc;
}

.custom-checkbox >>> .custom-control-label {
  width: 100%;
  height: 100%;
}

.custom-checkbox
  >>> .custom-control-input:checked
  ~ .custom-control-label::before {
  background-color: white;
}

.custom-checkbox
  >>> .custom-control-input:checked
  ~ .custom-control-label::after {
  background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' width='8' height='8' viewBox='0 0 8 8'%3e%3cpath fill='%233eb2c0' d='M6.564.75l-3.59 3.612-1.538-1.55L0 4.26l2.974 2.99L8 2.193z'/%3e%3c/svg%3e");
}
</style>
