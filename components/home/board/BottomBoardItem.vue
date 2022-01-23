<template>
  <div class="item flex">
    <div>
      <b-skeleton v-if="loading" :style="`width: ${getWidth}px`"></b-skeleton>
      <p v-else class="title" @click="$emit('click', { id, path })">
        {{ title }}
        <i v-if="isNew" class="icon-svg board-new"></i>
      </p>
    </div>
    <div class="spacer"></div>
    <div>
      <b-skeleton v-if="loading"></b-skeleton>
      <p v-else>
        {{ $moment(date).format('YY.MM.DD') }}
      </p>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    loading: { type: Boolean, default: false },
    id: { type: Number, default: 0 },
    path: { type: String, default: 'type' },
    title: { type: String, default: 'title' },
    date: { type: Date, default: () => new Date() },
  },
  computed: {
    isNew() {
      const { date } = this;
      const newTerm = this.$moment(date).add(1, 'days');
      return newTerm.toDate().getDate() > new Date().getTime();
    },
    getWidth() {
      return Math.random() * (300 - 120) + 120;
    },
  },
};
</script>

<style scoped>
div.item {
  font-size: 12px;
  font-weight: 400;
  color: #888888;
  margin-bottom: 10px;
}

div.item p {
  margin: 0 10px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  max-width: 320px;
}

div.item:hover p.title {
  cursor: pointer;
  text-decoration: underline;
}

div.item i.icon-svg.board-new {
  width: 8px;
  height: 8px;
  margin-top: 4px;
  background-color: #df2f5d;
}

div.item > div:last-child .b-skeleton {
  width: 70px;
}
</style>
