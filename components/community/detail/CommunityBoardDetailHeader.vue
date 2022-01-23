<template>
  <div class="community-board">
    <div class="detail header flex">
      <p class="title">
        <b-skeleton v-if="loading"></b-skeleton>
        <span v-if="!loading && controllerPart" class="category">
          <i :class="`icon-svg ${getSportByKrText(category).value}`" />
          {{ `${category === null ? '기타' : category}` }}
        </span>
        {{ loading ? '' : title }}
      </p>
      <div>
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
    </div>
    <div v-if="files.length > 0 || links.length > 0" class="file-wrap">
      <div v-if="files.length > 0" class="detail header_sub">
        <b-skeleton v-if="loading" style="margin: 0 20px"></b-skeleton>
        <template v-for="(file, index) in files">
          <a
            :key="`file_${index}_${file}`"
            :href="getParsedUrl(file.href)"
            target="_blank"
          >
            <i v-show="file.source" class="icon-svg attachment" />
            {{ file.source }}
          </a>
        </template>
      </div>
      <div v-if="links.length > 0" class="detail header_sub">
        <template v-for="(link, index) in links">
          <a :key="`link_${index}_${link}`" :href="link" target="_blank">
            <i class="icon-svg read-link" />
            {{ link }}
          </a>
        </template>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    controllerPart: { type: Boolean, default: false },
    loading: { type: Boolean, default: false },
    category: { type: String, default: null },
    title: { type: String, default: '' },
    writer: { type: String, default: '' },
    hit: { type: String, default: '' },
    links: { type: Array, default: () => [] },
    files: { type: Array, default: () => [] },
    isFromAdmin: { type: Boolean, default: false },
    date: { type: Date, default: () => new Date() },
  },
  methods: {
    getParsedUrl(url) {
      return url.replaceAll('&amp;', '&');
    },
  },
};
</script>

<style scoped>
div.community-board {
  margin-bottom: 20px;
  border-bottom: 1px solid #e5e5e5;
}

div.detail.header {
  width: auto;
  height: 40px;
  align-items: center;
  background-color: #f7f7f7;
  color: #444444;
  font-weight: 700;
  padding: 10px 20px;
  position: relative;
}

.file-wrap {
  padding: 10px 0 10px 20px;
  border-top: 2px solid #e5e5e5;
}

div.detail.header_sub a {
  display: flex;
  font-weight: bold;
  color: #888;
  align-items: center;
  width: 100%;
  padding: 2px 0;
}

.icon-svg.read-link,
.icon-svg.attachment {
  width: 15px;
  height: 15px;
  margin-right: 20px;
}

.icon-svg.attachment {
  background-color: #888888;
}

p {
  margin-bottom: 0;
}

.title {
  line-height: 22px;
  flex: 1;
  text-overflow: ellipsis;
  white-space: nowrap;
  max-width: 500px;
  text-align: left;
  align-items: center;
  overflow: hidden;
  font-family: 'NanumBarunGothic', sans-serif;
}

.title > .category {
  position: relative;
  color: #3eb2c0;
  padding-left: 30px;
  margin-right: 10px;
}
.title > .category i {
  position: absolute;
  top: -4px;
  left: 0px;
  width: 20px;
  height: 20px;
  background-color: #3eb2c0;
}
.title + div {
  position: absolute;
  top: 11px;
  right: 20px;
}
.title + div p {
  display: inline-block;
  vertical-align: middle;
}

.writer {
  width: auto;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  text-align: right;
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
  width: 70px;
  margin: 0 30px;
  text-align: center;
}
.hit {
  width: auto;
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
