<template>
  <form @submit.prevent="onSubmit">
    <div
      v-if="categories.length > 0"
      class="field-group flex align-items-center"
    >
      <div class="label">
        <p>문의유형</p>
      </div>
      <div class="field" style="padding: 0 20px">
        <select
          id="category"
          v-model="mCategory"
          name="category"
          class="selectbox"
        >
          <option selected disabled :value="null">선택해 주세요</option>
          <option
            v-for="(item, index) in categories"
            :key="`qna-category-${index}`"
            :value="item.text"
          >
            {{ item.text }}
          </option>
        </select>
      </div>
    </div>
    <slot name="faq-list"></slot>
    <div class="field-group flex">
      <div class="label">
        <p>이메일</p>
      </div>
      <div class="field flex">
        <input
          id="email"
          v-model="mEmail"
          type="email"
          name="email"
          placeholder="이메일 주소를 입력해 주세요."
        />
        <b-checkbox v-model="receiveToMail">메일로 답변 받기</b-checkbox>
      </div>
    </div>
    <div class="field-group flex">
      <div class="label">
        <p>휴대폰</p>
      </div>
      <div class="field">
        <input id="contact" v-model="mContact" type="phone" name="contact" />
      </div>
    </div>
    <div class="field-group flex">
      <div class="label">
        <p>제목</p>
      </div>
      <div class="field">
        <input id="subject" v-model="mSubject" type="text" name="subject" />
      </div>
    </div>
    <div class="field-group flex">
      <div class="label">
        <p>내용</p>
      </div>
      <div class="field editor-container">
        <quill-editor
          :contents="contents"
          @empty="onEditorEmpty"
          @input="onEditorInput"
          @import-image="$emit('import-image', $event)"
          @image-removed="$emit('image-removed', $event)"
        ></quill-editor>
      </div>
    </div>
    <div class="field-group flex">
      <div class="label">
        <p>베팅내역</p>
      </div>
      <div class="field bet-list-field flex">
        <template v-if="betCount <= 0">
          <b-btn
            variant="secondary"
            size="sm"
            class="bet-list-info"
            @click="$emit('betting')"
          >
            <p>클릭하여 베팅 내역을 업로드해 주세요.</p>
          </b-btn>
        </template>
        <template v-else>
          <p class="bet-list-info has-item">
            {{ `${betCount}개의 베팅내역 첨부완료` }}
          </p>
          <b-btn
            size="sm"
            variant="second"
            class="bet-list-change"
            @click="$emit('betting')"
          >
            <p>변경</p>
          </b-btn>
        </template>
      </div>
    </div>
    <div class="betting-history-list">
      <slot name="betting-histories"></slot>
    </div>
    <div class="field-group flex">
      <div class="label">
        <p>파일</p>
      </div>
      <div class="field files-area">
        <div class="flex">
          <p
            :class="`file-input ${
              mFiles.length + getNotDeleteOriginFiles.length >= 2
                ? 'disabled'
                : ''
            }`"
            @click="
              () => {
                if (mFiles.length + getNotDeleteOriginFiles.length >= 2) {
                  return;
                }
                $refs.addFile.click();
              }
            "
          >
            {{
              mFiles.length + getNotDeleteOriginFiles.length >= 2
                ? '최대 2개의 파일을 첨부 할 수 있습니다.'
                : '선택된 파일이 없습니다.'
            }}
          </p>
          <b-btn
            :disabled="mFiles.length + getNotDeleteOriginFiles.length >= 2"
            variant="info"
            size="sm"
            class="file-add"
            @click="$refs.addFile.click()"
          >
            <p>추가</p>
          </b-btn>
          <input
            id="add-file"
            ref="addFile"
            type="file"
            name="add-file"
            style="display: none"
            @change="onAddFileChange"
          />
        </div>
        <div v-if="mFiles.length >= 1" class="file-list">
          <template v-for="(file, index) in mFiles">
            <div
              :key="`file-item-${index}_${file.name}`"
              class="file-item flex"
            >
              <p>{{ file.name }}</p>
              <b-btn
                variant="secondary"
                class="delete"
                @click="onFileDeleteClick(index)"
              >
                <p>삭제</p>
              </b-btn>
            </div>
          </template>
        </div>
        <div v-if="getNotDeleteOriginFiles.length >= 1" class="file-list">
          <template v-for="(file, index) in getNotDeleteOriginFiles">
            <div
              :key="`file-item-${index}_${file.file}`"
              class="file-item flex"
            >
              <p>{{ file.name }}</p>
              <b-btn
                variant="secondary"
                class="delete"
                @click="file.deleted = true"
              >
                <p>삭제</p>
              </b-btn>
            </div>
          </template>
        </div>
        <p class="info">
          파일등록안내<br />
          파일용량 : 1Mbyte이하 첨부가능 / 최대 2개까지 등록 가능
        </p>
      </div>
    </div>
    <div class="button-group">
      <b-btn variant="info" class="submit" type="submit" :disabled="requesting">
        <p>작성완료</p>
      </b-btn>
      <b-btn
        variant="secondary"
        class="cancel"
        :disabled="requesting"
        @click="$emit('cancel')"
      >
        <p>취소</p>
      </b-btn>
    </div>
  </form>
</template>

<script>
import QuillEditor from '~/components/community/write/editor/QuillEditor';

export default {
  components: {
    QuillEditor,
  },
  props: {
    requesting: { type: Boolean, default: false },
    categories: { type: Array, default: () => [] },
    category: { type: String, default: null },
    email: { type: String, default: null },
    contact: { type: String, default: null },
    subject: { type: String, default: null },
    contents: { type: String, default: null },
    betCount: { type: Number, default: 0 },
    files: { type: Array, default: () => [] },
  },
  data() {
    return {
      contentsIsEmpty: true,
      mCategory: null,
      mSubject: '',
      mContents: '',
      mEmail: '',
      mContact: '',
      currentLink: '',
      currentFile: '',
      receiveToMail: false,
      mFiles: [],
      originFiles: [],
    };
  },
  computed: {
    getNotDeleteOriginFiles() {
      return this.originFiles.filter((file) => !file.deleted);
    },
  },
  watch: {
    mCategory(v) {
      const result = this.categories.find((category) => category.text === v);
      this.$emit('category', result);
    },
  },
  beforeMount() {
    this.mCategory = this.category;
    this.mSubject = this.subject;
    this.mContents = this.contents;
    this.mEmail = this.email;
    this.mContact = this.contact;
    if (this.files.length > 0) {
      this.originFiles = JSON.parse(JSON.stringify(this.files));
    }
  },
  methods: {
    onSubmit() {
      const {
        mCategory,
        mSubject,
        mContents,
        contentsIsEmpty,
        mFiles,
        mContact,
        mEmail,
        originFiles,
      } = this;
      if (mCategory === null || mCategory.length <= 0) {
        this.showSingleButtonModal({
          message: '문의유형을 선택해 주세요.',
          description: null,
        });
        return;
      }
      if (mSubject === null || mSubject.length <= 0) {
        this.showSingleButtonModal({
          message: '제목을 입력해 주세요.',
          description: null,
        });
        return;
      }
      if (contentsIsEmpty) {
        this.showSingleButtonModal({
          message: '내용을 입력해 주세요.',
          description: null,
        });
        return;
      }
      if (mEmail === null || mEmail.length <= 0) {
        this.showSingleButtonModal({
          message: '이메일 주소를 입력해 주세요.',
          description: null,
        });
        return;
      }
      this.$emit('submit', {
        category: mCategory,
        subject: mSubject,
        contents: mContents,
        files: mFiles,
        contact: mContact,
        email: mEmail,
        originFiles,
      });
    },
    onEditorEmpty(v) {
      this.contentsIsEmpty = v;
    },
    onEditorInput(v) {
      this.mContents = v;
    },
    onFileDeleteClick(index) {
      this.mFiles.splice(index, 1);
    },
    onAddFileChange(e) {
      if (e.target.files[0].size <= 1024000) {
        const files = e.target.files || e.dataTransfer.files;
        if (files.length <= 0) {
          return;
        }

        if (this.duplicateName(e.target.files[0].name) === '중복') {
          this.showSingleButtonModal({
            message: '동일한 파일이 이미 추가되어 있습니다.',
          });
          this.$jquery('#add-file').val('');
          return;
        }

        this.mFiles = [...this.mFiles, e.target.files[0]];
        this.$jquery('#add-file').val('');
      } else {
        this.showSingleButtonModal({
          message: '첨부파일의 용량을 1Mbyte이하로 해주세요.',
          description: null,
        });
      }
    },
    duplicateName(name) {
      let state = '';
      this.mFiles.map((mFile) => {
        if (mFile.name === name) {
          state = '중복';
        }
      });
      return state;
    },
  },
};
</script>

<style scoped>
form {
  z-index: 0;
}

select.selectbox {
  height: 25px;
}

.faq-headers {
  height: 40px;
  display: flex;
  align-items: center;
  padding: 10px 15px;
}

.faq-headers p {
  margin-bottom: 0;
  color: #3eb2c0;
  font-size: 14px;
  font-weight: 800;
}

.faq-headers .icon-svg {
  background-color: #3eb2c0;
  width: 20px;
  height: 20px;
  margin-right: 15px;
}

.faq-items:last-child {
  margin-bottom: 10px;
}

div.field-group {
  min-height: 40px;
  border-bottom: 1px solid #e5e5e5;
}

div.field-group:first-child {
  border-top: 2px solid #e5e5e5;
}

div.field-group:last-child {
  border-bottom: 2px solid #e5e5e5;
}

div.field-group > .label {
  width: 200px;
  background-color: #f2f2f2;
  color: #444444;
  font-size: 12px;
  font-weight: 700;
  padding: 10px 0;
  display: flex;
}

div.field-group > .label p {
  margin: 0 auto;
  letter-spacing: 5px;
}

div.field-group > .field {
  flex: 1;
  padding: 7px 20px 0;
  /* padding: 5px 20px; */
  max-width: 680px;
}

div.field-group > .field.flex {
  align-items: center;
  padding: 5px 20px 5px;
}

div.field-group > .field.editor-container {
  padding: 10px 20px;
}

div.field-group > .field.links-area,
div.field-group > .field.files-area {
  padding: 7px 20px 0px;
}

.bet-list-field .bet-list-info {
  width: 520px;
  height: 25px;
  background-color: #f2f2f2;
  color: #888888;
  font-size: 12px;
  border: unset;
  padding: 2px 10px 0;
  text-align: left;
}

.bet-list-field .bet-list-info.has-item {
  margin-bottom: 0;
  padding: 4px 10px 0;
  border-radius: 5px;
  color: white;
  background-color: #3eb2c0;
  width: 520px;
  height: 25px;
  margin-right: 10px;
}

.bet-list-field .btn.bet-list-change {
  background-color: #aaaaaa;
  color: white;
  width: 80px;
  height: 25px;
  padding: 4px;
  font-size: 12px;
}

.field .custom-control.custom-checkbox {
  min-height: unset;
  margin-left: 10px;
}

.field input,
.files-area p.file-input {
  width: 520px;
  font-size: 12px;
  color: #444444;
  border: 1px solid #d9d9d9;
  border-radius: 5px;
  height: 25px;
  padding: 1px 8px;
  transition: all 0.3s;
  font-family: 'NanumBarunGothic', sans-serif;
}

.files-area p.info {
  padding: 0;
  margin: 10px 0 8px;
}

.files-area p.file-input {
  padding: 4px 8px 0;
  color: #cccccc;
  margin-bottom: 0;
}

.files-area p.file-input.disabled {
  background-color: rgba(239, 239, 239, 0.3);
}

.field input:focus {
  outline: unset;
  box-shadow: 0 0 0 2px #d9d9d999;
}

.link-list,
.file-list {
  margin: 5px 0;
  padding: 0 2px;
}

.link-list .link-item,
.file-list .file-item {
  height: 30px;
  align-items: center;
  font-weight: 700;
  color: #444444;
}

.link-list .link-item > p,
.file-list .file-item > p {
  max-width: 420px;
  margin-right: 30px;
  margin-bottom: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.btn.link-add,
.btn.file-add,
.btn.delete {
  font-size: 12px;
  border-radius: 5px;
  width: 80px;
  height: 25px;
  padding: 4px 0;
}

.btn.link-add,
.btn.file-add {
  margin-left: 10px;
}

.btn.link-add,
.btn.file-add,
.btn.submit {
  background-color: #3eb2c0;
  border: 1px solid #3eb2c0;
}

.btn.delete,
.btn.cancel {
  background-color: #aaaaaa;
  border: 1px solid #aaaaaa;
}

.button-group {
  text-align: center;
  margin: 20px auto 0;
}

.btn.submit,
.btn.cancel {
  width: 140px;
  height: 35px;
  font-size: 14px;
  color: white;
  font-weight: 700;
}

.button-group .btn {
  margin-right: 10px;
}

.button-group .btn:last-child {
  margin-right: unset;
}
</style>
