<template>
  <div>
    <title-more-comp
      :title="title"
      :router-name="routerName"
      :router-path="routerPath"
    ></title-more-comp>
    <div class="board-container default-ctn">
      <nav class="ct-nav">
        <button
          v-for="(menu, index) in menus"
          :key="`bottom_menu_${menu.path}_${index}`"
          :class="selected.path === menu.path ? 'on' : ''"
          @click="onNewsTabClick(menu)"
        >
          <p>{{ menu.title }}</p>
        </button>
      </nav>
      <div :class="`list ${selected.path}`">
        <slot></slot>
      </div>
    </div>
  </div>
</template>

<script>
import TitleMoreComp from '~/components/home/TitleMoreComp';

export default {
  components: {
    TitleMoreComp,
  },
  props: {
    title: { type: String, default: 'title' },
    routerName: { type: String, default: null },
    menus: { type: Array, default: () => [] },
  },
  data() {
    return {
      selected: null,
      routerPath: null,
    };
  },
  watch: {
    selected(v) {
      this.$emit('change', { path: v.path, pageSize: v.pageSize });
    },
  },
  beforeMount() {
    this.selected = this.menus[0];
    this.routerPath = this.selected.path;
  },
  methods: {
    onNewsTabClick(menu) {
      this.selected = menu;
      this.routerPath = menu.path;
    },
  },
};
</script>

<style scoped>
div.board-container {
  width: 450px;
  height: 220px;
  padding: 20px;
}

nav.ct-nav {
  border-radius: 10px;
  background-color: #f2f2f2;
  display: flex;
  margin-bottom: 20px;
}

nav.ct-nav button {
  flex: 1;
  color: #999999;
  height: 35px;
  background-color: unset;
  border: 1px solid #f2f2f2;
  outline: unset;
  box-shadow: unset;
  border-radius: 10px;
  transition: all 0.3s;
}

nav.ct-nav button.on {
  background-color: #d8f0f2;
  border: 1px solid #3eb2c0;
  color: #3eb2c0;
  font-weight: 800;
  border-radius: 10px;
  transition: all 0.3s;
  position: relative;
  z-index: 1;
}

div.list.spomedia {
  width: 100%;
  display: inline-flex;
}
</style>
