<template>
  <b-card no-body class="faq-items">
    <b-card-header header-tag="header" role="tab">
      <b-button v-b-toggle="`accordion-${id}`" class="faq-subject" block>
        <span class="q">Q</span>
        <p class="fm_subject" v-html="fmSubject"></p>
        <p class="fa_subject" v-html="faSubject"></p>
        <span class="arrow"><i></i></span>
      </b-button>
    </b-card-header>
    <b-collapse
      :id="`accordion-${id}`"
      accordion="my-accordion"
      role="tabpanel"
    >
      <b-card-body>
        <b-card-text>
          <span class="a">A</span>
          <p class="fa_content" v-html="faContent"></p>
        </b-card-text>
      </b-card-body>
    </b-collapse>
  </b-card>
</template>

<script>
export default {
  props: {
    id: { type: String, default: '0' },
    faSubject: { type: String, default: null },
    fmSubject: { type: String, default: null },
    faContent: { type: String, default: null },
  },
  data() {
    return {
      mChecked: false,
    };
  },
  watch: {
    checked(v) {
      this.mChecked = v;
    },
    mChecked(v) {
      this.$emit('checked', { checked: v });
    },
  },
};
</script>

<style scoped>
.card {
  border-radius: 0px;
  border: 0px;
  margin-bottom: 2px;
}
.card .card-header {
  padding: 0px;
  border: 0px;
  margin: 0px;
}

.btn.faq-subject {
  outline: unset;
  box-shadow: unset;
}

.btn.faq-subject:active {
  background-color: inherit;
}

.btn-secondary {
  display: flex;
  height: 40px;
  background: #f2f2f2;
  border-radius: 0px;
  padding: 0px;
  border: 0px;
  align-items: center;
}
.btn-secondary .q {
  width: 50px;
  color: #3eb2c0;
  font-size: 16px;
  font-weight: 800;
}

.btn-secondary .fm_subject {
  font-size: 14px;
  font-weight: 800;
  margin-right: 10px;
  color: #3eb2c0;
}

.btn-secondary .fa_subject {
  flex: 1;
  color: #444444;
  font-size: 14px;
  font-weight: 800;
  text-align: left;
  transition: all 0.3s;
}
.btn-secondary:hover .fa_subject {
  color: #3eb2c0;
}

.btn-secondary .fa_subject .sch_word {
  color: #3eb2c0;
}
.btn-secondary .fa_subject >>> p {
  margin-bottom: 0;
}

.btn-secondary .arrow {
  width: 60px;
  display: flex;
  justify-content: center;
  align-items: center;
}
.btn-secondary .arrow i {
  display: inline-flex;
  width: 20px;
  height: 20px;
  background-image: url(data:image/svg+xml;base64,PHN2ZyBpZD0iYnRuX21vcmVf7ZW465SU7LqhIiBkYXRhLW5hbWU9ImJ0biBtb3JlIO2VuOuUlOy6oSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHZpZXdCb3g9IjAgMCAyMCAyMCI+CiAgPGRlZnM+CiAgICA8c3R5bGU+CiAgICAgIC5jbHMtMSB7CiAgICAgICAgZmlsbDogIzNlYjJjMDsKICAgICAgfQoKICAgICAgLmNscy0yIHsKICAgICAgICBmaWxsOiAjZmZmOwogICAgICAgIGZpbGwtcnVsZTogZXZlbm9kZDsKICAgICAgfQogICAgPC9zdHlsZT4KICA8L2RlZnM+CiAgPHJlY3QgaWQ9ImJ4IiBjbGFzcz0iY2xzLTEiIHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCIgcng9IjEwIiByeT0iMTAiLz4KICA8cGF0aCBpZD0iXyIgZGF0YS1uYW1lPSImZ3Q7Jmd0OyIgY2xhc3M9ImNscy0yIiBkPSJNMTE0OC45Nyw2MzguMzQ0bDMuNjItNS4xOTFhMC4zOTEsMC4zOTEsMCwwLDAtLjI5LTAuNjIzaC03LjI0YTAuMzkxLDAuMzkxLDAsMCwwLS4yOS42MjNsMy42Miw1LjE5MUEwLjM0OCwwLjM0OCwwLDAsMCwxMTQ4Ljk3LDYzOC4zNDRaIiB0cmFuc2Zvcm09InRyYW5zbGF0ZSgtMTEzOSAtNjI1KSIvPgo8L3N2Zz4K);
  -webkit-mask-image: unset;
  mask-image: unset;
  background-color: transparent;
  cursor: pointer;
  transition: all 0.3s;
}
.btn-secondary.not-collapsed .arrow i {
  background-image: url(data:image/svg+xml;base64,PHN2ZyBpZD0iYnRuX21vcmVfZmxpcCIgZGF0YS1uYW1lPSJidG4gbW9yZV9mbGlwIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCIgdmlld0JveD0iMCAwIDIwIDIwIj4KICA8ZGVmcz4KICAgIDxzdHlsZT4KICAgICAgLmNscy0xIHsKICAgICAgICBmaWxsOiAjYWFhOwogICAgICB9CgogICAgICAuY2xzLTIgewogICAgICAgIGZpbGw6ICNmZmY7CiAgICAgICAgZmlsbC1ydWxlOiBldmVub2RkOwogICAgICB9CiAgICA8L3N0eWxlPgogIDwvZGVmcz4KICA8cmVjdCBpZD0iYngiIGNsYXNzPSJjbHMtMSIgd2lkdGg9IjIwIiBoZWlnaHQ9IjIwIiByeD0iMTAiIHJ5PSIxMCIvPgogIDxwYXRoIGlkPSJfIiBkYXRhLW5hbWU9IiZndDsmZ3Q7IiBjbGFzcz0iY2xzLTIiIGQ9Ik0xMTg5Ljk3LDUzNy42NTZsMy42Miw1LjE5MWEwLjM5MSwwLjM5MSwwLDAsMS0uMjkuNjIzaC03LjI0YTAuMzkxLDAuMzkxLDAsMCwxLS4yOS0wLjYyM2wzLjYyLTUuMTkxQTAuMzQ4LDAuMzQ4LDAsMCwxLDExODkuOTcsNTM3LjY1NloiIHRyYW5zZm9ybT0idHJhbnNsYXRlKC0xMTgwIC01MzEpIi8+Cjwvc3ZnPgo=);
}
.card-body {
  padding: 0px;
}
.card-body .card-text {
  display: flex;
  padding: 20px 0;
}
.card-body .card-text .a {
  width: 50px;
  color: #3eb2c0;
  font-size: 16px;
  font-weight: 800;
  text-align: center;
}
.card-body .card-text .fa_content {
  flex: 1;
  font-size: 14px;
  font-weight: 600;
  color: #888;
  margin: 0px;
}
</style>
