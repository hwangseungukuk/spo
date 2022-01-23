<template>
  <div class="survey-item">
    <p class="question">
      {{ question }}
      <span v-if="required">(필수)</span>
    </p>
    <template v-if="isRadioField(type)">
      <b-form-radio-group
        :id="fieldName"
        v-model="answer"
        :name="fieldName"
        :required="required"
      >
        <template v-for="(value, vIndex) in getValues">
          <b-form-radio
            :key="`question${sort}-value${value}-${vIndex}`"
            :value="value"
          >
            <span>
              {{ type !== '1' ? value : value === 'Y' ? '예' : '아니오' }}
            </span>
          </b-form-radio>
        </template>
      </b-form-radio-group>
    </template>
    <template v-if="isTextField(type)">
      <input
        :id="fieldName"
        v-model="answer"
        :required="required"
        type="text"
        :name="fieldName"
        class="survey-textfield"
      />
    </template>
    <template v-if="isCheckboxes(type)">
      <b-form-checkbox-group
        :id="fieldName"
        v-model="selected"
        :name="fieldName"
      >
        <template v-for="(value, vIndex) in getValues">
          <b-form-checkbox
            :key="`question${sort}-value${value}-${vIndex}`"
            :value="value"
          >
            <span>{{ value }}</span>
          </b-form-checkbox>
        </template>
      </b-form-checkbox-group>
    </template>
  </div>
</template>

<script>
export default {
  props: {
    sort: { type: String, default: '1' },
    question: { type: String, default: 'question' },
    type: { type: String, default: '1' },
    fieldName: { type: String, default: 'field-name' },
    values: { type: String, default: 'Y,N' },
    required: { type: Boolean, default: false },
  },
  data() {
    return {
      answer: null,
      selected: [],
    };
  },
  computed: {
    isCheckboxes() {
      return (type) => {
        return type === '4';
      };
    },
    isTextField() {
      return (type) => {
        return type === '2';
      };
    },
    isRadioField() {
      return (type) => {
        return type === '1' || type === '3';
      };
    },
    getValues() {
      return this.values.length > 0 ? this.values.split(',') : '';
    },
  },
  watch: {
    answer(v) {
      const { fieldName, required } = this;
      this.$emit('change', { name: fieldName, required, value: v });
    },
    selected(v) {
      const { fieldName, required } = this;
      this.$emit('change', { name: fieldName, required, value: v.join(',') });
    },
  },
  beforeMount() {
    const { fieldName, required } = this;
    this.$emit('change', { name: fieldName, required });
  },
};
</script>

<style scoped>
div.survey-item {
  border-radius: 10px;
  font-size: 16px;
  font-weight: 700;
  padding: 16px;
  text-align: initial;
  background-color: #f2f2f2;
}

div.survey-item:not(:last-of-type) {
  margin-bottom: 10px;
}

p.question > span {
  color: #3eb2c0;
  font-weight: 800;
}

input.survey-textfield {
  border: 1px solid #e6e6e6;
  border-radius: 5px;
  width: 100%;
  padding: 8px 16px;
  font-size: 14px;
  font-weight: 300;
}

input.survey-textfield:focus {
  outline: #3eb2c0aa;
}

.custom-control.custom-checkbox >>> .custom-control-label > span,
.custom-control.custom-radio >>> .custom-control-label > span {
  font-size: 14px;
}

.custom-control.custom-radio >>> .custom-control-label > span {
  vertical-align: text-top;
}

.custom-control.custom-checkbox >>> .custom-control-label > span {
  vertical-align: inherit;
}

.custom-control.custom-radio
  >>> .custom-control-input:checked
  ~ .custom-control-label::before {
  border-color: #3eb2c0;
}
</style>
