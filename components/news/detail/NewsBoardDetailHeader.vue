<template>
  <div class="news-board detail header flex">
    <p class="title">
      <b-skeleton v-if="loading"></b-skeleton>
      <span v-if="category !== null" class="category">
        {{ category }}
      </span>
      {{ loading ? '' : title }}
    </p>
    <p :class="`writer ${isFromAdmin ? 'admin' : ''}`">
      <b-skeleton v-if="loading"></b-skeleton>
      <i v-if="isFromAdmin" class="icon-svg admin"></i>
      {{ writer }}
    </p>
    <p class="date">
      <b-skeleton v-if="loading"></b-skeleton>
      {{ loading ? '' : $moment(date).format('YYYY.MM.DD') }}
    </p>
    <p class="hit">
      <b-skeleton v-if="loading"></b-skeleton>
      {{ loading ? '' : '조회수 : ' + hit }}
    </p>
  </div>
</template>

<script>
export default {
  props: {
    loading: { type: Boolean, default: false },
    category: { type: String, default: null },
    title: { type: String, default: 'title' },
    writer: { type: String, default: 'writer' },
    isFromAdmin: { type: Boolean, default: false },
    date: { type: Date, default: () => new Date() },
    hit: { type: String, default: 'hit' },
  },
};
</script>

<style scoped>
div.detail.header {
  width: 100%;
  height: 40px;
  align-items: center;
  background-color: #f7f7f7;
  color: #444444;
  font-weight: 700;
  padding: 10px 20px;
  margin-bottom: 20px;
}

p {
  margin-bottom: 0;
}

.title {
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  max-width: 680px;
  text-align: left;
}

.title > .category {
  color: #3eb2c0;
  margin-right: 10px;
}

.write,
.date {
  text-align: center;
}

.writer {
  width: 130px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.writer.admin {
  color: #3eb2c0;
}

i.icon-svg.admin {
  width: 14px;
  height: 14px;
  background-color: unset;
  margin-right: 5px;
  margin-bottom: -3px;
}

.date {
  width: 110px;
}

.hit {
  width: 100px;
  text-align: right;
}

.b-skeleton {
  margin: 0 auto;
}

.title > .b-skeleton {
  margin: 0;
  width: 80%;
}

.writer > .b-skeleton {
  width: 100px;
}
.date > .b-skeleton {
  width: 80px;
}
</style>
