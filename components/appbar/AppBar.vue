<template>
  <header>
    <div
      :class="`gnb_over ${showNavOver ? 'show' : 'hide'}`"
      @mouseover="onNavOver"
      @mouseleave="onNavOverLeave"
      @click="(e) => e.stopPropagation()"
    >
      <div class="container inline-block">
        <div class="spacer"></div>
        <template v-for="(menu, index) in menus">
          <ul
            :key="`menu-group-${menu.router}_${index}`"
            :style="`width: ${menu.width}px`"
          >
            <template v-if="menu.submenu.length > 0">
              <template v-for="(submenu, sIndex) in menu.submenu">
                <li
                  :key="`sub-menu-${submenu.router}_${sIndex}`"
                  @click="onSubmenuClick(submenu)"
                >
                  <span>{{ submenu.name }}</span>
                </li>
              </template>
            </template>
            <template v-else>
              <li class="no-item"></li>
            </template>
          </ul>
        </template>
      </div>
    </div>
    <b-navbar>
      <div class="container">
        <b-navbar-brand>
          <a @click="onNativeNavLogoClick">
            <img src="~assets/images/spolive-white.png" alt="spolive logo" />
          </a>
        </b-navbar-brand>
        <b-navbar-nav
          class="main-menu flex"
          @mouseover="onNavOver"
          @mouseleave="showNavOver = false"
        >
          <template v-for="(menu, index) in menus">
            <template v-if="menu.construction">
              <li :key="`nav_menu_${index}`" class="nav-item">
                <a class="nav-link" @click="showConsturctionMessage">
                  {{ menu.name }}
                </a>
              </li>
            </template>
            <template v-else>
              <nuxt-link
                :key="`nav_menu_${index}`"
                :to="{ name: menu.router }"
                :active="
                  $route.name ? $route.name.includes(menu.router) : false
                "
                tag="li"
                class="nav-item"
                active-class="on"
              >
                <a class="nav-link">
                  {{ menu.name }}
                </a>
              </nuxt-link>
            </template>
          </template>
        </b-navbar-nav>
        <b-navbar-nav class="s-notices">
          <i class="icon-svg header news"></i>
          <div class="appbar-notice">
            <div class="notice-list">
              <template v-for="(notice, index) in notices">
                <nuxt-link
                  :key="`appbar_notice_${notice.wr_id}_${index}`"
                  tag="a"
                  class="swiper-slide notice-item"
                  :to="{
                    name: 'news-path-id',
                    params: { path: 'notice', id: notice.wr_id },
                  }"
                >
                  {{ notice.wr_subject }}
                </nuxt-link>
              </template>
            </div>
          </div>
        </b-navbar-nav>
      </div>
    </b-navbar>
  </header>
</template>

<script>
import { Swiper } from 'swiper/bundle';
import 'swiper/swiper-bundle.css';

export default {
  props: {
    menus: { type: Array, default: () => [] },
    notices: { type: Array, default: () => [] },
  },
  data() {
    return {
      showNavOver: false,
    };
  },
  mounted() {
    const swiper = new Swiper('.appbar-notice', {
      loop: true,
      direction: 'vertical',
      autoplay: {
        delay: 4700,
        disableOnInteraction: false,
      },
      speed: 300,
      wrapperClass: 'notice-list',
      slideClass: 'notice-item',
    });
  },
  methods: {
    onNativeNavLogoClick() {
      const { $route } = this;
      if ($route.name !== 'index') {
        this.$router.push({ name: 'index' });
      } else {
        window.location.href = '/';
      }
    },
    showConsturctionMessage() {
      this.showSingleButtonModal({
        message: '준비 중입니다.',
      });
    },
    onSubmenuClick(submenu) {
      const { router, params, construction } = submenu;
      // if (construction) {
      //   this.showConsturctionMessage();
      //   return;
      // }
      this.showNavOver = false;
      this.$router.push({ name: router, params: { ...params } });
    },
    onNavOver() {
      this.showNavOver = true;
      this.$nuxt.$emit('over');
    },
    onNavOverLeave() {
      this.showNavOver = false;
    },
  },
};
</script>

<style scoped>
header {
  position: sticky;
  z-index: 99;
  padding: 20px 0;
  height: 80px;
  color: white;
}

nav.navbar {
  padding: 0;
  height: 40px;
}

nav.navbar.navbar-expand .container {
  padding: 0 15px;
}

nav.navbar.navbar-expand .container > *:not(.navbar-nav.flex) {
  flex: auto;
}

div.navbar-brand {
  max-width: 145px;
  width: 145px;
  min-width: 145px;
  height: 25px;
  padding: 0;
  margin-bottom: 5px;
  margin-right: 0;
}

div.navbar-brand:hover {
  cursor: pointer;
}

div.navbar-brand img {
  width: 100%;
}

.navbar-nav.main-menu {
  min-width: 730px;
  width: 730px;
  flex: 1;
  margin-left: 50px;
  margin-right: 15px;
}

.navbar-nav li {
  padding: 10px 0;
  flex: auto;
}

.navbar-nav li.nav-item a.nav-link {
  color: white;
  font-size: 16px;
  font-weight: 800;
  text-align: center;
  padding: 0;
}

.navbar-nav li.nav-item.on a.nav-link,
.navbar-nav li.nav-item a.nav-link:hover {
  color: #fffb9b;
}

.navbar-nav.s-notices {
  max-width: 350px;
}

.icon-svg.header.news {
  margin-top: 2px;
  background-color: #fffb9b;
  width: 20px;
  height: 20px;
}

div.appbar-notice {
  width: 100%;
  min-width: 325px;
  height: 30px;
  overflow: hidden;
  padding: 0;
}

div.notice-list {
  position: relative;
  display: flex;
  height: 30px;
  -webkit-box-orient: vertical;
  -moz-box-orient: vertical;
  box-orient: vertical;
  -webkit-box-orient: normal;
  -moz-box-orient: normal;
  box-direction: normal;
  flex-direction: column;
}

a.notice-item {
  margin-bottom: 0;
  padding: 4px 10px;
  color: white;
}

div.gnb_over {
  position: absolute;
  top: 60px;
  left: 0;
  right: 0;
  min-width: 1320px;
  height: 210px;
  background-color: #3c577ed9;
  transition: all 0.3s;
  overflow: hidden;
}

div.gnb_over .container {
  margin: 0 auto;
  padding-top: 15px;
  width: 100%;
}

div.gnb_over.show {
  transform: translateY(0);
}

div.gnb_over.hide {
  height: 0;
}

div.gnb_over ul {
  padding-left: 0;
  list-style: none;
  text-align: center;
  font-size: 14px;
  color: #c1c7d1;
  display: inline-block;
  vertical-align: top;
}

div.gnb_over ul li {
  padding: 5px 10px 5px;
  margin-bottom: 5px;
  transition: all 0.3s;
  transform: skew(-0.03deg);
  font-weight: 400;
  border-bottom: 1px solid rgba(255, 255, 255, 0);
  display: inline-block;
}

div.gnb_over ul li:hover {
  color: #fffb9b;
  cursor: pointer;
  text-underline-offset: 10px;
  text-decoration-thickness: 2px;
  border-bottom: 1px solid #fffb9b;
}

div.gnb_over ul li.no-item {
  padding: unset;
  border-bottom: unset;
}

div.gnb_over ul li.no-item:hover {
  color: unset;
  cursor: unset;
  border-bottom: unset;
}

div.gnb_over div.spacer:first-child {
  width: 192px;
  display: inline-block;
}
</style>
