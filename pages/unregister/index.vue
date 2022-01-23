<template>
  <div class="container">
    <h4>스포라이브 서비스 이용 해지</h4>
    <h6>이용해지 전 유의사항을 필히 확인해 주세요.</h6>
    <div class="description">
      <ul class="decimal">
        <li>게임 이용 해지 신청 시 스포라이브 이용은 불가능합니다.</li>
        <li>
          서비스 해지 완료 시&nbsp;
          <span class="warn">
            스포라이브 재화 및 아이템(스포골드, 스포코인 및 보유 아이템)등&nbsp;
            모두 삭제되며, 삭제된 정보는 복구할 수 없습니다.
          </span>
        </li>
        <li>
          서비스 해지 후,&nbsp;
          <span class="warn">재가입은 해지일로 부터 30일 이후 가능</span>합니다.
        </li>
      </ul>
    </div>
    <h4>본인 인증</h4>
    <div class="button-group certifications">
      <b-btn
        variant="info"
        size="lg"
        @click="openSelfCertPopup('mobile', 'unreg')"
      >
        <span>휴대폰 인증</span>
      </b-btn>
      <b-btn
        variant="info"
        size="lg"
        @click="openSelfCertPopup('ipin', 'unreg')"
      >
        <span>아이핀 인증</span>
      </b-btn>
      <p :class="selfCertToken !== null ? 'certificated' : ''">
        {{
          selfCertToken !== null
            ? '본인인증이 완료 되었습니다.'
            : '이용해지를 위해서는 본인인증을 진행하셔야 합니다.'
        }}
      </p>
    </div>
    <div class="description">
      <ul class="dashed">
        <li>
          <b>서비스 이용 해지 시 이용해지 철회는 불가합니다.</b>
        </li>
        <li>본인 인증 완료 후 서비스 이용해지를 진행할 수 있습니다.</li>
        <!-- eslint-disable-next-line prettier/prettier -->
        <li>서비스 이용해지를 하시려면 <b>[서비스 이용해지]</b> 버튼을 눌러주세요.</li>
      </ul>
    </div>
    <div class="button-group unregister">
      <button
        class="btn btn-info"
        :disabled="selfCertToken === null"
        @click="onUnregisterClick"
      >
        <span>서비스 이용해지</span>
      </button>
      <button
        class="btn btn-secondary cancel"
        @click="$router.push({ name: 'index' })"
      >
        <span>취소</span>
      </button>
    </div>
  </div>
</template>

<script>
import { createNamespacedHelpers } from 'vuex';

import selfCertMixin from '~/mixins/selfcert/self-certification-mixin';

const {
  mapState: unregisterState,
  mapActions: unregisterActions,
} = createNamespacedHelpers('user/unregister');

const { mapActions: pmangLoginActions } = createNamespacedHelpers(
  'user/login/pmang'
);

export default {
  layout: 'register',
  mixins: [selfCertMixin],
  auth: false,
  data() {
    return {
      selfCertToken: null,
    };
  },
  computed: {
    ...unregisterState(['success', 'message', 'error']),
  },
  watch: {
    async success(v) {
      if (!v) {
        return;
      }
      await this.$auth.logout();
      this.clearPmangLogin();
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
  mounted() {
    window.addEventListener('message', this.onSelfCertReceivePostMessage);
  },
  beforeDestroy() {
    window.removeEventListener('message', this.onSelfCertReceivePostMessage);
    this.clear();
  },
  methods: {
    ...unregisterActions(['unregister', 'clear']),
    ...pmangLoginActions({ clearPmangLogin: 'clear' }),
    onUnregisterClick() {
      this.unregister({ selfCertToken: this.selfCertToken });
    },
  },
};
</script>

<style scoped>
div.container {
  width: 640px;
  padding: 30px 15px;
}

h4,
h6 {
  color: #3eb2c0;
  font-weight: 800;
}

h4 {
  font-size: 22px;
  border-bottom: 2px solid #3eb2c0;
  padding-bottom: 10px;
  margin-bottom: 10px;
}

h6 {
  font-size: 14px;
  margin-bottom: 20px;
}

div.description {
  margin: 30px auto;
  border-radius: 10px;
  background-color: #e6e6e6;
  font-size: 14px;
  font-weight: 700;
  padding: 20px 35px;
}

div.description span.warn {
  font-weight: 800;
  color: #dc3545;
}

ul {
  padding-left: 35px;
}

ul.decimal {
  list-style: decimal;
}

ul.dashed {
  list-style: none;
  padding-left: 25px;
}

ul.dashed > li {
  text-indent: -5px;
}

ul.dashed > li:before {
  content: '-';
  text-indent: -5px;
  margin-right: 10px;
}

div.button-group {
  text-align: center;
  margin: 30px auto;
}

.button-group.certifications {
  height: 128px;
}

.button-group.certifications .btn,
.button-group.unregister .btn {
  width: 240px;
  font-size: 14px;
  font-weight: 700;
}

.button-group.certifications .btn {
  height: 100px;
}

.button-group .btn:not(:last-of-type) {
  margin-right: 20px;
}

.button-group.certifications p {
  font-weight: 700;
  font-size: 12px;
  color: #888888;
  width: 500px;
  margin: 10px auto;
  text-align: initial;
}

.button-group.certifications p.certificated {
  color: #3eb2c0;
}

.button-group.unregister .btn {
  height: 40px;
}

.button-group.unregister .btn:first-of-type:disabled {
  background-color: #cccccc;
  color: #ffffff;
  opacity: 1;
}
</style>
