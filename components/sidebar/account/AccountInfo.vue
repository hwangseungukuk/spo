<template>
  <div class="account-info">
    <div class="user flex">
      <div class="inline-flex">
        <nuxt-link tag="p" class="username" :to="{ name: 'mypage' }">
          {{ name }}
        </nuxt-link>
        <nuxt-link tag="span" class="my-page-btn" :to="{ name: 'mypage' }">
          MY
        </nuxt-link>
      </div>
      <div class="spacer"></div>
      <div class="button-group flex">
        <button
          class="btn"
          @mouseover="showSafebox = true"
          @mouseleave="showSafebox = false"
          @click="$emit('safebox')"
        >
          <i :class="`icon-svg safebox ${safebox > 0 ? 'has' : ''}`"></i>
        </button>
        <div
          :class="`safebox-tooltip default-ctn flex ${
            optionShowFirst ? 'first' : showSafebox ? 'on' : ''
          }`"
        >
          <p>
            금고 골드
            <span>{{ safebox.toLocaleString() }}</span>
            골드
          </p>
        </div>
        <button class="btn" @click="$emit('open-messages')">
          <i :class="`icon-svg messages ${messages > 0 ? 'has' : ''}`"></i>
        </button>
        <button class="btn" @click="showOptions = !showOptions">
          <i class="icon-svg settings"></i>
        </button>
        <button class="btn" @click="$emit('logout')">
          <i class="icon-svg logout"></i>
        </button>
      </div>
    </div>
    <div class="assets-buttons flex">
      <div class="assets">
        <div class="flex cash">
          <i class="icon-svg pmang-cash"></i>스포코인
          <p>{{ `${coins.toLocaleString()}` }}</p>
        </div>
        <div class="flex gold">
          <i class="icon-svg spolive-gold"></i>스포골드
          <p>{{ `${golds.toLocaleString()}` }}</p>
        </div>
      </div>
      <div class="spacer"></div>
      <div class="flex buttons">
        <button class="btn btn-sm info-btn charge" @click="$emit('charge')">
          <p>충전</p>
        </button>
        <nuxt-link
          tag="button"
          class="btn btn-sm info-btn store"
          :to="{ name: 'store' }"
        >
          <p>상점</p>
        </nuxt-link>
      </div>
    </div>
    <div
      :class="`settings default-ctn flex ${
        optionShowFirst ? 'first' : showOptions ? 'on' : ''
      }`"
    >
      <switch-comp
        label="쪽지 거부하기"
        :checked="denyMessage"
        @change="$emit('message', $event)"
      ></switch-comp>
      <switch-comp
        label="1:1 채팅 거부하기"
        :checked="denyChat"
        @change="$emit('chat', $event)"
      ></switch-comp>
    </div>
    <!-- <div
      :class="`safebox-tooltip default-ctn flex ${
        optionShowFirst ? 'first' : showSafebox ? 'on' : ''
      }`"
    >
      <p>
        금고 골드
        <span>{{ safebox.toLocaleString() }}</span>
        골드
      </p>
    </div> -->
  </div>
</template>

<script>
import SwitchComp from '~/components/common/SwitchComp';

export default {
  components: {
    SwitchComp,
  },
  props: {
    name: { type: String, default: 'UserName' },
    messages: { type: Number, default: 0 },
    golds: { type: Number, default: 0 },
    coins: { type: Number, default: 0 },
    safebox: { type: Number, default: 0 },
    denyMessage: { type: Boolean, default: false },
    denyChat: { type: Boolean, default: false },
  },
  data() {
    return {
      showOptions: false,
      showSafebox: false,
      optionShowFirst: true,
    };
  },
  watch: {
    showSafebox(v) {
      if (!this.optionShowFirst) {
        return;
      }
      if (v) {
        this.optionShowFirst = false;
      }
    },
    showOptions(v) {
      if (!this.optionShowFirst) {
        return;
      }
      if (v) {
        this.optionShowFirst = false;
      }
    },
  },
  mounted() {
    this.$nuxt.$on('over', () => {
      this.showOptions = false;
    });
    document.addEventListener('click', this.onDocumentClick);
  },
  beforeDestroy() {
    this.$nuxt.$off('over');
    document.removeEventListener('click', this.onDocumentClick);
  },
  methods: {
    onDocumentClick(e) {
      if (
        e.target.className !== 'settings default-ctn flex on' &&
        e.target.className !== 'icon-svg settings' &&
        e.target.parentNode.className !== 'switch-group' &&
        e.target.parentNode.className !==
          'custom-control custom-switch b-custom-control-lg'
      ) {
        this.showOptions = false;
      }
    },
  },
};
</script>

<style scoped>
div.account-info {
  width: 350px;
  height: 90px;
  color: white;
  margin-bottom: 40px;
  padding: 10px;
  /* position: relative; */
  background-color: #2d4a74;
  border: 1px solid #21406c;
  border-radius: 10px;
}

.icon-svg:not(.messages, .safebox) {
  background-color: white;
}

.icon-svg.messages,
.icon-svg.safebox {
  background-color: unset;
}

div.account-info > div p {
  display: inline-block;
  margin: 0;
}

div.user {
  margin-bottom: 9px;
  padding: 0;
}

div.user.flex {
  align-items: center;
  justify-content: center;
}

div.user > div:first-child {
  width: 190px;
  line-height: 20px;
  vertical-align: middle;
  justify-content: space-between;
}

div.user p.username {
  width: 120px;
  max-width: 120px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-size: 16px;
  font-weight: 800;
  margin-right: 10px;
  line-height: 18px;
  margin-bottom: 0;
  vertical-align: middle;
}

div.user p.username:hover,
span.my-page-btn:hover {
  cursor: pointer;
}

div.user .msg-settings p:first-child {
  padding-right: 10px;
  border-right: 1px solid rgba(255, 255, 255, 0.2);
}

div.user .msg-settings p:last-child {
  padding-left: 10px;
}

div.user .msg-settings p > i.icon-svg {
  margin-left: 5px;
  margin-bottom: -4px;
}

div.user .msg-settings span.msg-badge {
  margin-bottom: -5px;
}

div.user .button-group {
  position: relative;
}

div.user .button-group .btn {
  cursor: pointer;
  background-color: unset;
  outline: unset;
  border: unset;
  border-radius: unset;
  padding: 0 9px;
  height: 19px;
  border-right: 1px solid #21406c;
}

div.user .button-group .btn:last-child {
  padding-right: 0;
  border-right: none;
}

div.user .button-group .btn:focus,
div.user .button-group .btn:hover,
div.user .button-group .btn:active {
  outline: unset;
  box-shadow: unset;
}

div.user .button-group i.icon-svg {
  width: 16px;
  height: 16px;
  margin-top: 3px;
}

div.user .button-group i.icon-svg.has {
  margin-top: 0;
  width: 19px;
  height: 19px;
}

div.account-info div.assets {
  width: 190px;
  font-size: 12px;
  font-weight: bold;
  /* margin-bottom: 5px; */
  background-color: transparent;
}

div.account-info div.assets .cash {
  color: #9ff3ff;
}

div.account-info div.assets .cash i.icon-svg {
  background-color: #9ff3ff;
}

div.account-info div.assets .gold {
  color: #fffb9b;
}

div.account-info div.assets .gold i.icon-svg {
  background-color: #fffb9b;
}

div.account-info div.assets .safebox {
  color: #ffb981;
}

div.account-info div.assets .safebox i.icon-svg {
  background-color: #ffb981;
}

div.account-info div.assets > .flex {
  margin-bottom: 2px;
}

div.account-info div.assets > .flex:last-child {
  margin-bottom: 0;
}

div.account-info div.assets i.icon-svg {
  width: 16px;
  height: 16px;
  margin-right: 5px;
}

div.account-info div.assets p {
  flex: 1;
  text-align: end;
  text-align: right;
}

span.my-page-btn {
  display: inline-block;
  width: 44px;
  height: 20px;
  font-weight: 700;
  padding-top: 1px;
  text-align: center;
  background-color: #637998;
  border-radius: 5px;
  font-size: 12px;
}

div.flex.buttons {
  width: fit-content;
  height: 38px;
}

div.flex.buttons > * {
  flex: 1;
}

div.flex.buttons .btn {
  font-weight: 700;
  width: 60px;
  color: white;
  border: 1px solid #21406c;
  font-size: 12px;
}

div.flex.buttons .btn:first-child {
  margin-right: 5px;
}

div.flex.buttons .btn.info-btn:focus,
div.flex.buttons .btn.info-btn:active {
  outline: unset;
  box-shadow: unset;
}

div.flex.buttons .btn.info-btn.charge {
  background-color: #22619c;
}

div.flex.buttons .btn.info-btn.store {
  background-color: #228f9c;
}

div.settings.first {
  visibility: hidden;
}

div.settings {
  position: absolute;
  z-index: 100;
  align-items: center;
  justify-content: center;
  padding: 0 10px;
  line-height: 30px;
  animation: fadeOut 0.3s forwards;
}

div.safebox-tooltip {
  position: absolute;
  z-index: 100;
  align-items: center;
  justify-content: center;
  padding: 0 10px;
  line-height: 30px;
  animation: fadeOut 0.3s forwards;
}

div.settings {
  top: -40px;
  height: 35px;
  z-index: 100;
  padding-top: 5px;
  right: 0;
  background-color: #21406c;
}

div.settings::after {
  display: block;
  content: '';
  width: 0;
  height: 0;
  border-style: solid;
  border-width: 10px 7px 0px 7px;
  border-color: #21406c transparent transparent transparent;
  position: absolute;
  right: 48px;
  bottom: -10px;
}

div.safebox-tooltip {
  width: 200px;
  max-width: 200px;
  top: -45px;
  left: -91px;
  background-color: #3eb2c1;
  color: white;
}

div.safebox-tooltip::after {
  display: block;
  content: '';
  width: 0;
  height: 0;
  border-style: solid;
  border-width: 10px 7px 0px 7px;
  border-color: #3eb2c1 transparent transparent transparent;
  position: absolute;
  right: 85px;
  bottom: -10px;
}

div.safebox-tooltip p span {
  margin-right: 3px;
  margin-left: 10px;
  width: 88px;
  display: inline-block;
  text-align: right;
}

div.settings.on,
div.safebox-tooltip.on {
  animation: fadeIn 0.3s forwards;
}

div.settings i.icon-svg.close {
  position: absolute;
  top: 15px;
  right: 15px;
  width: 15px;
  height: 15px;
  background-color: white;
  margin-bottom: 2px;
  opacity: 0.8;
  transition: all 0.5s;
}

div.settings i.icon-svg.close:hover,
div.settings i.icon-svg.close:active {
  cursor: pointer;
  opacity: 1;
  transition: all 0.5s;
}

div.switch-group {
  margin-right: 8px;
}

div.switch-group >>> p {
  color: white;
}

div.assets-buttons {
  align-items: center;
  justify-content: center;
}

@keyframes fadeIn {
  0% {
    visibility: visible;
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
}

@keyframes fadeOut {
  0% {
    opacity: 1;
  }
  99% {
    opacity: 0;
  }
  100% {
    opacity: 0;
    visibility: hidden;
  }
}
</style>
