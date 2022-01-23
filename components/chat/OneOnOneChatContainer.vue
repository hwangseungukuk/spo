<template>
  <div class="chat-container">
    <div class="header">
      <p class="title">1:1 Chat</p>
    </div>
    <div class="chat-content">
      <div class="chat-list">
        <div
          v-if="$route.query.toid && $route.query.toid !== 'FAIL'"
          class="chat-item"
        >
          <p>{{ $route.query.toid }}님이 입장하셨습니다</p>
        </div>
        <slot></slot>
      </div>
      <form
        class="chat-input-group flex"
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
          type="text"
          name="chat-message"
          :placeholder="
            isLoggedIn ? '채팅을 입력하세요.' : '로그인이 필요합니다.'
          "
          :disabled="!isLoggedIn"
        />
        <button :disabled="!isLoggedIn" type="submit">
          <i class="icon-svg send"></i>
        </button>
      </form>
    </div>
  </div>
</template>

<script>
import SwitchComp from '~/components/common/SwitchComp';

export default {
  props: {
    isLoggedIn: { type: Boolean, default: false },
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
  width: 400px;
  padding: 20px;
  background: #fff;
}

div.header {
  position: relative;
  height: 35px;
  margin-bottom: 7px;
}

div.header > p.title {
  font-size: 18px;
  font-weight: 800;
  margin: 0px;
  padding: 0px;
}

div.switches.first {
  visibility: hidden;
  animation: unset;
}

div.switches {
  animation: drawerClose 0.5s forwards;
}

div.switches.on {
  animation: drawerOpen 0.5s forwards;
}

div.switches > * {
  margin-right: 10px;
}

i.icon-svg.options {
  width: 20px;
  height: 20px;
  margin-bottom: -5px;
  background-color: #888888;
  animation: spinOn 0.5s;
}

i.icon-svg.options:hover {
  cursor: pointer;
}

i.icon-svg.options.on {
  width: 20px;
  height: 20px;
  margin-bottom: -5px;
  background-color: #888888;
  animation: spinOff 0.5s;
}

div.option-container {
  display: flex;
  position: absolute;
  right: 0;
  bottom: -4px;
}

div.chat-content {
  position: relative;
  width: 100%;
  height: 520px;
  border-top: 1px solid #e6e6e6;
  padding: 20px 0;
}

div.chat-list {
  overflow-y: scroll;
  height: 400px;
  margin-bottom: 10px;
}

.chat-input-group {
  background: #d8f0f2 0% 0% no-repeat padding-box;
  border: 1px solid #3eb2c0;
  border-radius: 10px;
  margin-bottom: 10px;
  padding: 10px 20px;
}

.chat-input-group input {
  font-size: 12px;
  background-color: transparent;
  border: unset;
  color: #3eb2c0;
  font-weight: 800;
  width: 298px;
  margin-right: 5px;
  font-family: 'NanumBarunGothic', sans-serif;
}

.chat-input-group input::placeholder {
  color: #3eb2c0;
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
  width: 360px;
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

@keyframes spinOn {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(-180deg);
  }
}
@keyframes spinOff {
  from {
    transform: rotate(-180deg);
  }
  to {
    transform: rotate(0deg);
  }
}

@keyframes drawerClose {
  0% {
    transform: translateX(0);
    opacity: 1;
    visibility: visible;
  }
  99% {
    transform: translateX(20px);
    opacity: 0;
  }
  100% {
    opacity: 0;
    visibility: hidden;
  }
}
@keyframes drawerOpen {
  from {
    transform: translateX(20px);
    opacity: 0;
    visibility: visible;
  }
  to {
    transform: translateX(0);
    opacity: 1;
    visibility: visible;
  }
}
</style>
