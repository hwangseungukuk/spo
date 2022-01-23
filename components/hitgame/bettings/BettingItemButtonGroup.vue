<template>
  <div class="bt-row">
    <p class="game-type">{{ getGameType(type).text }}</p>
    <b-btn
      variant="light"
      :class="`b-left ${id} ${type} ${selected === outcomeL ? 'on' : ''}`"
      @click="
        onClick({
          Rate: leftRate,
          MarketType: type,
          OutcomeId: outcomeL,
          Outcome: leftLabel,
          selected: selected === outcomeL,
        })
      "
    >
      <p>{{ leftLabel }}</p>
      <div class="spacer"></div>
      <p>
        <i :class="`icon-svg ${leftStatus}`"></i>
        {{ leftRate.toFixed(2) }}
      </p>
    </b-btn>
    <template v-if="centerRate === null">
      <div v-if="allotted === null" class="b-game-spacer"></div>
      <div v-else class="b-game-center-info">
        <p>{{ getAllotted }}</p>
      </div>
    </template>
    <template v-if="centerRate !== null">
      <b-btn
        variant="light"
        :class="`b-center ${id} ${type} ${selected === outcomeC ? 'on' : ''}`"
        @click="
          onClick({
            Rate: centerRate,
            MarketType: type,
            OutcomeId: outcomeC,
            Outcome: centerLabel,
            selected: selected === outcomeC,
          })
        "
      >
        <p>{{ getAllotted || centerLabel }}</p>
        <div class="spacer"></div>
        <p>
          <i :class="`icon-svg ${centerStatus}`"></i>
          {{ centerRate.toFixed(2) }}
        </p>
      </b-btn>
    </template>
    <b-btn
      variant="light"
      :class="`b-right ${id} ${type} ${selected === outcomeR ? 'on' : ''}`"
      @click="
        onClick({
          Rate: rightRate,
          MarketType: type,
          OutcomeId: outcomeR,
          Outcome: rightLabel,
          selected: selected === outcomeR,
        })
      "
    >
      <p>{{ rightLabel }}</p>
      <div class="spacer"></div>
      <p>
        <i :class="`icon-svg ${rightStatus}`"></i>
        {{ rightRate.toFixed(2) }}
      </p>
    </b-btn>
    <slot></slot>
  </div>
</template>

<script>
import { createNamespacedHelpers } from 'vuex';

const { mapGetters: gameTypeGetters } = createNamespacedHelpers(
  'mapper/game-type'
);

let leftUpdateInverval = null;
let centerUpdateInverval = null;
let rightUpdateInverval = null;

export default {
  props: {
    id: { type: Number, default: 0 },
    marketId: { type: Number, default: 0 },
    type: { type: String, default: null },
    leftLabel: { type: String, default: 'left label' },
    centerLabel: { type: String, default: null },
    rightLabel: { type: String, default: 'right label' },
    leftRate: { type: Number, default: 0 },
    centerRate: { type: Number, default: null },
    rightRate: { type: Number, default: 0 },
    leftStatus: { type: String, default: null },
    centerStatus: { type: String, default: null },
    rightStatus: { type: String, default: null },
    hideCenter: { type: Boolean, default: false },
    outcomeL: { type: String, default: '1' },
    outcomeC: { type: String, default: 'X' },
    outcomeR: { type: String, default: '2' },
    allotted: { type: Number, default: null },
    selected: { type: String, default: null },
  },
  computed: {
    ...gameTypeGetters(['getGameType']),
    getAllotted() {
      const { type, allotted } = this;
      if (allotted === null) {
        return undefined;
      }
      if (type === 'handicap') {
        return `H${allotted >= 0 ? '+' + allotted : allotted}`;
      }
      return allotted;
    },
  },
  watch: {
    leftRate(newV, oldV) {
      const { id, allotted, type } = this;
      if (newV === oldV) {
        return;
      }
      if (leftUpdateInverval) {
        clearTimeout(leftUpdateInverval);
        leftUpdateInverval = null;
      }
      this.$jquery(`.b-left.${id}.${type}`).addClass('update');
      leftUpdateInverval = setTimeout(() => {
        this.$jquery(`.b-left.${id}.${type}`).removeClass('update');
        clearTimeout(leftUpdateInverval);
        leftUpdateInverval = null;
      }, 1000);
    },
    centerRate(newV, oldV) {
      const { id, allotted, type } = this;
      if (newV === oldV) {
        return;
      }
      if (centerUpdateInverval) {
        clearTimeout(centerUpdateInverval);
        centerUpdateInverval = null;
      }
      this.$jquery(`.b-center.${id}.${type}`).addClass('update');
      centerUpdateInverval = setTimeout(() => {
        this.$jquery(`.b-center.${id}.${type}`).removeClass('update');
        clearTimeout(centerUpdateInverval);
        centerUpdateInverval = null;
      }, 1000);
    },
    rightRate(newV, oldV) {
      const { id, allotted, type } = this;
      if (newV === oldV) {
        return;
      }
      if (rightUpdateInverval) {
        clearTimeout(rightUpdateInverval);
        rightUpdateInverval = null;
      }
      this.$jquery(`.b-right.${id}.${type}`).addClass('update');
      rightUpdateInverval = setTimeout(() => {
        this.$jquery(`.b-right.${id}.${type}`).removeClass('update');
        clearTimeout(rightUpdateInverval);
        rightUpdateInverval = null;
      }, 1000);
    },
  },
  methods: {
    onClick(v) {
      const { allotted, marketId } = this;
      this.$emit('click', {
        id: this.id,
        Allotted: allotted,
        MarketId: marketId,
        ...v,
      });
    },
  },
};
</script>

<style scoped>
div.bt-row {
  padding-bottom: 5px;
}

p {
  display: inline-block;
  width: 40px;
  margin-right: 15px;
  margin-bottom: 0;
}

p.game-type {
  text-align: center;
  color: #888888;
  font-weight: 400;
}

.collapse p.game-type {
  color: #fff;
  /* transition: all 0.3s; */
}

div > button,
div.b-game-spacer,
div.b-game-center-info {
  width: 150px;
  display: inline-flex;
  margin-right: 5px;
  border-radius: 5px;
  font-weight: 400;
}

div > button {
  font-size: 12px;
  height: 30px;
  border: 1px solid #e5e5e5;
  transition: all 0.3s;
  color: #444444;
  font-weight: 700;
  background-color: white;
  padding: 6px 20px;
}

div > button:focus {
  outline: unset;
  box-shadow: unset;
  background-color: #f2f2f2;
}

div > button > p {
  width: fit-content;
  margin: 0;
}

div > button.on {
  background: linear-gradient(90deg, #5da9d6 0%, #70d0c9 100%);
  color: white;
  border: unset;
}

div > button > p > i.icon-svg {
  width: 7px;
  height: 9px;
  margin-right: 8px;
}

div > button > p > i.icon-svg.equal,
div > button > p > i.icon-svg.null {
  display: none;
}

div > button > p > i.icon-svg.higher {
  background-color: #df2f5d;
}

div > button > p > i.icon-svg.lower {
  background-color: #195eea;
}

div > button.update {
  animation: update-blink 0.65s forwards;
}

div.b-game-center-info {
  height: 30px;
  border: 1px solid #e5e5e5;
  color: #888888;
  align-items: center;
  justify-content: center;
  background-color: #f2f2f2;
}

div.b-game-center-info > p {
  margin: 0;
  width: fit-content;
}

@keyframes update-blink {
  0% {
    border: 1px solid #3eb2c0;
    /* color: #3eb2c0; */
    background-color: #3eb2c0;
    color: white;
  }

  75% {
    border: 1px solid #3eb2c0;
    /* color: #3eb2c0; */
    background-color: #3eb2c0;
    color: white;
  }

  100% {
    border: 1px solid #e5e5e5;
    color: #444444;
  }
}
</style>
