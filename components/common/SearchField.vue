<template>
  <form @submit.prevent="onSubmit">
    <select
      id="search-field"
      v-model="mField"
      name="search-field"
      class="selectbox"
    >
      <option
        v-for="(item, index) in items"
        :key="`search-field=${index}`"
        :value="item.value"
        :selected="index === 0"
      >
        {{ item.text }}
      </option>
    </select>
    <input id="field" v-model="mField" name="field" type="hidden" />
    <input
      id="word"
      v-model="mWord"
      :placeholder="placeholder"
      name="word"
      type="text"
    />
    <button type="submit">
      <i class="icon-svg search"></i>
    </button>
  </form>
</template>

<script>
export default {
  props: {
    placeholder: { type: String, default: null },
    field: { type: String, default: null },
    word: { type: String, default: null },
    items: { type: Array, default: () => [{ text: 'Text', value: 'value' }] },
    path: { type: String, default: null },
  },
  data() {
    const { field, word } = this;
    return {
      mField: field !== null ? field : this.items[0].value,
      mWord: word !== null ? word : '',
    };
  },
  watch: {
    path(v) {
      console.log('watch path');
      this.mField = this.items[0].value;
      this.mWord = '';
    },
    word(v) {
      console.log('watch word');
      this.mWord = v;
    },
    field(v) {
      console.log('watch field');
      if (v === undefined || v === null) {
        this.mField = this.items[0].value;
      } else {
        this.mField = v;
      }
    },
    mField() {
      console.log('watch mField');
      this.mWord = '';
    },
  },
  methods: {
    onSubmit() {
      if (this.mWord.length <= 0) {
        this.showSingleButtonModal({
          message: '검색어를 입력해 주세요.',
        });
        return;
      }
      const { mField, mWord } = this;
      this.$emit('search', { field: mField, word: mWord });
    },
  },
};
</script>

<style scoped>
form {
  display: flex;
}

form > * {
  margin-right: 5px;
}

form > *:last-child {
  margin-right: 0;
}

input#word {
  width: 190px;
  height: 30px;
  border: 1px solid #d9d9d9;
  font-size: 12px;
  background-color: white;
  border-radius: 5px;
  padding: 0 10px;
  color: #444444;
  font-family: 'NanumBarunGothic', sans-serif;
}

input#word:focus,
input#word:active {
  outline: unset;
  box-shadow: unset;
}

button,
button .icon-svg {
  transition: all 0.3s;
}

button {
  width: 30px;
  height: 30px;
  background-color: #3eb2c0;
  border-radius: 5px;
  border: 1px solid #3eb2c0;
  padding: 4px;
}

button .icon-svg.search {
  background-color: white;
  width: 20px;
  height: 18px;
}

button:hover {
  background-color: #ffffffaa;
}

button:hover .icon-svg {
  background-color: #3eb2c0aa;
}

button:focus {
  outline: unset;
  box-shadow: unset;
}
</style>
