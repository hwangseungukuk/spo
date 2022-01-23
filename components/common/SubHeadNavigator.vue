<template>
  <div class="sub-tabs">
    <template v-for="(item, index) in items">
      <nuxt-link
        :key="`sub-tab-${index}_${item.name}`"
        tag="button"
        class="sub-tab"
        :to="{ name: item.name, params: { ...item.params } }"
        :active="$route.name.includes(item.name)"
        active-class="on"
      >
        <p>{{ item.label }}</p>
      </nuxt-link>
    </template>
  </div>
</template>

<script>
export default {
  props: {
    items: {
      type: Array,
      default: () => [{ label: 'label', name: 'router-name' }],
    },
  },
};
</script>

<style scoped>
div.sub-tabs {
  width: 100%;
  height: 50px;
  padding: 20px;
  border-radius: 0 0 10px 10px;
  background-color: white;
  display: flex;
  align-items: center;
  border-radius: 0 0 10px 10px;
  margin-bottom: 20px;
  font-size: 14px;
}

div.sub-tabs .sub-tab {
  width: 100px;
  height: 35px;
  border-radius: 10px;
  background-color: transparent;
  border: unset;
  color: #888888;
  transition: all 0.5s;
  font-weight: 700;
}

div.sub-tabs .sub-tab:hover,
div.sub-tabs .sub-tab:focus,
div.sub-tabs .sub-tab:active,
div.sub-tabs .sub-tab.on {
  outline: unset;
}

div.sub-tabs .sub-tab:hover {
  background-color: #ebf7f9cc;
  color: #3eb2c0cc;
}

div.sub-tabs .sub-tab:focus {
  box-shadow: 0 0 0 2px #3eb2c0aa;
}

div.sub-tabs .sub-tab:active {
  box-shadow: 0 0 0 2px #3eb2c055;
}

div.sub-tabs .sub-tab.on {
  box-shadow: unset;
}

div.sub-tabs .sub-tab.on {
  font-weight: 800;
  background-color: #ebf7f9;
  color: #3eb2c0;
}
</style>
