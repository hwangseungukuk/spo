<template>
  <div class="community-board-container">
    <div class="community-board list">
      <slot></slot>
    </div>
    <div class="community-board pagination-container flex">
      <d-pagination
        v-show="totalItems > 0"
        :num="totalItems"
        :m-page="mPage"
        :list="20"
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
    page: { type: Number, default: 0 },
    totalItems: { type: Number, default: 0 },
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

.community-board.list {
  margin-bottom: 20px;
}

.community-board.list > .item {
  border-bottom: 1px solid #e5e5e5;
}

.button-group {
  margin-bottom: 20px;
  align-items: center;
  justify-content: center;
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
  margin-top: 5px;
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
