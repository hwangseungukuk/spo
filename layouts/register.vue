<template>
  <div>
    <div>
      <header>
        <h1 @click="$router.push({ name: 'index' })">
          <img src="~assets/images/spolive-white.png" alt="" />
        </h1>
      </header>
      <nuxt></nuxt>
    </div>
    <app-footer></app-footer>
  </div>
</template>

<script>
import { createNamespacedHelpers } from 'vuex';

import AppFooter from '~/components/footer/AppFooter';

export default {
  components: {
    AppFooter,
  },
};
</script>

<style scoped>
header {
  width: 100%;
  min-width: 1320px;
  background-color: #3c577e;
  padding: 45px 0;
  text-align: center;
}

header > h1 > img {
  width: 217px;
}

header > h1:hover {
  cursor: pointer;
}

footer {
  margin-top: 50px;
}
</style>
