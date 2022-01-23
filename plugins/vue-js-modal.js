/**
 * Modal for vue(nuxt)
 */

import Vue from 'vue';
import VModal from 'vue-js-modal/dist/ssr.nocss';

import 'vue-js-modal/dist/styles.css';

Vue.use(VModal, {
  dialog: true,
  dynamicDefault: {
    draggable: false,
    adaptive: true,
    resizable: true,
    clickToClose: false,
  },
});
