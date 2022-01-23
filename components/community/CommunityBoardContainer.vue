<template>
  <div class="community-board-container">
    <div v-if="controllerType == 'list'" class="board-header flex">
      <b-form-checkbox
        v-if="isAdmin"
        id="checked-all"
        v-model="mChecked"
        type="checkbox"
        name="checked-all"
      ></b-form-checkbox>
      <p class="label number">번호</p>
      <p v-if="controllerPart" class="label part">구분</p>
      <p class="label title">제목</p>
      <p class="label writer">작성자</p>
      <p class="label date">작성일</p>
      <p class="label read">조회수</p>
    </div>
    <div class="community-board list">
      <slot></slot>
    </div>
    <div class="community-board button-group flex">
      <b-btn v-if="isAdmin" @click="$emit('delete')">삭제</b-btn>
      <b-btn v-if="isAdmin" @click="$emit('copy')">복사</b-btn>
      <b-btn v-if="isAdmin" variant="info" class="move" @click="$emit('move')">
        이동
      </b-btn>
      <div v-if="isAdmin" class="spacer"></div>
      <b-btn
        v-if="userWrite"
        :disabled="loading"
        variant="info"
        :class="`write ${isAdmin ? 'admin' : ''}`"
        @click="$emit('write')"
        >글쓰기</b-btn
      >
    </div>
    <div class="community-board pagination-container flex">
      <d-pagination
        v-show="totalItems > 0"
        :num="totalItems"
        :m-page="mPage"
        :list="pageSize"
        :block="10"
        @change="(v) => this.$emit('page', { page: v })"
      ></d-pagination>
    </div>
  </div>
</template>

<script>
import DPagination from '~/components/common/dPagination';

export default {
  components: {
    DPagination,
  },
  props: {
    loading: { type: Boolean, default: false },
    isAdmin: { type: Boolean, default: false },
    userWrite: { type: Boolean, default: true },
    hasCategories: { type: Boolean, default: false },
    page: { type: Number, default: 0 },
    totalItems: { type: Number, default: 0 },
    controllerType: { type: String, default: '' },
    controllerPart: { type: Boolean, default: false },
    pageSize: { type: Number, default: 0 },
  },
  data() {
    return {
      mChecked: false,
      mPage: 1,
      firstLoaded: false,
    };
  },
  watch: {
    loading(nV, oV) {
      if (nV === oV) {
        return;
      }
      if (nV === true) {
        return;
      }
      if (this.firstLoaded) {
        return;
      }
      this.firstLoaded = true;
    },
    mChecked(v) {
      this.$emit('select-all', { checked: this.mChecked });
    },
    page(v) {
      this.mPage = v;
    },
  },
  beforeMount() {
    this.mPage = this.page;
  },
};
</script>

<style scoped>
div.board-header {
  background-color: #f7f7f7;
  align-items: center;
  height: 40px;
}

p.label {
  margin-bottom: 0;
  color: #444444;
  font-weight: 700;
  text-align: center;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

p.label.number,
p.label.read {
  width: 80px;
}

p.label.part {
  width: 100px;
}

p.label.title {
  flex: 1;
}

p.label.writer,
p.label.date {
  width: 125px;
}

div.custom-checkbox {
  text-align: center;
  margin-left: 30px;
}

.community-board.list > .item {
  border-bottom: 1px solid #e5e5e5;
}

.button-group {
  margin-bottom: 20px;
  align-items: center;
  justify-content: center;
  margin-top: 20px;
}

.button-group > *:not(:last-child) {
  margin-right: 5px;
}

.button-group > button {
  width: 95px;
  height: 35px;
  font-size: 14px;
  font-weight: 700;
  border-radius: 10px;
  transition: all 0.3s;
}

.button-group > button.move {
  color: white;
  border: 1px solid #3eb2c0;
  background-color: #3eb2c0;
}

.button-group > button.move:hover {
  color: #3eb2c0;
  background-color: #d8f0f2;
}

.button-group > button.write,
.button-group > button.write.admin {
  width: 150px;
}

.button-group > button.write.admin {
  color: #3eb2c0;
  border: 1px solid #3eb2c0;
  background-color: #d8f0f2;
}

.button-group > button.write.admin:hover {
  color: white;
  border: 1px solid #3eb2c0;
  background-color: #3eb2c0;
}

.button-group > button.write.admin:focus,
.button-group > button.write.admin:active {
  outline: unset;
  border: 1px solid #3eb2c0;
}

.pagination-container {
  padding-bottom: 20px;
  align-items: center;
  justify-content: center;
}

.b-skeleton {
  width: 250px;
  height: 20px;
}

/*셀렉박스 인풋박스 및 버튼 수정으로 추가됨*/
.board-container .button-group {
  margin: 0;
  position: relative;
  top: -50px;
  height: 0;
}
.board-container .button-group > button.write {
  width: 110px;
  line-height: 30px;
  height: 30px;
  padding: 0;
  position: absolute;
  right: 0;
  top: 0;
}
</style>
