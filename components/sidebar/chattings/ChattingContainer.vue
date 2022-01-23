<template>
  <div class="chat-container">
    <div class="header">
      <p class="title">SPOLIVE chat</p>
      <div class="option-container">
        <switch-comp
          :checked="pNotifyEnterUser"
          label="입장 알림"
          @change="(v) => $emit('notify', v)"
        ></switch-comp>
        <switch-comp
          :checked="pScrollLock"
          label="스크롤 고정"
          @change="(v) => $emit('scroll', v)"
        ></switch-comp>
      </div>
    </div>
    <div class="chat-content">
      <div class="chat-list">
        <slot></slot>
      </div>
      <form
        class="chat-input-group flex"
        autocomplete="off"
        @submit.prevent="
          $emit('chat', {
            message,
            callback: () => {
              message = '';
            },
          })
        "
      >
        <input
          id="chat-message"
          v-model="message"
          autocomplete="off"
          type="text"
          name="chat-message"
          :placeholder="
            isLoggedIn ? '채팅을 입력해 주세요.' : '로그인이 필요합니다.'
          "
          :disabled="!isLoggedIn"
        />
        <button :disabled="!isLoggedIn" type="submit">
          <i class="icon-svg send"></i>
        </button>
      </form>
      <button class="share-betting-list" @click="$emit('share')">
        <p>베팅 리스트 공유하기</p>
      </button>
    </div>
  </div>
</template>

<script>
import SwitchComp from '~/components/common/SwitchComp';

export default {
  components: {
    SwitchComp,
  },
  props: {
    isLoggedIn: { type: Boolean, default: false },
    pNotifyEnterUser: { type: Boolean, default: false },
    pScrollLock: { type: Boolean, default: false },
  },
  data() {
    return {
      showOption: false,
      first: true,
      message: '',
    };
  },
  watch: {
    showOption(newVal, oldVal) {
      if (!this.first) {
        return;
      }
      if (newVal !== oldVal) {
        this.first = false;
      }
    },
  },
};
</script>

<style scoped>
div.chat-container {
  width: 350px;
  margin-bottom: 15px;
}

div.chat-container .switch-group {
  margin-right: 5px;
}

div.chat-container .switch-group:last-child {
  margin-right: 0;
}

div.header {
  margin-bottom: 10px;
  position: relative;
  height: 24px;
}

div.header > p.title {
  font-size: 18px;
  font-weight: 800;
  margin-bottom: 0;
  bottom: 0;
  left: 0;
}

div.switches.first {
  visibility: hidden;
  animation: unset;
}

div.option-container {
  display: flex;
  position: absolute;
  right: 0;
  bottom: 0px;
}

div.chat-content {
  position: relative;
  width: 100%;
  height: 480px;
  background-color: white;
  border-radius: 10px;
  padding: 18px 20px;
}

div.chat-list {
  overflow-y: scroll;
  height: 330px;
  margin-bottom: 10px;
}

.chat-input-group {
  background: #f2f2f2 0% 0% no-repeat padding-box;
  border: 1px solid #e5e5e5;
  border-radius: 10px;
  margin-bottom: 10px;
  padding: 10px 20px;
}

.chat-input-group input {
  font-size: 12px;
  background-color: transparent;
  border: unset;
  color: #444444;
  width: 298px;
  margin-right: 5px;
  font-family: 'NanumBarunGothic', sans-serif;
}

.chat-input-group input::placeholder {
  color: #999999;
}

.chat-input-group input:focus {
  outline: unset;
  box-shadow: unset;
}

.chat-input-group button {
  padding: 0;
  border: unset;
  outline: unset;
  box-shadow: unset;
  transition: all 0.5s;
  height: 15px;
  width: 15px;
}

.chat-input-group button:focus,
.chat-input-group button:active {
  outline: unset;
  box-shadow: unset;
}

.chat-input-group i.icon-svg.send {
  background-color: #3eb2c0;
  height: 15px;
  width: 15px;
  margin-bottom: -5px;
}

button.share-betting-list {
  width: 100%;
  height: 40px;
  background-color: #3eb2c033;
  border: 1px solid #3eb2c0;
  color: #3eb2c0;
  font-size: 14px;
  border-radius: 10px;
  transition: all 0.5s;
}

button.share-betting-list:hover {
  background-color: #3eb2c0aa;
  color: white;
  transition: all 0.5s;
}

button.share-betting-list:focus {
  outline: unset;
  box-shadow: unset;
}

button.share-betting-list:active {
  outline: unset;
  box-shadow: unset;
  background-color: #3eb2c0ff;
  color: white;
  transition: all 0.5s;
}
</style>
