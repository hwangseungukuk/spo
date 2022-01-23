<template>
  <div class="messages-board-container">
    <div class="board-header flex">
      <b-form-checkbox
        id="checked-all"
        v-model="mChecked"
        type="checkbox"
        name="checked-all"
        @change="allSelect"
      ></b-form-checkbox>
      <p class="label writer">{{ path == 'recv' ? '보낸' : '받는' }} 사람</p>
      <p class="label title">내용</p>
      <p class="label date">{{ path == 'recv' ? '받은' : '보낸' }} 시간</p>
    </div>
    <div class="messages-board list">
      <slot name="messages"></slot>
    </div>
    <div class="messages-board pagination-container flex">
      <slot name="pagination"></slot>
    </div>
    <div class="msg-footer flex">
      <b-btn v-if="itemIds.length > 0" class="delete" @click="selectDelete">
        <span>선택 삭제</span>
      </b-btn>
      <b-btn v-if="itemIds.length == 0" class="delete" @click="allDelete">
        <span>전체 삭제</span>
      </b-btn>
      <div class="spacer"></div>
      <p>쪽지 보관 일수는 최장 180일입니다.</p>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    itemIds: { type: Array, default: () => [] },
    path: { type: String, default: null },
    itemsLength: { type: Number, default: 0 },
  },
  data() {
    return {
      mChecked: false,
    };
  },
  watch: {
    $route(nRoute, oRoute) {
      this.mChecked = false;
    },
    itemIds(v) {
      if (v.length > 0 && v.length === this.itemsLength) {
        this.mChecked = true;
      } else {
        this.mChecked = false;
      }
    },
    // mChecked(v) {
    //   this.$emit('select-all', { checked: this.mChecked });
    // },
  },
  beforeMount() {
    this.mPage = this.page;
  },
  methods: {
    selectDelete() {
      if (this.itemIds.length > 0) {
        this.$emit('select-delete');
      } else {
        // console.log('비활성');
      }
    },
    allDelete() {
      this.$emit('all-delete');
    },
    allSelect(checked) {
      this.mChecked = checked;
      this.$emit('select-all', { checked: this.mChecked });
    },
  },
};
</script>

<style scoped>
div.messages-board-container {
  margin-top: 20px;
}
div.board-header {
  background-color: #f7f7f7;
  border-bottom: 1px solid #3eb2c0;
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
  width: 60px;
  padding-top: 3px;
  padding-left: 30px;
}

.messages-board.list {
  height: 400px;
  margin-bottom: 20px;
}

.messages-board.list > .item {
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

.b-skeleton {
  width: 250px;
  height: 20px;
}

.pagination-container {
  margin: 5px auto;
  justify-content: center;
}

.msg-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.msg-footer button {
  font-size: 12px;
  font-weight: 700;
  color: white;
  background: #aaaaaa;
  border-radius: 5px;
  border: 1px solid #e6e6e6;
  padding: 3px 27px;
}
.msg-footer p {
  color: #3eb2c0;
  font-weight: 700;
  margin: 0;
}
</style>
