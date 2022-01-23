<template>
  <div class="board item flex">
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
    <div class="label title flex" @click="$emit('click', { id })">
      <p v-html="title"></p>
      <i v-if="isNew" class="icon-svg new"></i>
      <i v-if="hasAttachments" class="icon-svg attachment"></i>
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
    isNew: { type: Boolean, default: false },
    title: { type: String, default: 'title' },
    writer: { type: String, default: 'writer' },
    date: { type: Date, default: () => new Date() },
    read: { type: Number, default: 0 },
    hasAttachments: { type: Boolean, default: false },
    checked: { type: Boolean, default: false },
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
p.label.read {
  width: 80px;
}

p.label.notice {
  color: #3eb2c0;
  font-weight: 800;
}

.label.title {
  flex: 1;
  text-align: left;
  padding: 0 5px;
}

div.board.item:hover .label.title {
  cursor: pointer;
  font-weight: 700;
}

.label.title p {
  max-width: 450px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
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

i.icon-svg.admin {
  width: 14px;
  height: 14px;
  background-color: unset;
  margin-right: 5px;
  margin-bottom: -3px;
}

i.icon-svg.new {
  width: 9px;
  height: 9px;
  background-color: #df2f5d;
  margin: 5px 6px 0;
}
</style>
