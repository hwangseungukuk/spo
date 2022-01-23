<template>
  <div class="default-ctn">
    <p>
      게임플레이를 위해 개인정보의<br />
      제 3자 정보 제공 동의 및<br />
      서비스 이용약관 동의가 필요합니다.
    </p>
    <a class="btn btn-lg agreement gradient-bg" :href="href">
      <span>제 3자 제공 동의</span>
    </a>
  </div>
</template>

<script>
export default {
  props: {
    href: { type: String, default: null },
  },
};
</script>

<style scoped>
.default-ctn {
  width: 350px;
  height: 285px;
  padding: 65px 50px 70px;
  font-weight: 800;
  font-size: 14px;
  color: #444444;
  margin-bottom: 20px;
}

p {
  text-align: center;
  margin-bottom: 30px;
}

.btn.agreement {
  font-size: 16px;
  width: 250px;
  height: 60px;
  color: white;
  font-weight: 800;
  border: unset;
  box-shadow: unset;
  transition: all 0.3s;
  display: table-cell;
}

.btn.agreement:hover {
  box-shadow: 0 4px 8px -4px rgba(0, 0, 0, 0.4);
}

.btn.agreement:active {
  box-shadow: 0 4px 8px 0px rgba(0, 0, 0, 0.4);
}
</style>
