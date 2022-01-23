<template>
  <div :class="`board ${controllerType == 'list' ? 'item flex' : 'gallery'}`">
    <b-form-checkbox
      v-if="isAdmin"
      :id="`checked-${id}`"
      v-model="mChecked"
      :name="`checked-${id}`"
      type="checkbox"
    ></b-form-checkbox>
    <p :class="`label number ${isNotice ? 'notice' : ''}`">
      {{ isNotice ? '공지' : id }}
    </p>
    <p v-if="controllerPart" class="label part">
      <span>
        <i :class="`icon-svg ${getSportByKrText(category).value}`"></i>
        {{ `${category === null ? '기타' : category}` }}
      </span>
    </p>
    <p
      v-if="controllerType == 'gallery'"
      class="image"
      @click="$emit('click', { id })"
    >
      <img
        v-if="thumb !== null"
        :src="thumb !== null ? thumb.src : null"
        alt=""
      />
      <!-- <img v-else src="~assets/images/board/spomedia-empty.png" alt="" /> -->
    </p>
    <div class="label title flex" @click="$emit('click', { id })">
      <i
        v-if="isReply"
        class="icon-svg reply"
        :style="`${getReplyDepth()}`"
      ></i>
      <p v-html="title"></p>
      <i v-if="hasBets" class="icon-svg bet"></i>
      <i v-if="hasAttachments" class="icon-svg attachment"></i>
      <span v-if="comments > 0" class="comment-cnt">[{{ comments }}]</span>
    </div>
    <p :class="`label writer ${isWriterAdmin ? 'admin' : ''}`">
      <i v-if="isWriterAdmin" class="icon-svg admin"></i>
      {{ writer }}
    </p>
    <p class="label date">
      {{ $moment(date).format('YYYY.MM.DD') }}
    </p>
    <p class="label read">
      {{ read.toLocaleString() }}
    </p>
  </div>
</template>

<script>
export default {
  props: {
    isAdmin: { type: Boolean, default: false },
    isWriterAdmin: { type: Boolean, default: false },
    id: { type: Number, default: 0 },
    isNotice: { type: Boolean, default: false },
    category: { type: String, default: null },
    title: { type: String, default: 'title' },
    writer: { type: String, default: 'writer' },
    date: { type: Date, default: () => new Date() },
    read: { type: Number, default: 0 },
    hasAttachments: { type: Boolean, default: false },
    checked: { type: Boolean, default: false },
    index: { type: Number, default: 0 },
    hasBets: { type: Boolean, default: false },
    comments: { type: Number, default: 0 },
    controllerType: { type: String, default: '' },
    controllerPart: { type: Boolean, default: false },
    thumb: { type: [Object, Boolean], default: null },
    isReply: { type: Boolean, default: false },
    replyPosition: { type: Number, default: 0 },
  },
  data() {
    return {
      mChecked: false,
    };
  },
  watch: {
    checked(v) {
      this.mChecked = v;
    },
    mChecked(v) {
      this.$emit('checked', { checked: v });
    },
  },
  methods: {
    getReplyDepth() {
      const { replyPosition } = this;
      if (replyPosition <= 0) {
        return '';
      }
      let calcWidth = replyPosition - 1;
      if (calcWidth > 9) {
        calcWidth = 9;
      }
      return `margin-left: ${calcWidth * 10}px`;
    },
  },
};
</script>

<style scoped>
div.board.item {
  height: 40px;
  align-items: center;
}

.label,
div.label > p {
  margin-bottom: 0;
  color: #888888;
  text-align: center;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

p.label.number,
p.label.part,
p.label.read {
  width: 80px;
}

p.label.part {
  width: 100px;
}

p.label.notice {
  color: #3eb2c0;
  font-weight: 800;
}

.label.title {
  flex: 1;
  text-align: left;
  padding: 0 5px;
  font-family: 'NanumBarunGothic', sans-serif;
}

.label.title span {
  margin-left: 5px;
}

div.board.item:hover .label.title {
  cursor: pointer;
  font-weight: 700;
}

.label.title p {
  max-width: 300px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.icon-svg.reply {
  width: 15px;
  height: 15px;
  background-color: #888888;
  margin-right: 5px;
}

p.label.writer,
p.label.date {
  width: 125px;
}

p.label.writer.admin {
  color: #3eb2c0;
}

div.custom-checkbox {
  text-align: center;
  margin-left: 30px;
}

i.icon-svg.attachment {
  width: 18px;
  height: 18px;
  background-color: #3eb2c0;
}

i.icon-svg.bet {
  width: 30px;
  height: 20px;
  margin-left: 5px;
  background-color: transparent;
}

.part {
  height: 20px;
  line-height: 20px;
}
.part span {
  display: inline-flex;
  color: #3eb2c0;
  height: 20px;
  line-height: 20px;
}

.part span i.icon-svg {
  width: 20px;
  height: 20px;
  background-color: #3eb2c0;
  margin-right: 10px;
}

i.icon-svg.etc {
  position: relative;
  width: 20px;
  height: 20px;
  margin-right: 10px;
  background-color: transparent;
  color: #3eb2c0;
  -webkit-mask-image: unset;
  mask-image: unset;
  /* border: 1px solid red; */
}

i.icon-svg.etc::after {
  position: absolute;
  top: 0px;
  left: 2px;
  font-size: 30px;
  content: '-';
}

span.comment-cnt {
  color: #000;
}

i.icon-svg.admin {
  width: 14px;
  height: 14px;
  background-color: unset;
  margin-right: 5px;
  margin-bottom: -3px;
}

/* 스포미디어 겔러리형 게시판 */
.board.gallery {
  width: 280px;
  display: inline-block;
  border-bottom: 1px solid #e5e5e5;
  margin-right: 20px;
  padding: 0 0 20px;
  text-align: left;
  color: #444;
  margin-top: 20px;
}
.board.gallery:nth-child(3n + 3) {
  margin-right: 0px;
}
.board.gallery:nth-child(1),
.board.gallery:nth-child(2),
.board.gallery:nth-child(3) {
  margin-top: 0px;
}
.board.gallery .label.number {
  display: none;
}
.board.gallery .label.title {
  padding: 0px;
  font-size: 14px;
  font-weight: 600;
  margin-bottom: 5px;
  cursor: pointer;
}
.board.gallery .label.writer,
.board.gallery .label.date,
.board.gallery .label.read {
  display: inline-block;
  width: auto;
  margin-right: 10px;
}
.board.gallery .label.date::before,
.board.gallery .label.read::before {
  content: '|';
  margin-right: 10px;
}
.board.gallery .custom-checkbox {
  text-align: left;
}
.board.gallery .image {
  border-radius: 10px;
  overflow: hidden;
  height: 157px;
  display: flex;
}
.board.gallery .image img {
  width: 100% !important;
  cursor: pointer;
  align-self: center;
}
</style>
