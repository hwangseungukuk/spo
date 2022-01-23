<template>
  <div :class="`board item flex ${sign}`">
    <p class="label date">
      {{ $moment(odTime).format('YYYY.MM.DD HH:mm') }}
    </p>
    <p class="label part">
      {{ getPart() }}
    </p>
    <p class="label content">{{ itName }}</p>
    <p class="label use">{{ getPrice() }}</p>
    <p class="label charge">
      {{ chargeGold ? '+' + chargeGold.toLocaleString() : '-' }}
    </p>
  </div>
</template>

<script>
export default {
  props: {
    odTime: { type: Date, default: () => new Date() },
    odSettleCase: { type: String, default: null },
    itName: { type: String, default: null },
    price: { type: Number, default: 0 },
    chargeGold: { type: Number, default: 0 },
  },
  data() {
    return {
      sign: '',
    };
  },
  mounted() {
    if (String(this.price).substr(0, 1) === '-') {
      this.sign = 'withdrawal';
      this.price = Number(String(this.price).substr(1));
      console.log('price:', String(this.price).substr(1));
    }
  },
  methods: {
    getOdSettleCase(v) {
      return v.includes('골드');
    },
    getPart() {
      return this.getOdSettleCase(this.itName)
        ? '골드 구매'
        : this.sign === 'withdrawal'
        ? '구매취소'
        : this.odSettleCase;
    },
    getPrice() {
      const sg = this.sign === 'withdrawal' ? '+' : '-';
      return sg + this.price.toLocaleString();
    },
  },
};
</script>

<style scoped>
div.board.item {
  height: 40px;
  align-items: center;
}

.label,
div.label > p {
  margin-bottom: 0;
  color: #444444;
  text-align: center;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-weight: 700;
}

p.label.date,
p.label.use,
p.label.part,
p.label.charge {
  width: 160px;
}
p.label.part {
  color: #df2f5d;
}
p.label.content {
  flex: 1;
}

p.label.use {
  color: #df2f5d;
}
p.label.charge {
  color: #195eea;
}

.withdrawal p.label.part,
.withdrawal p.label.use {
  color: #195eea;
}
</style>
