<template>
  <login-form @login="(v) => login(v)"></login-form>
</template>

<script>
import { createNamespacedHelpers } from 'vuex';

import LoginForm from '~/components/login/LoginForm';

const {
  mapState: loginState,
  mapActions: loginActions,
} = createNamespacedHelpers('user/login');

const { mapActions: chattingActions } = createNamespacedHelpers('chatting');
const { mapActions: bettingActions } = createNamespacedHelpers(
  'gamecenter/betting/ws'
);

export default {
  layout: 'account',
  components: {
    LoginForm,
  },
  asyncData({ redirect }) {
    if (!process.env.PMANG_LOGIN) {
      return;
    }
    redirect({ name: 'index' });
  },
  computed: {
    ...loginState(['success', 'message', 'error']),
  },
  watch: {
    success(v) {
      if (!v) {
        return;
      }
      this.$router.push({ name: 'index' });
    },
    message(v) {
      if (v === null) {
        return;
      }
      this.showSingleButtonModal({
        message: '로그인을 할 수 없습니다.',
        description: v.replace(/(?:\\r\\n|\\r|\\n)/g, '<br />'),
      });
    },
  },
  beforeMount() {
    this.disconnectBet();
  },
  methods: {
    ...loginActions(['login', 'clear']),
    ...bettingActions({ disconnectBet: 'disconnect' }),
  },
};
</script>

<style scoped></style>
