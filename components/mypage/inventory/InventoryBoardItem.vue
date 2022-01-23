<template>
  <div :class="`board gallery list`">
    <span v-if="isUsing" class="using">장착 중</span>
    <p class="image">
      <!-- <b-img src="~assets/images/store/thumbnail-error.png" alt="" /> -->
      <b-img :src="`${getImagePath}/data/cmitem/${itImg1}`" alt="" />
    </p>
    <dl class="desc">
      <dt>{{ itName }}</dt>
      <dd>
        <span>{{ ctQty }}{{ unitTxt === '일' ? '일' : '개' }}</span>
      </dd>
    </dl>
    <a v-if="skinIndex">
      <button
        class="btn gradient-bg"
        @click="$emit('click', { skinIndex, isUsing, caId2 })"
      >
        {{ isUsing ? '해제하기' : '장착하기' }}
      </button>
    </a>
    <a v-if="itemUseType">
      <button
        class="btn gradient-bg"
        @click="$emit('click', { itemUseType, itNo, caId, ctQty })"
      >
        사용하기
      </button>
      <button
        v-if="
          caId === '201030' ||
          caId === '201040' ||
          caId === '201050' ||
          caId === '202090'
        "
        class="withdrawal"
        @click="$emit('withdrawal', { itNo, ctQty, caId, itName })"
      >
        <span>구매취소</span>
      </button>
    </a>
  </div>
</template>

<script>
import { createNamespacedHelpers } from 'vuex';

export default {
  props: {
    id: { type: String, default: '0' },
    skinIndex: { type: String, default: '0' },
    itNo: { type: String, default: '0' },
    caId: { type: String, default: '0' },
    caId2: { type: String, default: '0' },
    itName: { type: String, default: null },
    ctQty: { type: String, default: null },
    itImg1: { type: String, default: null },
    unitTxt: { type: String, default: null },
    isUsing: { type: Boolean, default: null },
    itemUseType: { type: String, default: null },
  },
  data() {
    return {
      mChecked: false,
      mTermData: [],
    };
  },
  computed: {
    getImagePath() {
      return process.env.STORE_IMAGE_URL;
    },
  },
  watch: {
    checked(v) {
      this.mChecked = v;
    },
    mChecked(v) {
      this.$emit('checked', { checked: v });
    },
  },
  mounted() {
    if (this.caId2 === '20') {
      const str = this.itName.slice(-1);
      if (str === '일') {
        this.mTreamData = this.itName.split(' ');
        this.itName = '';
        for (let i = 0; i < this.mTreamData.length - 1; i++) {
          this.itName += ' ' + this.mTreamData[i];
        }
        this.itName += ' (' + this.mTreamData[this.mTreamData.length - 1] + ')';
      }
    }
  },
};
</script>

<style scoped>
.board.gallery {
  position: relative;
  width: 279px;
  min-height: 300px;
  display: inline-block;
  border: 1px solid #d9d9d9;
  border-radius: 10px;
  margin-right: 21px;
  margin-bottom: 20px;
  text-align: center;
  transform: skew(-0.03deg);
  z-index: 1;
}
.board.gallery:hover .using {
  opacity: 0;
}
.board.gallery p {
  margin: 0px;
  padding: 0px;
}
.board.gallery:nth-child(3n + 3) {
  margin-right: 0px;
}
.board.gallery .image {
  width: 170px;
  height: 200px;
  margin: 40px auto 40px auto;
  z-index: 2;
}
.board.gallery .image img {
  width: 170px;
  height: 200px;
}
.board.gallery dl {
  display: flex;
  justify-content: space-between;
}
.board.gallery .using {
  position: absolute;
  top: 0px;
  right: 0px;
  bottom: 0px;
  left: 0px;
  border-radius: 10px;
  padding-top: 143px;
  background-color: rgba(0, 0, 0, 0.5);
  transition: opacity 0.2s;
  color: #fff;
  font-size: 18px;
  font-weight: 600;
  z-index: 1;
}
dl.desc {
  border-top: 1px solid #e6e6e6;
  height: 40px;
  line-height: 40px;
  background-color: #f2f2f2;
  border-radius: 0 0 10px 10px;
}
dl.desc dt {
  font-size: 14px;
  font-weight: 600;
  color: #3eb2c0;
  padding-left: 10px;
}
dl.desc dd {
  padding-right: 10px;
}
dl.desc dd span {
  font-size: 14px;
  font-weight: 600;
  color: #3c577e;
}
.board.gallery a {
  position: absolute;
  top: 0px;
  right: 0px;
  bottom: 0px;
  left: 0px;
  border-radius: 10px;
  padding-top: 130px;
  background-color: rgba(0, 0, 0, 0.5);
  opacity: 0;
  transition: opacity 0.2s;
  z-index: 2;
}
.board.gallery:hover a {
  opacity: 1;
}
.board.gallery button {
  width: 240px;
  height: 50px;
  font-size: 16px;
  font-weight: 600;
  color: #fff;
  border: 0px;
}
.withdrawal {
  background-color: transparent;
}
.withdrawal span {
  text-decoration: underline;
  text-underline-position: under;
  font-size: 14px;
}
</style>
