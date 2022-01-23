<template>
  <modal
    :width="740"
    :height="800"
    :name="`${MODAL_NAME}${sport}`"
    :click-to-close="false"
    :scrollable="true"
  >
    <div class="header">
      <p class="title">
        {{ getSportByValue(sport).text }}
      </p>
      <button
        class="btn p-0"
        @click="$router.push({ name: 'info-rules-live' })"
      >
        <img src="~assets/images/info/w-close-btn.png" alt="" />
      </button>
    </div>
    <div class="contents bg-white">
      <div v-html="content"></div>
    </div>
  </modal>
</template>

<script>
const MODAL_NAME = 'INFO_MODAL_SPORT_';

export default {
  data() {
    return {
      MODAL_NAME,
      sport: this.$route.params.sport,
      content: '',
    };
  },
  async created() {
    this.content = await this.$axios.$get(
      `/html/rules/livegame/${this.sport}.html`
    );
  },
  mounted() {
    this.$modal.show(`${MODAL_NAME}${this.sport}`);
  },
};
</script>

<style scoped>
.header {
  padding: 16px 20px;
  background-color: #3eb2c0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-top-left-radius: 10px;
  border-top-right-radius: 10px;
}

p.title {
  font-size: 16px;
  font-weight: 800;
  margin: 0;
  color: #ffffff;
}

div.contents {
  height: 740px;
  overflow-y: auto;
  border-bottom-left-radius: 10px;
  border-bottom-right-radius: 10px;
}

div.contents >>> p {
  margin-bottom: 0;
  font-weight: 700;
}

div.contents div >>> p > strong {
  color: #3eb2c0;
  font-weight: 900;
}

div.contents >>> div.live-content > dl dt,
div.trades-live-content > dl dt {
  position: relative;
  font-size: 14px;
  color: #3eb2c0;
  padding-top: 10px;
}

div.contents >>> div.live-content > dl dt::before,
div.trades-live-content > dl td::before {
  position: absolute;
  top: 0px;
  left: 0px;
  width: 50px;
  height: 5px;
  background: #3eb2c0;
  content: '';
}
</style>
