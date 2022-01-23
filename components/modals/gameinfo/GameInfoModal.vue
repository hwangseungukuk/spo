<template>
  <div class="modal-container default-ctn">
    <div class="header">
      <p class="title">{{ title }}</p>
      <button class="btn p-0" @click="$emit('close')">
        <img src="~assets/images/info/w-close-btn.png" alt="" />
      </button>
    </div>
    <div class="contents bg-white p-3 rounded-lg">
      <p v-html="text"></p>
    </div>
  </div>
</template>

<script>
export const MODAL_OPTIONS = {
  height: 'auto',
  width: 960,
  adaptive: true,
  clickToClose: false,
};

export default {
  props: {
    title: { type: String, default: '' },
    text: { type: String, default: '' },
  },
};
</script>

<style scoped>
.header {
  padding: 20px;
  background-color: #3eb2c0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-top-left-radius: 10px;
  border-top-right-radius: 10px;
}

.modal-container p.title {
  font-size: 16px;
  font-weight: 600;
  margin: 0;
  color: #ffffff;
}

.modal-container .contents {
  height: 370px;
  overflow: auto;
  margin-top: 20px;
}
</style>
