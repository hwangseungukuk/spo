<template>
  <div :class="`board gallery ${viewType}`">
    <p :class="`title ${title === null ? 'clear' : ''}`">{{ title }}</p>
    <p class="image">
      <span v-if="itType1 == 1 && title !== null" class="badge recommend"
        >추천</span
      >
      <span v-if="itType2 == 1 && title !== null" class="badge hit">히트</span>
      <span v-if="itType3 == 1 && title !== null" class="badge new">최신</span>
      <b-img :src="`${getImagePath}/data/cmitem/${itImg1}`" alt="" />
      <!-- <b-img src="~assets/images/store/thumbnail-error.png" alt="" /> -->
    </p>
    <dl v-if="viewType === 'list' && showSpoGold" class="spogold">
      <dt><i class="icon-svg spolive-gold"></i><span>스포골드</span></dt>
      <dd>
        <span class="price">{{ Number(itGoldrise).toLocaleString() }}</span
        ><span>지급</span>
      </dd>
    </dl>
    <dl v-if="mTerm" class="spogold">
      <dt>사용기간</dt>
      <dd>
        <span class="price">{{ mTermDate }}</span
        ><span>일</span>
      </dd>
    </dl>
    <dl v-if="viewType === 'list'" class="pmang">
      <dt><i class="icon-svg spolive-coin"></i><span>스포코인</span></dt>
      <dd>{{ Number(itPrice).toLocaleString() }}</dd>
    </dl>
    <a v-if="viewType === 'list'">
      <button class="btn gradient-bg" @click="$emit('click', { id })">
        구매하기
      </button>
    </a>
  </div>
</template>

<script>
import { createNamespacedHelpers } from 'vuex';

export default {
  props: {
    id: { type: String, default: '0' },
    id2: { type: String, default: '0' },
    title: { type: String, default: null },
    itPrice: { type: String, default: '0' },
    itGoldrise: { type: String, default: '0' },
    itType1: { type: String, default: '0' },
    itType2: { type: String, default: '0' },
    itType3: { type: String, default: '0' },
    itImg1: { type: String, default: null },
    showSpoGold: { type: Boolean, default: true },
    viewType: { type: String, default: null },
  },
  data() {
    return {
      mChecked: false,
      mTerm: false,
      mTermData: [],
      mTermDate: null,
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
    if (this.id2 === '2020') {
      this.mTerm = true;
      this.title = this.title.substr(0, this.title.length - 1);
      this.mTermData = this.title.split(' ');
      this.title = '';
      for (let i = 0; i < this.mTermData.length - 1; i++) {
        this.title = this.title + ' ' + this.mTermData[i];
      }
      this.mTermDate = this.mTermData[this.mTermData.length - 1];
    }
  },
};
</script>

<style scoped>
/* 상점 겔러리형 게시판 */
.board.gallery {
  position: relative;
  width: 279px;
  display: inline-block;
  border: 1px solid #d9d9d9;
  border-radius: 10px;
  margin-right: 21px;
  margin-bottom: 20px;
  text-align: center;
  transform: skew(-0.03deg);
  z-index: 1;
  padding-bottom: 18px;
}
.board.gallery.detail {
  height: 300px;
}
.board.gallery p {
  margin: 0px;
  padding: 0px;
}
.board.gallery:nth-child(3n + 3) {
  margin-right: 0px;
}
.board.gallery .title {
  height: 44px;
  line-height: 44px;
  font-size: 14px;
  font-weight: 800;
  color: #3c577e;
  border-bottom: 1px solid #f2f2f2;
  margin-bottom: 20px;
  background-color: #f2f2f2;
  border-radius: 10px 10px 0 0;
}
.board.gallery .title.clear {
  height: 19px;
  margin-bottom: 0px;
  background-color: #fff;
  border-bottom: 0px;
}
.board.gallery .image {
  width: 188px;
  height: 200px;
  margin: 0 auto 20px auto;
}
.board.gallery .image .badge {
  position: absolute;
  top: 0px;
  left: 0px;
  width: 40px;
  padding: 11px 0 !important;
  border-radius: 5px;
  color: #fffb9b;
  font-size: 14px;
  font-weight: 400;
  display: none;
}
.board.gallery .image .badge.recommend {
  background: #3c577e;
  z-index: 1;
  display: block;
}
.board.gallery .image .badge.hit {
  background: #3292c9;
  z-index: 2;
  display: block;
}
.board.gallery .image .badge.new {
  background: #3eb2c0;
  z-index: 3;
  display: block;
}
.board.gallery .image img {
  /* width: 188px; */
  height: 200px;
}
.board.gallery dl {
  display: flex;
  justify-content: space-between;
  margin: 0 19px;
}
dl.spogold {
  height: 32px;
  line-height: 32px;
}
dl.spogold dt {
  display: flex;
  align-items: center;
}
dl.spogold dt i.spolive-gold {
  width: 16px;
  height: 16px;
  background-color: #44b4c2;
  margin: 0 5px 0 10px;
}
dl.spogold dt span {
  font-size: 14px;
  color: #3eb2c0;
}
dl.spogold dd {
  padding-right: 10px;
}
dl.spogold dd span {
  font-size: 14px;
  color: #3eb2c0;
  font-weight: 700;
}
dl.spogold dd span.price {
  font-weight: 800;
  color: #3c577e;
  margin-right: 5px;
}
dl.pmang {
  height: 40px;
  line-height: 40px;
  background: rgb(18, 10, 148);
  background: linear-gradient(90deg, #5da9d6 0%, #70d0c9 100%);
  border-radius: 10px;
}
dl.pmang dt {
  display: flex;
  align-items: center;
}
dl.pmang dt i.spolive-coin {
  width: 16px;
  height: 16px;
  background-color: #fff;
  margin: 0 5px 0 10px;
}
dl.pmang dt span {
  font-size: 14px;
  color: #fff;
}
dl.pmang dd {
  padding-right: 10px;
  font-size: 14px;
  color: #fff;
  font-weight: 700;
}
.board.gallery a {
  position: absolute;
  display: flex;
  justify-content: center;
  align-items: center;
  top: 0px;
  right: 0px;
  bottom: 0px;
  left: 0px;
  border-radius: 10px;
  background-color: rgba(0, 0, 0, 0.5);
  opacity: 0;
  transition: opacity 0.2s;
  z-index: 2;
}
.board.gallery:hover a {
  opacity: 1;
}
.board.gallery button {
  width: 239px;
  height: 50px;
  font-size: 16px;
  font-weight: 600;
  color: #fff;
  border: 0px;
}
</style>
