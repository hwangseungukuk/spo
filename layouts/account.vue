<template>
  <div>
    <app-bar :menus="menus"></app-bar>
    <div class="container">
      <nuxt></nuxt>
    </div>
    <app-footer></app-footer>
    <div class="header-bg"></div>
  </div>
</template>

<script>
import { createNamespacedHelpers } from 'vuex';

import AppBar from '~/components/appbar/AppBar';
import AppFooter from '~/components/footer/AppFooter';

const { mapState: appBarState } = createNamespacedHelpers('appbar');

export default {
  components: {
    AppBar,
    AppFooter,
  },
  computed: {
    ...appBarState({ menus: 'menu' }),
  },
};
</script>

<style scoped></style>
