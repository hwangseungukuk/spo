<template>
  <div
    :class="`betting-cart-item ${allotted} ${id} ${outcomeId} default-ctn ${
      isLiveGame ? 'live' : ''
    }`"
  >
    <div>
      <p v-if="isLiveGame" :class="`type ${game}`">{{ typeName }}</p>
      <p :class="`${game}`">
        <span v-if="!isLiveGame" :class="`type ${game}`">
          {{ typeName }}
        </span>
        {{ allotted !== null ? `(${getAllotted})` : '' }}
        <span>{{ outcome }}</span>
      </p>
      <p class="detail">
        <span v-if="isLiveGame" class="live">LIVE</span>
        {{ detail }}
      </p>
    </div>
    <p v-show="active" class="rate">
      <span v-if="oldRate !== null" class="oldRate">
        {{ oldRate === null ? 0 : oldRate.toFixed(2) }}
      </span>
      <span>
        <i :class="`icon-svg rate ${arrow}`"></i>
        {{ rate === null ? 0 : rate.toFixed(2) }}
      </span>
    </p>
    <div
      :class="`overlay flex ${active ? '' : 'active'}`"
      @click="$emit('remove')"
    >
      <i class="icon-svg close"></i>
      <i v-show="!active" class="icon-svg locked"></i>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    id: { type: Number, default: 0 },
    game: { type: String, default: 'SRS' },
    typeName: { type: String, default: 'typeName' },
    type: { type: String, default: 'type' },
    allotted: { type: Number, default: null },
    outcomeId: { type: [String, Number], default: 'outcome-id' },
    outcome: { type: String, default: 'outcome' },
    detail: { type: String, default: 'detail' },
    arrow: { type: String, default: null },
    rate: { type: Number, default: 0 },
    active: { type: Boolean, default: true },
  },
  data() {
    return {
      oldRate: null,
    };
  },
  computed: {
    isLiveGame() {
      return this.game === 'live';
    },
    getAllotted() {
      const { type, allotted } = this;
      if (type === 'totals') {
        return allotted;
      } else {
        return `H${allotted >= 0 ? `+${allotted}` : allotted}`;
      }
    },
  },
  watch: {
    arrow(v) {
      console.log(v);
      if (v === null || v === 'null' || v === 'equal') {
        this.oldRate = null;
      }
    },
    rate(v, o) {
      console.log('betting item rate', v);
      console.log('betting item old rate', o);
      this.oldRate = !o ? null : o;
      this._blink();
    },
  },
  mounted() {
    this._blink();
  },
  methods: {
    _blink() {
      const { id, outcomeId, allotted } = this;
      const target = this.$jquery(
        `[class*='betting-cart-item ${allotted} ${id} ${outcomeId}']`
      );
      target.addClass('update');
      setTimeout(() => {
        target.removeClass('update');
      }, 500);
    },
  },
};
</script>

<style scoped>
.betting-cart-item {
  padding: 10px;
  margin-bottom: 5px;
  background-color: #f2f2f2;
  font-size: 12px;
  font-weight: 700;
  color: #888888;
  width: auto;
  min-height: 65px;
  position: relative;
  transition: all 0.3s;
}

.betting-cart-item.live {
  height: 85px;
}

.betting-cart-item > div:first-child {
  width: calc(100% - 55px);
  margin-right: 10px;
  position: absolute;
  top: 50%;
  left: 10px;
  transform: translateY(-50%);
}

.betting-cart-item > div p {
  line-height: 1;
  margin-bottom: 10px;
}

.betting-cart-item.live > div p {
  margin-bottom: 8px;
}

.betting-cart-item > div p:first-of-type {
  color: #444444;
}

.betting-cart-item > div p:last-child {
  margin-bottom: 0;
  font-weight: 400;
  width: 245px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.betting-cart-item > div p:first-child span.type.live {
  background-color: #fffb9b;
  border-radius: 25px;
  display: inline-block;
  padding: 2px 8px 1px;
  color: #3eb2e0;
  font-weight: 800;
  text-transform: uppercase;
}

.betting-cart-item > div p:first-child span:last-child {
  padding-left: 10px;
  margin-left: 5px;
  color: #3eb2c0;
  border-left: 1px solid #888888;
  display: inline-block;
  transition: all 0.3s;
}

.betting-cart-item p.live span {
  color: #3eb2c0;
}

.betting-cart-item p.detail span.live {
  background-color: #df2f5d;
  border-radius: 25px;
  font-weight: 800;
  font-size: 12px;
  color: white;
  padding: 4px 8px 2px;
  display: inline-block;
  margin-right: 5px;
}

.betting-cart-item.update {
  background-color: #3eb2c0;
  color: white;
}

.betting-cart-item.update > div p:first-of-type {
  color: white;
}

.betting-cart-item.update > div p:first-child span:last-child {
  color: white;
  border-left: 1px solid white;
}

.betting-cart-item.update > p.rate {
  color: white;
}

.betting-cart-item div.overlay {
  width: 100%;
  height: 100%;
  align-items: center;
  justify-content: center;
  flex: unset;
  position: absolute;
  background-color: rgba(60, 87, 126, 0.7);
  border-radius: 10px;
  opacity: 0;
  transition: all 0.3s;
  top: 0;
  right: 0;
  left: 0;
  bottom: 0;
}

.betting-cart-item .overlay .icon-svg {
  position: absolute;
}

.betting-cart-item .overlay.active,
.betting-cart-item:hover .overlay {
  opacity: 1;
  cursor: pointer;
}

.betting-cart-item .overlay .icon-svg.locked,
.betting-cart-item .overlay .icon-svg.close {
  background-color: white;
}

.betting-cart-item .overlay .icon-svg.close {
  opacity: 1;
}

.betting-cart-item .overlay.active .icon-svg.close,
.betting-cart-item .overlay.active:hover .icon-svg.locked {
  opacity: 0;
}

.betting-cart-item .overlay.active .icon-svg.locked,
.betting-cart-item .overlay.active:hover .icon-svg.close {
  opacity: 1;
}

p.detail {
  font-size: 12px;
}

p.rate {
  font-size: 14px;
  font-weight: 800;
  margin-bottom: 0;
  color: #3eb2c0;
  position: absolute;
  top: 50%;
  right: 10px;
  transform: translateY(-50%);
  text-align: right;
}

p.rate > span {
  display: block;
}

p.rate > span.oldRate {
  text-decoration: line-through;
  color: #cccccc;
}

p.rate .icon-svg.rate {
  width: 10px;
  height: 10px;
  margin-right: 5px;
}

p.rate .icon-svg.rate.equal,
p.rate .icon-svg.rate.null {
  display: none;
}
</style>
