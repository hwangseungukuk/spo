<template>
  <div>
    <nuxt-child></nuxt-child>
  </div>
</template>
<script>
import { mapState, mapGetters } from 'vuex';

export default {
  computed: {
    ...mapState('store/menu', ['menus']),
  },
  mounted() {
    // 빈 nuxt-child는 반드시 div로 감싸야 한다.
    // 이 페이지는 '상점 > 게임스킨' 1회 이상 연속 클릭시 하위 페이지가 열리지 않을 시 사용
    console.log('asyncData::mounted', this.$route.params.id1);
    this.$router.push({
      name: this.menus[this.$route.params.id1 === '10' ? 0 : 1].subs[0].name,
      params: {
        ...this.menus[this.$route.params.id1 === '10' ? 0 : 1].subs[0].params,
      },
    });
  },
};
</script>
