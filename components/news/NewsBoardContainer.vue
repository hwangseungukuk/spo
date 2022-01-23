<template>
  <div class="news-board-container">
    <div class="board-header flex">
      <b-form-checkbox
        v-if="isAdmin"
        id="checked-all"
        v-model="mChecked"
        type="checkbox"
        name="checked-all"
      ></b-form-checkbox>
      <p class="label number">번호</p>
      <p class="label title">제목</p>
      <p class="label writer">작성자</p>
      <p class="label date">작성일</p>
      <p class="label read">조회수</p>
    </div>
    <div class="news-board list">
      <slot></slot>
    </div>
    <div v-if="isAdmin" class="news-board admin-buttons flex">
      <b-btn @click="$emit('delete')">삭제</b-btn>
      <b-btn @click="$emit('copy')">복사</b-btn>
      <b-btn variant="info" class="move" @click="$emit('move')">이동</b-btn>
      <div class="spacer"></div>
      <b-btn variant="info" class="write" @click="$emit('write')">글쓰기</b-btn>
    </div>
    <div class="news-board pagination-container flex">
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
    page: { type: Number, default: 0 },
    totalItems: { type: Number, default: 0 },
  },
  data() {
    return {
      mChecked: false,
      mPage: 1,
      firstLoaded: false,
      pageSize: 20,
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

.news-board.list {
  margin-bottom: 20px;
}

.news-board.list > .item {
  border-bottom: 1px solid #e5e5e5;
}

.admin-buttons {
  margin-bottom: 20px;
  align-items: center;
  justify-content: center;
}

.admin-buttons > *:not(:last-child) {
  margin-right: 5px;
}

.admin-buttons > button {
  width: 95px;
  height: 35px;
  font-size: 14px;
  font-weight: 700;
  border-radius: 10px;
  transition: all 0.3s;
}

.admin-buttons > button.move {
  color: white;
  border: 1px solid #3eb2c0;
  background-color: #3eb2c0;
}

.admin-buttons > button.move:hover {
  color: #3eb2c0;
  background-color: #d8f0f2;
}

.admin-buttons > button.write {
  width: 150px;
  color: #3eb2c0;
  border: 1px solid #3eb2c0;
  background-color: #d8f0f2;
}

.admin-buttons > button.write:hover {
  color: white;
  border: 1px solid #3eb2c0;
  background-color: #3eb2c0;
}

.admin-buttons > button.write:focus,
.admin-buttons > button.write:active {
  outline: unset;
  border: 1px solid #3eb2c0;
}

.pagination-container {
  margin-top: 5px;
  margin-bottom: 20px;
  align-items: center;
  justify-content: center;
}

.b-skeleton {
  width: 250px;
  height: 20px;
}

ul.pagination >>> .page-item {
  width: 30px;
}

ul.pagination >>> .page-item .page-link {
  font-size: 12px;
  width: 20px;
  height: 20px;
  border: unset;
  background-color: unset;
  color: #888888;
  line-height: 1;
  margin: 0 auto;
  text-align: center;
  border-radius: 5px;
  transition: all 0.3s;
  padding: 4px;
}

ul.pagination >>> .page-item:hover .page-link {
  color: #3eb2c0aa;
  box-shadow: 0 0 0 1px #3eb2c055;
}

ul.pagination >>> .page-item .page-link:focus,
ul.pagination >>> .page-item .page-link:active {
  outline: unset;
  box-shadow: unset;
}

ul.pagination >>> .page-item.active .page-link {
  color: #3eb2c0;
  font-weight: 700;
}

ul.pagination >>> .page-item:first-child .page-link,
ul.pagination >>> .page-item:last-child .page-link {
  width: 20px;
  border: unset;
  border-radius: 5px;
  background-color: #cccccc;
}

i.icon-svg[class*=' board-pagination-'] {
  width: 6px;
  height: 12px;
  background-color: #f2f2f2;
}

ul.pagination >>> .page-item.prev:hover .page-link,
ul.pagination >>> .page-item.next:hover .page-link {
  background-color: #3eb2c0;
}
</style>
