<template>
  <div class="header">
    <div class="flex">
      <div class="title">
        <span>Q</span>
        <p>{{ title }}</p>
      </div>
      <div class="button-group flex">
        <p :class="`status ${statusCss}`">{{ status }}</p>
        <p class="date">{{ $moment(date).format('YYYY-MM-DD HH:mm') }}</p>
        <b-btn
          v-if="editable"
          size="sm"
          variant="info"
          @click="$emit('edit', { id })"
        >
          <p>수정</p>
        </b-btn>
        <b-btn
          v-if="editable"
          size="sm"
          variant="secondary"
          @click="$emit('delete', { id })"
        >
          <p>삭제</p>
        </b-btn>
      </div>
    </div>
    <div v-if="hasEmail || hasPhone" class="email-phone">
      <p>
        <template v-if="hasEmail">
          <span>이메일</span>
          {{ email }}
        </template>
        <template v-if="hasPhone">
          <span>휴대전화</span>
          {{ phone }}
        </template>
      </p>
    </div>
    <template v-for="(file, index) in files">
      <div :key="`file_${index}_${file}`" class="attachments">
        <a :href="getParsedUrl(file.href)" target="_blank">
          <i class="icon-svg attachment" />
          {{ file.source }}
        </a>
      </div>
    </template>
  </div>
</template>

<script>
export default {
  props: {
    id: { type: Number, default: 0 },
    title: { type: String, default: 'title' },
    status: { type: String, default: 'status' },
    statusCss: { type: String, default: 'wait' },
    editable: { type: Boolean, default: false },
    date: { type: Date, default: () => new Date() },
    email: { type: String, default: null },
    phone: { type: String, default: null },
    files: { type: Array, default: () => [] },
  },
  computed: {
    hasEmail() {
      const { email } = this;
      return email !== undefined && email !== null && email.length > 0;
    },
    hasPhone() {
      const { phone } = this;
      return phone !== undefined && phone !== null && phone.length > 0;
    },
  },
  methods: {
    getParsedUrl(url) {
      return url.replaceAll('&amp;', '&');
    },
  },
};
</script>

<style scoped>
p {
  margin-bottom: 0;
}

.title {
  display: flex;
  flex: 1;
  font-size: 14px;
  font-weight: 800;
  color: #444444;
  font-family: 'NanumBarunGothic', sans-serif;
}
.title p {
  max-width: 460px;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}

.title span {
  color: #195eea;
  margin-right: 10px;
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

div.header > .flex {
  border-top: 1px solid #e6e6e6;
  min-height: 50px;
  padding: 15px;
}

.header .flex .button-group {
  align-items: center;
  justify-content: center;
}

.header .flex .button-group * {
  margin-right: 5px;
  font-weight: 700;
}

.header .flex .button-group *:last-child {
  margin-right: 0;
}

.header .flex .button-group p {
  padding: 0 10px;
}

.header .flex .button-group .date {
  color: #888888;
  border-left: 1px solid #e5e5e5;
}

.header .flex .button-group .btn {
  width: 80px;
  height: 25px;
  padding: 0;
}

.header .flex .button-group .btn p {
  font-size: 12px;
  padding: 0;
}

.email-phone {
  background-color: #f2f2f2;
  font-size: 12px;
  font-weight: 700;
  color: #888888;
  padding: 15px 40px;
  border-top: 1px solid #e6e6e6;
  border-bottom: 1px solid #e6e6e6;
}

.email-phone p > span {
  font-weight: 800;
  color: #444444;
  margin-left: 20px;
  margin-right: 10px;
}

.email-phone p > span:first-child {
  margin-left: 0;
}

.attachments {
  border-bottom: 1px solid #e5e5e5;
  padding: 10px 0;
}

.attachments a {
  display: flex;
  font-weight: bold;
  color: #888;
  align-items: center;
  width: 100%;
  padding: 0 20px;
}

.icon-svg.attachment {
  width: 15px;
  height: 15px;
  margin-right: 20px;
}

.icon-svg.attachment {
  background-color: #888888;
}
</style>
