<template>
  <div class="messages-container">
    <div class="header">
      <nuxt-link tag="h6" class="title" :to="{ name: 'messages' }"
        >쪽지
        {{
          $route.name === 'messages-write' || $route.name === 'messages-random'
            ? '쓰기'
            : '보관함'
        }}</nuxt-link
      >
      <div class="flex">
        <div
          v-if="
            $route.name === 'messages-write' ||
            $route.name === 'messages-random'
          "
          class="button-group inline-flex"
        >
          <template>
            <nuxt-link
              class="btn write"
              :to="{ name: 'messages-write' }"
              :active="$route.name"
              active-class="on"
            >
              <p>쪽지 쓰기</p>
            </nuxt-link>
            <nuxt-link
              class="btn random"
              :to="{ name: 'messages-random' }"
              :active="$route.name"
              active-class="on"
            >
              <p>랜덤 쪽지 쓰기</p>
            </nuxt-link>
          </template>
        </div>
        <div v-else class="button-group inline-flex">
          <template v-for="(menu, index) in menus">
            <nuxt-link
              :key="`message_menu_${index}_${menu.name}`"
              tag="a"
              class="btn"
              :to="{
                name: menu.name,
                params: { ...menu.params },
              }"
              :active="$route.name.includes(menu.name)"
              active-class="on"
            >
              {{ menu.label }}
            </nuxt-link>
          </template>
        </div>
        <div class="spacer"></div>
        <nuxt-link
          v-if="
            $route.name !== 'messages-write' &&
            $route.name !== 'messages-random'
          "
          class="btn write on"
          :to="{ name: 'messages-write' }"
        >
          <p>쪽지 쓰기</p>
        </nuxt-link>

        <b-btn
          v-if="$route.name === 'messages-random'"
          class="message-item-buy gradient-bg"
          @click="itemBuy"
        >
          <i class="icon-svg messages"></i>
          쪽지 아이템 구매</b-btn
        >
      </div>
    </div>
    <nuxt-child></nuxt-child>
  </div>
</template>

<script>
import { mapState } from 'vuex';

export default {
  layout: 'popup',
  asyncData({ store, route, redirect }) {
    if (route.name.includes('messages') && route.name !== 'messages') {
      return;
    }
    const firstMenu = store.state.user.messages.menu.menus[0];
    redirect({
      name: firstMenu.name,
      params: { ...firstMenu.params },
    });
  },
  computed: {
    ...mapState('user/messages/menu', ['menus']),
  },
  watch: {
    $route(route) {
      if (route.name.includes('messages') && route.name !== 'messages') {
        return;
      }
      this.$router.push({
        name: this.menus[0].name,
        params: { ...this.menus[0].params },
      });
    },
  },
  methods: {
    itemBuy() {
      window.opener.document.location.href = '/store/20/2010';
      self.close();
    },
  },
};
</script>

<style scoped>
.messages-container {
  padding: 20px;
  background-color: white;
  min-width: 600px;
  height: 650px;
  max-height: 650px;
}

.title {
  color: #444444;
  font-weight: 800;
  font-size: 16px;
  margin-bottom: 25px;
  cursor: pointer;
}

.btn > p {
  margin-bottom: 0;
}

.btn {
  font-size: 14px;
  border-radius: 10px;
  font-weight: 700;
  height: 35px;
}

.btn.write {
  width: 100px;
  color: #999;
  background: #f2f2f2;
}

.btn.random {
  width: 120px;
  color: #999;
  background: #f2f2f2;
  margin-left: 5px;
}

.btn.on {
  color: #fff;
  background-color: #3eb2c0;
  border: 1px solid #3eb2c0;
}

.button-group {
  background-color: #f2f2f2;
  border-radius: 10px;
  align-items: center;
}

.button-group .btn {
  width: 150px;
  height: 35px;
  border: 1px solid transparent;
  color: #999999;
  background-color: transparent;
}

.button-group .btn:hover {
  color: #3eb2c0cc;
}

.button-group .btn:focus {
  box-shadow: none;
}

.button-group .btn.on {
  border: 1px solid #3eb2c0;
  color: #3eb2c0;
  background-color: #d8f0f2;
}

div.split {
  width: 1px;
  border: 1px solid #e6e6e6;
  height: 25px;
}

div.split:last-child {
  display: none;
}

.btn:focus {
  box-shadow: none;
}
.message-item-buy {
  border: 0px;
  padding: 0 15px;
}
.icon-svg.messages {
  width: 13px;
  height: 15px;
  -webkit-mask-image: url(~assets/icons/account/nav-messages.svg);
  mask-image: url(~assets/icons/account/nav-messages.svg);
  margin-right: 1px;
  vertical-align: middle;
  margin-top: 3px;
  background-color: white;
}
</style>
