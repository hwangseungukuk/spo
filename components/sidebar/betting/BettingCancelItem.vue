<template>
  <div :class="`betting-cancel-item default-ctn ${mChecked ? 'checked' : ''}`">
    <div class="main-card">
      <div class="info-short flex">
        <b-checkbox
          :id="`checkbox-betting-item-${id}`"
          v-model="mChecked"
          :name="`checkbox-betting-item-${id}`"
        >
          <p class="count-info">
            {{ `${folders}폴더` }}<span>{{ `${count}게임` }}</span>
          </p>
        </b-checkbox>
        <p class="date">
          베팅 일자 <span>{{ $moment(date).format('YY.MM.DD') }}</span>
        </p>
        <div class="spacer"></div>
        <b-btn
          :aria-expanded="isExpanded ? 'true' : 'false'"
          :aria-controls="`betting-cancel-${id}`"
          variant="info"
          size="sm"
          :class="`detail ${isExpanded ? 'expanded' : ''}`"
          @click="isExpanded = !isExpanded"
        >
          <i :class="`icon-svg arrow ${isExpanded ? 'up' : 'down'}`"></i>
        </b-btn>
      </div>
      <div class="">
        <p class="rate">
          배당률
          <span>{{ rate }}</span>
        </p>
        <p class="expected">
          예상 당첨 골드
          <span>{{ expected.toLocaleString() }}</span>
        </p>
        <div class="input-number inline-flex">
          <input
            id="gameCount"
            v-model="mCountStr"
            type="text"
            name="gameCount"
            @keypress="onCancelCountKeyPress"
            @input="
              () => {
                mChecked = true;
              }
            "
          />
          <div class="button-group arrows">
            <b-btn
              size="sm"
              class="arrow up"
              variant="light"
              @click="
                () => {
                  mCountStr = (mCount + 1).toString();
                  mChecked = true;
                }
              "
            >
              <i class="icon-svg arrow up"></i>
            </b-btn>
            <b-btn
              size="sm"
              class="arrow down"
              variant="light"
              @click="
                () => {
                  mCountStr = (mCount - 1).toString();
                  mChecked = true;
                }
              "
            >
              <i class="icon-svg arrow down"></i>
            </b-btn>
          </div>
        </div>
      </div>
    </div>
    <b-collapse :id="`betting-cancel-${id}`" v-model="isExpanded">
      <div class="detail-list">
        <slot name="details"></slot>
      </div>
    </b-collapse>
  </div>
</template>

<script>
export default {
  props: {
    id: { type: Number, default: 0 },
    type: { type: String, default: 'SRS' },
    folders: { type: Number, default: 0 },
    count: { type: Number, default: 0 },
    rate: { type: Number, default: 0 },
    date: { type: Date, default: () => new Date() },
    expected: { type: Number, default: 0 },
    checked: { type: Boolean, default: false },
  },
  data() {
    return {
      mCount: 1,
      mCountStr: '1',
      isExpanded: false,
      mChecked: false,
    };
  },
  watch: {
    mCountStr(v) {
      if (!v || v.length <= 0) {
        this.mCount = 0;
        return;
      }
      const replaced = v.length > 1 ? v.replace(/(^0+)/, '') : v;
      let parsedInt = parseInt(replaced);
      if (parsedInt > this.count) {
        parsedInt = this.count;
        this.mCountStr = parsedInt.toString();
      }
      if (parsedInt <= 0) {
        this.mCountStr = '0';
      }
      this.mCount = parsedInt;

      if (!this.mChecked) {
        return;
      }
      const { id, type, mChecked, mCount } = this;
      this.$emit('on-check-change', {
        id,
        type,
        checked: mChecked,
        count: mChecked ? mCount : 1,
      });
    },
    isExpanded(v) {
      if (!v) {
        return;
      }
      const { id, type } = this;
      this.$emit('detail', { id, type });
    },
    checked(v) {
      this.mChecked = v;
      if (!v) {
        this.mCount = 1;
        this.mCountStr = this.mCount.toLocaleString();
      }
    },
    mChecked(v) {
      const { id, type, mChecked, mCount } = this;
      this.$emit('on-check-change', {
        id,
        type,
        checked: mChecked,
        count: mChecked ? mCount : 1,
      });
    },
  },
  beforeMount() {
    this.mChecked = this.checked;
  },
  methods: {
    onCancelCountKeyPress(e) {
      if (e.keyCode < 48 || e.keyCode > 57) e.returnValue = false;
    },
  },
};
</script>

<style scoped>
div.betting-cancel-item {
  width: 100%;
  min-height: 90px;
  margin-bottom: 10px;
  border: 1px solid #e6e6e6;
  background-color: #f2f2f2;
  color: #444444;
  transition: all 0.3s;
}

div.betting-cancel-item.checked {
  background-color: white;
}

div.main-card > .flex {
  align-items: center;
  justify-content: center;
}

div.main-card > .flex:last-child > *:not(:last-child) {
  flex: auto;
}

div.betting-cancel-item.selected {
  background-color: white;
}

p.rate,
p.expected {
  font-weight: 700;
  margin-bottom: 0;
  display: block;
  width: 180px;
  position: relative;
}

p.rate span,
p.expected span {
  color: #3eb2c0;
  position: absolute;
  right: 0;
  top: 0;
}

p.date span {
  margin-left: 6px;
}

p.date {
  margin-bottom: 0;
}

.info-short {
  padding: 10px 20px;
  background: #e6e6e6;
  border-radius: 10px 10px 0 0;
}
.info-short + div {
  padding: 6px 20px;
  position: relative;
}

.info-short + div > div {
  position: absolute;
  right: 20px;
  top: 7px;
}

.info-short .custom-control {
  min-height: 0;
}

.info-short p {
  margin-bottom: 0;
  font-weight: 700;
}

.info-short p.count-info {
  font-size: 12px;
  font-weight: 700;
}

.info-short p.count-info span {
  border-left: 1px solid #d9d9d9;
  border-right: 1px solid #d9d9d9;
  margin: 0 5px;
  padding: 0 5px;
  color: #3eb2c0;
}

div.betting-cancel-item .input-number input {
  width: 50px;
  height: 33px;
  border: 1px solid #cccccc;
  border-radius: 5px 0 0 5px;
  font-size: 12px;
  font-weight: 700;
  padding: 2px 10px;
  color: #999999;
  background-color: white;
  overflow: hidden;
  ime-mode: disabled;
  -ms-ime-mode: disabled;
}

div.betting-cancel-item .input-number input:focus,
div.betting-cancel-item .input-number input:active,
div.betting-cancel-item .button-group.arrows .btn:focus,
div.betting-cancel-item .button-group.arrows .btn:active {
  outline: unset;
  box-shadow: unset;
}

div.betting-cancel-item .input-number input::-webkit-outer-spin-button,
div.betting-cancel-item .input-number input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

/* Firefox */
div.betting-cancel-item .input-number input[type='number'] {
  -moz-appearance: textfield;
}

div.betting-cancel-item .input-number .button-group.arrows {
  margin-left: -1px;
}

div.betting-cancel-item .input-number .button-group.arrows .btn {
  width: 30px;
  height: 17px;
  display: block;
  padding: 0;
  border: 1px solid #cccccc;
  background-color: white;
}

div.betting-cancel-item .input-number .button-group.arrows .btn:first-child {
  border-radius: 0 5px 0 0;
}

div.betting-cancel-item
  .input-number
  .button-group.arrows
  .btn:first-child
  i.icon-svg {
  margin-bottom: 6px;
}

div.betting-cancel-item
  .input-number
  .button-group.arrows
  .btn:last-child
  i.icon-svg {
  margin-bottom: 4px;
}

div.betting-cancel-item .input-number .button-group.arrows .btn:last-child {
  border-radius: 0 0 5px 0;
  margin-top: -1px;
}

div.betting-cancel-item
  .input-number
  .button-group.arrows
  .btn
  i.icon-svg.arrow {
  width: 5px;
  height: 5px;
  background-color: #999999;
}

.btn.detail {
  width: 20px;
  height: 20px;
  font-weight: 700;
  font-size: 12px;
  border-radius: 50%;
  padding: 1px 0 0;
}

.btn.detail i.icon-svg.arrow {
  width: 8px;
  height: 8px;
  background-color: white;
}

.detail-list >>> .bet-cancel-detail {
  border-top: 1px dashed #e6e6e6;
  margin: 0 20px;
}
</style>
