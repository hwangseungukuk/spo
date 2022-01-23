<template>
  <div v-if="show" class="layer-popup" :style="getPopupLocation">
    <i class="icon-svg close thin" @click="show = false"></i>
    <div
      class="content"
      :style="`width: ${width}px; height: ${height}px; `"
      v-html="content"
    ></div>
    <div class="bottom">
      <b-form-checkbox @change="onCheckboxChange">
        <span>오늘만 다시 보지 않기</span>
      </b-form-checkbox>
    </div>
  </div>
</template>

<script>
const COOKIE_KEY_DID_NOW_SHOW_POPUP = 'DID_NOW_SHOW_POPUP_';

export default {
  props: {
    id: { type: Number, default: 0 },
    header: { type: String, default: 'header' },
    width: { type: Number, default: 0 },
    height: { type: Number, default: 0 },
    top: { type: Number, default: 0 },
    left: { type: Number, default: 0 },
    content: { type: String, default: '' },
  },
  data() {
    return {
      show: true,
    };
  },
  computed: {
    getPopupLocation() {
      const { left, top } = this;
      return `left: ${left}px; top: ${top}px; `;
    },
  },
  beforeMount() {
    let cookieVal = this.$cookies.get(
      `${COOKIE_KEY_DID_NOW_SHOW_POPUP}${this.id}`
    );
    if (cookieVal === undefined) {
      cookieVal = false;
    }
    console.log('cookieVal', cookieVal);
    this.show = !cookieVal;
  },
  methods: {
    onCheckboxChange(v) {
      this.$cookies.set(`${COOKIE_KEY_DID_NOW_SHOW_POPUP}${this.id}`, v, {
        maxAge: 60 * 60 * 24,
      });
    },
  },
};
</script>

<style scoped>
div.layer-popup {
  width: fit-content;
  position: absolute;
  background-color: white;
  color: #444444;
  font-size: 14px;
  z-index: 111;
}

div.layer-popup p {
  margin: 0;
}

div.layer-popup .header {
  font-weight: 800;
  align-items: center;
  justify-content: center;
  padding: 10px 15px;
  height: 40px;
}

div.layer-popup .icon-svg.close {
  width: 18px;
  height: 18px;
  position: absolute;
  right: 10px;
  top: 10px;
  z-index: 333;
  background-color: black;
  opacity: 1;
  cursor: pointer;
}

div.bottom {
  padding: 5px 10px;
  height: 35px;
  color: white;
  position: absolute;
  background-color: rgba(0, 0, 0, 0.5);
  bottom: 0;
  left: 0;
  right: 0;
}

div.custom-checkbox >>> label.custom-control-label::before,
div.custom-checkbox >>> label.custom-control-label::after {
  cursor: pointer;
}
</style>
