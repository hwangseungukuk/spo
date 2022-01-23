<template>
  <div class="modal-container default-ctn">
    <p class="message">변경하실 닉네임을 입력한 후 변경을 선택해 주세요.</p>
    <b-form-input
      ref="inputBoxValue"
      v-model="inputBoxValue"
      class="inputBoxValue"
    />
    <p class="description">닉네임은 최소 2~13자 한글/영문/숫자 가능</p>
    <div class="button-group flex">
      <div class="spacer"></div>
      <b-btn variant="info" class="btn-confirm" @click="onConfirmClick">
        <p>
          {{ buttonConfirmText }}
        </p>
      </b-btn>
      <b-btn variant="light" class="btn-cancel" @click="onCancelClick">
        <p>
          {{ buttonCancelText }}
        </p>
      </b-btn>
      <div class="spacer"></div>
    </div>
  </div>
</template>

<script>
export const MODAL_OPTIONS = {
  height: 'auto',
  width: 500,
  adaptive: true,
  clickToClose: false,
};

export default {
  props: {
    message: { type: String, default: 'prop:message' },
    description: {
      type: String,
      default: null,
    },
    accent: {
      type: String,
      default: null,
    },
    itNo: {
      type: String,
      default: null,
    },
    caId: {
      type: String,
      default: null,
    },
    inputBox: {
      type: Boolean,
      default: false,
    },
    buttonConfirmText: { type: String, default: '변경' },
    buttonCancelText: { type: String, default: '취소' },
    onConfirm: { type: Function, default: () => {} },
    onCancel: { type: Function, default: () => {} },
  },
  data() {
    return {
      mMessage: '',
      inputBoxValue: '',
    };
  },
  watch: {
    message(v) {
      this.mMessage = v;
    },
  },
  mounted() {
    setTimeout(() => {
      this.$refs.inputBoxValue.focus();
    });
  },
  methods: {
    onConfirmClick() {
      const inputText = this.inputBoxValue.trim();
      if (inputText === this.$auth.user.mb_nick) {
        this.mMessage = '기존과 동일한 닉네임으로는 변경하실 수 없습니다.';
      } else if (inputText.length < 1) {
        this.mMessage = '닉네임을 입력해 주세요.';
      } else if (inputText.length < 2) {
        this.mMessage = '닉네임은 2자 이상 입력해 주세요.';
      } else if (inputText.length > 13) {
        this.mMessage = '닉네임은 13자 이하 입력만 가능합니다.';
      } else if (
        /[\s]/g.test(inputText) ||
        !/^[ㄱ-ㅎ|가-힣|a-z|A-Z|0-9]+$/.test(inputText)
      ) {
        this.mMessage = '닉네임은 공백없이 한글, 영문, 숫자만 입력 가능합니다.';
      } else {
        this.mMessage = null;
      }
      if (this.mMessage !== null) {
        this.showSingleButtonModal({
          message: this.mMessage,
        });
        return;
      }
      this.onConfirm(
        this.itNo,
        this.caId,
        this.inputBoxValue,
        this.onNicknameChanged
      );
    },
    async onNicknameChanged(success) {
      if (!success) {
        return;
      }
      this.$emit('close');
      this.$auth.fetchUser();
      await this._disconnectChatWs();
      await this._joinRoom();
    },
    onCancelClick() {
      this.onCancel();
      this.$emit('close');
    },
  },
};
</script>

<style scoped>
@import url(~assets/css/modal.css);
</style>
