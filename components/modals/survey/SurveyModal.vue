<template>
  <div class="modal-container default-ctn">
    <i class="icon-svg close thin" @click="$emit('close')"></i>
    <div class="header flex">
      <img
        class="spologo"
        src="~assets/images/spolive-black.png"
        alt="Spolive logo"
      />
      <p>승부예측 게임 사용자 설문조사</p>
    </div>
    <b-form id="user-survey" name="user-survey" @submit.prevent="onSubmit">
      <div class="survey-list">
        <template v-for="(question, index) in list">
          <survey-item
            :key="`survey-q-${index}${question.sort}`"
            :question="question.content"
            :required="question.mandatory === 'Y'"
            :type="question.type"
            :field-name="question.post_name"
            :values="question.type_item"
            :sort="question.sort"
            @change="onFieldChange"
          ></survey-item>
        </template>
      </div>
      <button type="submit" class="btn btn-lg btn-info submit">
        <span>설문 제출하고 1,000만 스포골드 받자!</span>
      </button>
    </b-form>
  </div>
</template>

<script>
import { createNamespacedHelpers } from 'vuex';

import SurveyItem from '~/components/modals/survey/item/SurveyItem';

const {
  mapState: surveyState,
  mapActions: surveyActions,
} = createNamespacedHelpers('main/survey');

const {
  mapState: surveySendState,
  mapActions: surveySendActions,
} = createNamespacedHelpers('main/survey/send');

export const MODAL_OPTIONS = {
  width: 780,
  height: 620,
  adaptive: true,
  clickToClose: false,
};

export default {
  components: {
    SurveyItem,
  },
  data() {
    return {
      form: new FormData(),
      formObj: {},
    };
  },
  computed: {
    ...surveyState(['success', 'message', 'error', 'list']),
    ...surveySendState({
      sended: 'success',
      sendMessage: 'message',
      sendError: 'error',
    }),
    hasRequiredEmptyFields() {
      const { formObj } = this;
      return Object.values(formObj).some(({ required, value }) => {
        return required && (!value || value === null || value.length <= 0);
      });
    },
  },
  watch: {
    sended(v) {
      this.showSingleButtonModal({
        message:
          '1,000만 스포골드 지급완료!<br />설문에 참여해 주셔서 감사합니다.',
        onConfirm: () => {
          this.$auth.fetchUser();
          this.$emit('close');
        },
      });
    },
    error(e) {
      if (e === null) {
        return;
      }
      this.showSingleButtonModal({
        message: '알 수 없는 문제가 발생했습니다.',
        onConfirm: () => {
          this.$emit('close');
        },
      });
    },
    sendError(e) {
      if (e === null) {
        return;
      }
      this.showSingleButtonModal({
        message: '알 수 없는 문제가 발생했습니다.',
      });
    },
    message(v) {
      if (v === null) {
        return;
      }
      this.showSingleButtonModal({
        message: v,
      });
    },
    sendMessage(v) {
      if (v === null) {
        return;
      }
      this.showSingleButtonModal({
        message: v,
      });
    },
  },
  async beforeMount() {
    console.log('beforemount');
    await this.getSurvey();
  },
  beforeDestroy() {
    console.log('beforedestroy');
    this.clearSurvey();
    this.clear();
  },
  methods: {
    ...surveyActions({
      getSurvey: 'getSurvey',
      clearSurvey: 'clear',
    }),
    ...surveySendActions({
      sendSurvey: 'send',
      clear: 'clear',
    }),
    onSubmit() {
      if (this.hasRequiredEmptyFields) {
        this.showSingleButtonModal({
          message: '비어있는 필수항목이 있습니다.',
        });
        return;
      }
      this.sendSurvey(this.form);
    },
    onFieldChange({ name, required, value }) {
      this.form.append(name, value);
      this.formObj = {
        ...this.formObj,
        [name]: {
          ...this.form[name],
          required,
          value,
        },
      };
    },
  },
};
</script>

<style scoped>
p {
  margin: 0;
}

div.modal-container {
  position: relative;
  padding: 24px 32px;
  color: #444444;
}

i.icon-svg.close {
  width: 18px;
  height: 18px;
  position: absolute;
  top: 24px;
  right: 24px;
}

i.icon-svg.close:hover {
  cursor: pointer;
}

div.header {
  align-items: center;
  justify-content: center;
}

div.header > * {
  display: inline-block;
}

div.header img.spologo {
  width: 132px;
  margin-right: 10px;
}

div.header p {
  font-size: 20px;
  font-weight: 800;
}

form {
  text-align: center;
}

form div.survey-list {
  margin: 24px auto;
  height: 440px;
  overflow: hidden scroll;
}

form .btn.submit {
  font-weight: 800;
  font-size: 18px;
  min-width: 350px;
  height: 45px;
  border-radius: 25px;
}
</style>
