import Vue from 'vue';

import wsChattingMixin from '~/mixins/ws-chatting-mixin';
import wsBettingMixin from '~/mixins/ws-betting-mixin';
import clearBetCartMixin from '~/mixins/clear-bet-cart-mixin';
import openMessagesPopup from '~/mixins/openMessagesPopup';
import openSafeboxPopup from '~/mixins/openSafeboxPopup';
import modalsMixin from '~/mixins/modals-mixin';

import gameTypeMixin from '~/mixins/mapper/game-type';
import sportsMapperMixin from '~/mixins/sports-mapper-mixin';

import infoMixin from '~/mixins/info-mixin';

Vue.mixin(wsChattingMixin);
Vue.mixin(wsBettingMixin);
Vue.mixin(clearBetCartMixin);
Vue.mixin(openMessagesPopup);
Vue.mixin(openSafeboxPopup);
Vue.mixin(modalsMixin);

Vue.mixin(gameTypeMixin);
Vue.mixin(sportsMapperMixin);

Vue.mixin(infoMixin);
