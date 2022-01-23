import { GET_USER_POLICIES } from '~/store/mutation-types';

const state = () => ({
  success: false,
  message: null,
  error: null,
  policies: null,
});

const mutations = {
  [GET_USER_POLICIES](state, { success, message, policies, error }) {
    state.success = success || false;
    state.message = message || null;
    state.policies = policies || null;
    state.error = error || null;
  },
};

const getters = {
  getStipulation: ({ policies }) => {
    if (policies === null) {
      return null;
    }
    return policies.stipulation;
  },
  getPrivacy: ({ policies }) => {
    if (policies === null) {
      return null;
    }
    return policies.privacy;
  },
  getOperational: ({ policies }) => {
    if (policies === null) {
      return null;
    }
    return policies.operational;
  },
  getOptionalPrivacy: ({ policies }) => {
    if (policies === null) {
      return null;
    }
    return policies.privacy2;
  },
};

let axiosCancelSource = null;

const actions = {
  async getPolicies({ commit }) {
    try {
      if (axiosCancelSource !== null) {
        await axiosCancelSource.cancel();
      }
      axiosCancelSource = await this.$axios.CancelToken.source();
      const response = await this.$axios.$get(
        '/api/member/privacy_policy.php',
        {
          cancelToken: axiosCancelSource.token,
        }
      );
      const { result, msg, data } = response;
      const success = result === 'SUCCESS' || result === 'OK';
      commit(GET_USER_POLICIES, {
        success,
        message: msg,
        policies: { ...data },
      });
    } catch (e) {
      if (this.$axios.isCancel(e)) {
        return;
      }
      console.error(e);
      commit(GET_USER_POLICIES, { success: false, error: e });
    }
  },
};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters,
};
