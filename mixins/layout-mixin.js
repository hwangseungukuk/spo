import { createNamespacedHelpers } from 'vuex';

import receivePostMessage from '~/mixins/receive-post-message';

import AppBar from '~/components/appbar/AppBar';

import LoginButtonContainer from '~/components/sidebar/account/LoginButtonContainer';

import AccountInfo from '~/components/sidebar/account/AccountInfo';
import AgreementComp from '~/components/sidebar/account/AgreementComp';

import CasualButtons from '~/components/sidebar/CasualButtons';

import AppFooter from '~/components/footer/AppFooter';

const { mapState: appBarState } = createNamespacedHelpers('appbar');

const { mapGetters: mainGetters } = createNamespacedHelpers('main');

const {
  mapState: denyTogglesState,
  mapActions: denyTogglesActions,
} = createNamespacedHelpers('user/toggles');

const { mapState: pmangLoginCheck } = createNamespacedHelpers(
  'user/login/pmang'
);

export default {
  components: {
    AppBar,
    LoginButtonContainer,
    AccountInfo,
    AgreementComp,
    CasualButtons,
    AppFooter,
  },
  mixins: [receivePostMessage],
  data() {
    return {
      pinned: false,
      holdFolders: true,
      timerCount: 0,
      userChatRooms: '',
    };
  },
  computed: {
    ...pmangLoginCheck({
      pmangLoggedIn: 'success',
      pmangLoginMessage: 'message',
      pmangLoginCode: 'code',
      pmangLoginError: 'error',
    }),
    ...appBarState({ menus: 'menu' }),
    ...mainGetters(['getTopNotices']),
    ...denyTogglesState({
      toggleUpdated: 'success',
      toggleMessage: 'message',
      toggleError: 'error',
    }),
  },
  methods: {
    ...denyTogglesActions({
      updateDeny: 'updateDeny',
    }),
    startTimerCount(v) {
      this.timerCount = v;
      const interval = setInterval(() => {
        if (this.timerCount > 0) {
          this.timerCount--;
          console.log('timerCount:', this.timerCount);
        } else {
          clearInterval(interval);
        }
      }, 1000);
    },
  },
};
