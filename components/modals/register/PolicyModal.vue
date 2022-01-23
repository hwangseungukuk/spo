<template>
  <div class="modal-container default-ctn">
    <div class="d-flex justify-content-between align-items-center">
      <p class="title">{{ title }} <span class="text-info">(필수)</span></p>
      <button class="btn p-0" @click="$emit('close')">
        <img src="~assets/images/termuse/close_btn.png" alt="" />
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
.modal-container {
  background-color: #f2f2f2;
  padding: 20px;
}

.modal-container p.title {
  font-size: 16px;
  font-weight: 600;
  margin: 0;
}

.modal-container .contents {
  height: 370px;
  overflow: auto;
  margin-top: 20px;
}
</style>
