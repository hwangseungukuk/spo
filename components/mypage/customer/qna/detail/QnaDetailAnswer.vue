<template>
  <div class="answer">
    <div class="header flex">
      <p class="title">
        <span>A</span>
        {{ title }}
      </p>
      <div class="spacer"></div>
      <p v-if="date !== null" class="date">
        {{ $moment(date).format('YYYY-MM-DD HH:mm') }}
      </p>
    </div>
    <div v-if="content !== null" class="content">
      <div v-html="content"></div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    title: { type: String, default: 'title' },
    date: { type: Date, default: null },
    content: { type: String, default: null },
  },
};
</script>

<style scoped>
p {
  margin-bottom: 0;
}

div.answer {
  border-top: 1px solid #e6e6e6;
  border-bottom: 1px solid #e6e6e6;
  background-color: #f2f2f2;
  margin-bottom: 20px;
}

div.answer .header {
  padding: 15px;
}

div.answer .content {
  padding: 10px 25px 10px 40px;
}

p.date {
  padding: 0 10px;
}

.title {
  flex: 1;
  font-size: 14px;
  font-weight: 800;
  color: #444444;
}

.title span {
  color: #df2f5d;
  margin-right: 10px;
}
</style>
