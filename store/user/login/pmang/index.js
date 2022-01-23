import { PMANG_LOGIN_CHECK } from '~/store/mutation-types';

export const CODE_NOT_PROVIDE_INFORMATION = 'NOT_PROVIDE_INFORMATION';
export const CODE_NOT_FOUND_USER = 'NOT_FOUND_MEMBER';
export const CODE_NOT_LOGIN_PMANG = 'NOT_LOGIN_PMANG';

const MESSAGE_OBJECT = {
  MEMBER_INTERCEPT: '회원님의 아이디는 접근이 금지되어 있습니다.',
  MEMBER_SANCTIONS: '회원님은 운영정책 위반으로 제재되었습니다.',
  MEMBER_LEAVE:
    '고객님께서 스포라이브 서비스 이용 해지를 완료하여<br />게임 서비스를 이용할 수 없습니다.',
};

const state = () => ({
  success: false,
  message: null,
  code: null,
  error: null,
  data: null,
});

const mutations = {
  async [PMANG_LOGIN_CHECK](
    state,
    { success, message, code, data, error, token }
  ) {
    state.success = success || false;
    state.message = message || null;
    state.code = code || null;
    state.error = error || null;
    state.data = data || null;
    this.$cookies.set('token', token, {
      maxAge: 60 * 60 * 24,
    });
    if (success) {
      await this.$auth.setToken('spolive', token);
      if (!this.$auth.user || this.$auth.user === null) {
        await this.$auth.fetchUser();
      }
    } else {
      if (!process.env.PMANG_LOGIN) {
        return;
      }
      await this.$auth.logout();
    }
  },
  clear(state) {
    state.success = false;
    state.message = null;
    state.code = null;
    state.error = null;
  },
};

let axiosCancelSource = null;

const actions = {
  async loginCheck({ commit }) {
    try {
      if (axiosCancelSource !== null) {
        await axiosCancelSource.cancel();
      }
      axiosCancelSource = await this.$axios.CancelToken.source();
      const response = await this.$axios.$get(
        '/api/member/pmang_login_check.php',
        {
          cancelToken: axiosCancelSource.token,
        }
      );
      const { result, msg, data } = response;
      const success = result === 'SUCCESS' || result === 'OK';
      const message = success
        ? null
        : result === 'NOT_PROVIDE_INFORMATION'
        ? null
        : MESSAGE_OBJECT[result]
        ? MESSAGE_OBJECT[result]
        : msg;
      commit(PMANG_LOGIN_CHECK, {
        success,
        message,
        code: success ? null : result,
        data: success ? null : parseData(result, data),
        token: success ? (data ? data.token : null) : null,
      });
    } catch (e) {
      if (this.$axios.isCancel(e)) {
        return;
      }
      console.error(e);
      commit(PMANG_LOGIN_CHECK, { success: false, error: e });
    }
  },
  clear({ commit }) {
    commit('clear');
  },
};

const parseData = (code, data) => {
  if (!data || data === null) {
    return null;
  }

  if (code === 'MEMBER_INTERCEPT') {
    return [`처리일: ${data.date}`];
  }

  if (code === 'MEMBER_SANCTIONS') {
    return [`사유: ${data.cause}`, `처리일: ${data.date}`];
  }

  if (code === 'MEMBER_LEAVE') {
    return [
      `신청 닉네임: ${data.member_nick}`,
      `서비스 이용 해지일: ${data.leave_date}`,
      `재가입 가능일: ${data.restore_date}`,
    ];
  }

  return null;
};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
};
