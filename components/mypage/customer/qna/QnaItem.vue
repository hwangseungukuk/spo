<template>
  <div class="qna-item flex">
    <p style="width: 60px">{{ number }}</p>
    <p style="width: 100px">{{ category }}</p>
    <div class="title" style="flex: 1">
      <p @click="$emit('click', { id })" v-html="title"></p>
      <i v-if="hasBets" class="icon-svg bet"></i>
      <i v-if="hasAttachments" class="icon-svg attachment"></i>
    </div>
    <p :class="`status ${getStatus(status).css}`" style="width: 140px">
      {{ getStatus(status).label }}
    </p>
    <p style="width: 135px">{{ $moment(date).format('YYYY-MM-DD') }}</p>
  </div>
</template>

<script>
import { createNamespacedHelpers } from 'vuex';

const { mapGetters: qaStatusGetters } = createNamespacedHelpers(
  'mypage/customer/type'
);

export default {
  props: {
    id: { type: Number, default: 0 },
    number: { type: Number, default: 0 },
    category: { type: String, default: 'category' },
    title: { type: String, default: 'title' },
    status: { type: Number, default: 0 },
    date: { type: Date, default: () => new Date() },
    hasBets: { type: Boolean, default: false },
    hasAttachments: { type: Boolean, default: false },
  },
  computed: {
    ...qaStatusGetters(['getStatus']),
  },
};
</script>

<style scoped>
.qna-item {
  color: #444444;
  align-items: center;
  justify-content: center;
  text-align: center;
  height: 40px;
  border-bottom: 1px solid #e5e5e5;
}

.qna-item p {
  margin-bottom: 0;
}

.qna-item div.title {
  text-align: left;
  height: 20px;
}

.qna-item div.title p {
  display: inline-block;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  text-align: left;
  padding-left: 15px;
  max-width: 390px;
  font-family: 'NanumBarunGothic', sans-serif;
}

.qna-item div.title p:hover {
  font-weight: 700;
  cursor: pointer;
}

.status.wait {
  color: #195eea;
}
.status.progressing {
  color: #999999;
}
.status.completed {
  color: #df2f5d;
}

.icon-svg.bet {
  width: 30px;
  height: 20px;
  margin-left: 5px;
  background-color: transparent;
  background-repeat: no-repeat;
  background-size: contain;
}

.icon-svg.attachment {
  background-color: #3eb2c0;
  width: 18px;
  height: 18px;
}
</style>
