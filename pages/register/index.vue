<template>
  <div class="termuse-container container">
    <b-row>
      <b-col class="game-termuse">
        <h4>1.게임 이용 약관</h4>
        <div class="bg-secondary">
          <b-form-checkbox
            id="termuse-all-check"
            v-model="allSelected"
            class="termuse-all-check font-weight-bolder mt-1"
            @change="selectedAll"
          >
            <span>전체 약관 동의</span>
          </b-form-checkbox>
        </div>
        <div id="spolive-service">
          <div class="d-flex justify-content-between">
            <h3>스포라이브 서비스 이용약관 <span>(필수)</span></h3>
            <button
              class="btn btn-info"
              @click="serviceView('스포라이브 서비스 이용약관', getStipulation)"
            >
              <span>전문보기</span>
            </button>
          </div>
          <div id="spolive-service-contents" v-html="getStipulation"></div>
          <b-form-checkbox
            v-model="stipulation"
            class="mt-2"
            @change="checkSelected"
          >
            <span>이용약관에 동의합니다.</span>
          </b-form-checkbox>
        </div>
        <div id="privacy-info">
          <div class="d-flex justify-content-between">
            <h3>개인정보 처리 방침 <span>(필수)</span></h3>
            <button
              class="btn btn-info"
              @click="serviceView('개인정보 처리 방침', getPrivacy)"
            >
              <span>전문보기</span>
            </button>
          </div>
          <div id="privacy-info-contents" v-html="getPrivacy"></div>
          <b-form-checkbox
            v-model="privacy"
            class="mt-2"
            @change="checkSelected"
          >
            <span>이용약관에 동의합니다.</span>
          </b-form-checkbox>
        </div>
      </b-col>
      <b-col>
        <div class="nickname-setting">
          <h4>2.닉네임 설정</h4>
          <b-form class="d-flex" @submit.prevent="onNickCheckSubmit">
            <div>
              <b-form-input
                id="input-1"
                v-model="nickname"
                type="text"
                class="inline-form-custom-input"
                placeholder="닉네임은 5자 한글, 영문, 숫자만 사용할 수 있습니다."
                required
                @input="clearNickCheck"
              ></b-form-input>
              <small
                v-show="nickAvailable !== null"
                :class="`${nickAvailable ? 'available' : ''}`"
              >
                {{
                  nickAvailable
                    ? `해당 닉네임은 사용할 수 있습니다.`
                    : nickMessage
                }}
              </small>
            </div>
            <b-button
              type="submit"
              variant="info"
              :class="`nick-check ${activeNicknameCheck ? 'activate' : ''}`"
              :disabled="!activeNicknameCheck"
            >
              <span>확인</span>
            </b-button>
          </b-form>
        </div>
        <div class="identity-verification">
          <h4>3.본인인증</h4>
          <div class="identity-verification-inner">
            <div class="d-flex">
              <button
                class="btn w-100 btn-info mr-2"
                @click="openSelfCertPopup('mobile', 'reg')"
              >
                <span>휴대폰 인증</span>
              </button>
              <button
                class="btn w-100 btn-info ml-2"
                @click="openSelfCertPopup('ipin', 'reg')"
              >
                아이핀 인증
              </button>
            </div>
            <small :class="selfCertToken !== null ? 'certified' : ''">
              {{
                selfCertToken !== null
                  ? '본인인증이 완료 되었습니다.'
                  : '게임을 정상적으로 이용하려면 반드시 본인인증이 필요합니다.'
              }}
            </small>
            <div class="d-flex">
              <b-btn
                class="mr-2"
                variant="info"
                :disabled="isDisabledRegister"
                @click="onRegisterClick"
              >
                <span>약관 동의 후 게임하기</span>
              </b-btn>
              <button
                class="btn ml-2 btn-secondary"
                @click="$router.push({ name: 'index' })"
              >
                <span>취소</span>
              </button>
            </div>
          </div>
        </div>
      </b-col>
    </b-row>
  </div>
</template>

<script>
import { createNamespacedHelpers } from 'vuex';

import { CODE_NOT_FOUND_USER } from '~/store/user/login/pmang';

import selfCertMixin from '~/mixins/selfcert/self-certification-mixin';

const {
  mapGetters: policiesGetters,
  mapActions: policiesActions,
} = createNamespacedHelpers('user/policies');

const {
  mapState: nickCheckState,
  mapActions: nickCheckActions,
} = createNamespacedHelpers('user/nickname');

const {
  mapState: registerState,
  mapActions: registerActions,
} = createNamespacedHelpers('user/register');

export default {
  layout: 'register',
  mixins: [selfCertMixin],
  async asyncData({ $auth, store, redirect }) {
    if ($auth.loggedIn) {
      redirect({ name: 'index' });
      return;
    }
    await store.dispatch('user/login/pmang/loginCheck');
    const { code, success } = store.state.user.login.pmang;
    if (success) {
      redirect({ name: 'index' });
      return;
    }

    if (code === CODE_NOT_FOUND_USER) {
      return;
    }

    redirect('https://www.pmang.com/login?pageurl=https://spolive.pmang.com');
  },
  data() {
    return {
      allSelected: false,
      stipulation: false,
      privacy: false,
      selfCertToken: null,
      nickname: null,
    };
  },
  auth: false,
  computed: {
    ...policiesGetters(['getStipulation', 'getPrivacy']),
    ...nickCheckState({
      nickAvailable: 'success',
      nickMessage: 'message',
    }),
    ...registerState(['success', 'message', 'code', 'error']),
    isDisabledRegister() {
      const { nickAvailable, stipulation, privacy, selfCertToken } = this;
      return (
        !nickAvailable || !stipulation || !privacy || selfCertToken === null
      );
    },
    activeNicknameCheck() {
      const { nickname } = this;
      return nickname !== null && nickname.length > 0;
    },
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
        message: v,
      });
    },
  },
  async beforeMount() {
    await this.getPolicies();
  },
  mounted() {
    window.addEventListener('message', this.onSelfCertReceivePostMessage);
  },
  beforeDestroy() {
    window.removeEventListener('message', this.onSelfCertReceivePostMessage);
    this.clearNickCheck();
    this.clear();
  },
  methods: {
    ...policiesActions(['getPolicies']),
    ...nickCheckActions({
      checkNickname: 'check',
      clearNickCheck: 'clear',
    }),
    ...registerActions(['register', 'clear']),
    serviceView(v, policy) {
      this.showPolicyModal({
        title: v,
        text: policy,
      });
    },
    checkSelected() {
      this.allSelected = this.stipulation && this.privacy;
    },
    selectedAll(checked) {
      this.stipulation = checked;
      this.privacy = checked;
    },
    async onNickCheckSubmit() {
      await this.checkNickname({ nickname: this.nickname });
    },
    async onRegisterClick() {
      const { selfCertToken, nickname, stipulation, privacy } = this;
      await this.register({
        selfCertToken,
        nickname,
        stipulation,
        privacy,
      });
    },
  },
};
</script>

<style scoped>
h3 {
  margin: 0;
}

.termuse-container {
  padding: 75px 0;
}

.termuse-container div.row .game-termuse {
  padding-right: 35px;
  border-right: 2px dashed #dfdfdf;
}

.termuse-container div.row .game-termuse > div:first-of-type {
  height: 35px;
  padding: 2px 10px 0;
  margin-bottom: 30px;
}

.termuse-container div.row .col:last-child {
  padding-left: 35px;
}

.termuse-container div.row .game-termuse h4,
.termuse-container div.row .nickname-setting h4,
.termuse-container div.row .identity-verification h4 {
  color: #3eb2c0;
  font-weight: bold;
  font-size: 22px;
  position: relative;
  font-weight: 900;
}

.termuse-container div.row .game-termuse h4::after,
.termuse-container div.row .nickname-setting h4::after,
.termuse-container div.row .identity-verification h4::after {
  content: '';
  position: absolute;
  width: 100%;
  height: 2px;
  background-color: #3eb2c0;
  left: 0;
  bottom: -8px;
}

.termuse-container div.row .identity-verification small.certified {
  color: #3eb2c0;
  font-weight: 800;
}

.termuse-container div.row .game-termuse .bg-secondary {
  background-color: #e5e5e5 !important;
}

.game-termuse #spolive-service div > h3,
.game-termuse #privacy-info div > h3 {
  font-weight: 600;
  font-size: 16px;
}

.game-termuse #spolive-service div > h3 > span,
.game-termuse #privacy-info div > h3 > span {
  color: #3eb2c0;
}

.game-termuse #spolive-service div > button,
.game-termuse #privacy-info div > button {
  border-radius: 0;
  padding: 0 10px;
  height: 20px;
  font-size: 12px;
}

.game-termuse #spolive-service #spolive-service-contents,
.game-termuse #privacy-info #privacy-info-contents {
  border: 1px solid #cccccc;
  height: 140px;
  background-color: #ffffff;
  padding: 8px;
  margin-top: 12px;
  overflow-y: scroll;
}

.game-termuse #privacy-info {
  margin-top: 40px;
}

.termuse-container div.row .nickname-setting > form {
  display: flex;
  padding: 69px 39px;
}

.termuse-container div.row .nickname-setting > form input {
  width: 360px;
  height: 40px;
  border: 1px solid #cccccc;
}

.termuse-container div.row .nickname-setting > form input::placeholder {
  font-size: 12px;
  color: #cccccc;
}

.termuse-container div.row .nickname-setting > form button {
  width: 145px;
  height: 40px;
  margin-left: 20px;
  border-radius: 6px;
  font-size: 14px;
}

.termuse-container div.row .nickname-setting > form button:disabled {
  background-color: #cccccc;
  color: #ffffff;
  opacity: 1;
}

.termuse-container div.row .nickname-setting > form > div {
  min-height: 70px;
}

.termuse-container div.row .nickname-setting > form > div > small {
  font-size: 12px;
  color: #cc3333;
  margin-top: 8px;
  display: inline-block;
  font-weight: 900;
  transform: skew(1deg);
}

.termuse-container div.row .nickname-setting > form > div > small.available {
  color: #3eb2c0;
}

.identity-verification > .identity-verification-inner {
  padding: 50px 55px 0;
}

.identity-verification
  > .identity-verification-inner
  div:nth-of-type(1)
  button {
  padding: 40px;
  border-radius: 6px;
}

.identity-verification
  > .identity-verification-inner
  div:nth-of-type(2)
  button {
  width: 100%;
  margin-top: 56px;
  font-size: 14px;
}

.identity-verification
  > .identity-verification-inner
  div:nth-of-type(2)
  button:nth-child(1):disabled {
  background-color: #cccccc;
  color: #ffffff;
  opacity: 1;
}

.identity-verification .identity-verification-inner > small {
  font-size: 12px;
  margin-top: 8px;
  color: #888888;
  display: inline-block;
}

.termuse-all-check span {
  font-size: 14px;
}
</style>
