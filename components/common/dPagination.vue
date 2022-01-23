<template>
  <div class="pagination">
    <p>
      <b-btn
        :disabled="mPage === 1"
        class="prevNext"
        @click="clickPage(getPrevPage())"
        ><i class="icon-svg board-pagination-prev"></i
      ></b-btn>
      <template v-for="(i, index) in e_page">
        <b-btn
          v-if="i >= s_page"
          :key="`page-${index}`"
          :class="getState(i)"
          @click="clickPage(i)"
          >{{ i }}</b-btn
        >
      </template>
      <b-btn
        class="prevNext"
        :disabled="mPage === pageNum"
        @click="clickPage(getNextPage())"
        ><i class="icon-svg board-pagination-next"></i
      ></b-btn>
    </p>
  </div>
</template>

<script>
export default {
  props: {
    num: { type: Number, default: 0 },
    mPage: { type: Number, default: 1 },
    list: { type: Number, default: 0 },
    block: { type: Number, default: 0 },
  },
  data() {
    return {
      pageNum: 0,
      blockNum: 0,
      nowBlock: 0,
      s_page: 0,
      e_page: 0,
    };
  },
  watch: {
    num() {
      this.calcPage();
    },
    mPage(v) {
      this.calcPage();
    },
  },
  beforeMount() {
    this.calcPage();
  },
  methods: {
    clickPage(v) {
      console.log(v);
      this.$emit('change', v);
    },
    calcPage() {
      this.pageNum = Math.ceil(this.num / this.list);
      this.blockNum = Math.ceil(this.pageNum / this.block);
      this.nowBlock = Math.ceil(this.mPage / this.block);
      this.s_page = this.nowBlock * this.block - (this.block - 1);
      if (this.s_page <= 1) {
        this.s_page = 1;
      }
      this.e_page = this.nowBlock * this.block;
      if (this.pageNum <= this.e_page) {
        this.e_page = this.pageNum;
      }
      if (this.e_page <= 1) {
        this.e_page = 1;
      }
    },
    getState(v) {
      if (v === this.mPage) {
        return 'on';
      } else {
        return '';
      }
    },
    getPrevPage() {
      return this.mPage > 1 ? this.mPage - 1 : 1;
    },
    getNextPage() {
      return this.mPage < this.pageNum ? this.mPage + 1 : this.pageNum;
    },
  },
};
</script>

<style scoped>
.pagination > p {
  text-align: center;
  margin: auto;
}
.pagination button {
  width: 20px;
  height: 20px;
  background: none;
  color: #888;
  font-size: 12px;
  font-weight: 700;
  border: unset;
  padding: 0px;
  margin: 0 5px;
  border-radius: 5px;
}
.pagination button.on {
  color: #3eb2c0;
}
/* .pagination button:hover {
  border: 1px solid #3eb2c0;
} */
.pagination button.prevNext {
  border-radius: 5px;
  background-color: #ccc;
  line-height: 25px;
}
</style>
