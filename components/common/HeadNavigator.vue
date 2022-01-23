<template>
  <div class="header">
    <div class="title-container default-ctn gradient-bg flex">
      <i :class="`icon-svg ${icon}`"></i>
      <p class="title">
        {{ title }}
      </p>
      <div class="bubble_area">
        <p class="bubble">
          {{ description }}
        </p>
        <span class="text">{{ description }}</span>
      </div>
    </div>
    <div v-if="items !== null" class="main-tabs">
      <template v-for="(item, index) in items">
        <template v-if="item.construction">
          <a
            :key="`main-tab_nav_${index}_${item.name}`"
            class="main-tab disabled"
          >
            {{ item.label }}
          </a>
        </template>
        <template v-else>
          <nuxt-link
            :key="`main-tab_nav_${index}_${item.name}`"
            tag="a"
            class="main-tab"
            :to="{ name: item.name, params: { ...item.params } }"
            :active="$route.name.includes(item.name)"
            active-class="on"
          >
            {{ item.label }}
          </nuxt-link>
        </template>
      </template>
      <div class="bottom-line"></div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    icon: { type: String, default: '' },
    title: { type: String, default: 'title' },
    description: { type: String, default: 'description' },
    items: {
      type: Array,
      default: () => [],
    },
  },
};
</script>

<style scoped>
div.title-container {
  width: 920px;
  height: 60px;
  padding: 10px 30px;
  align-items: center;
  color: white;
  border-radius: 10px;
}

div.title-container p {
  margin-bottom: 0;
}

i.icon-svg {
  width: 24px;
  height: 24px;
  margin-right: 10px;
  background-size: contain;
}

p.title {
  font-size: 20px;
  font-weight: 800;
  margin-right: 10px;
}

div.bubble_area {
  position: relative;
  margin-left: 20px;
}

div.bubble_area::before {
  content: '';
  position: absolute;
  border-style: solid;
  border-width: 6px 14px 7px 0;
  border-color: transparent rgba(0, 0, 0, 0.3);
  display: block;
  width: 0;
  z-index: 0;
  top: 50%;
  margin-top: -6px;
  left: -14px;
  mix-blend-mode: overlay;
}

p.bubble {
  background-color: rgba(0, 0, 0, 0.3);
  border-radius: 5px;
  height: 35px;
  padding: 10px 15px;
  mix-blend-mode: overlay;
  color: transparent;
}

div.bubble_area span.text {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  padding: 10px 15px;
  color: #fff;
}

div.main-tabs {
  position: relative;
  width: 920px;
  height: 50px;
  background-color: white;
  border-radius: 10px 10px 0 0;
  padding: 0 20px;
}

div.main-tabs a.main-tab {
  display: inline-flex;
  width: 100px;
  height: 50px;
  border-radius: 0;
  margin: 0;
  z-index: 1;
  border: unset;
  border-bottom: 5px solid transparent;
  background-color: unset;
  color: #888888;
  font-weight: 700;
  font-size: 14px;
  align-items: center;
  justify-content: center;
  padding-top: 6px;
}

div.main-tabs a.main-tab:focus {
  outline: unset;
  box-shadow: unset;
  border-bottom: 5px solid #3c577e55;
}

div.main-tabs a.main-tab:hover {
  text-decoration: unset;
  border-bottom: 5px solid #3c577eaa;
  color: #444444aa;
}

div.main-tabs a.main-tab.on {
  text-decoration: unset;
  border-bottom: 5px solid #3c577e;
  font-weight: 800;
  color: #444444;
}

div.main-tabs div.bottom-line {
  position: absolute;
  width: 880px;
  bottom: 0;
  height: 1px;
  background-color: #e6e6e6;
  z-index: 0;
}
</style>
