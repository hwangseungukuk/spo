<template>
  <div class="login-area flex">
    <nuxt-link
      tag="button"
      class="btn btn-login btn-light gradient-bg"
      :to="{ name: 'login' }"
    >
      Log in
    </nuxt-link>
  </div>
</template>

<script>
export default {};
</script>

<style scoped>
div.login-area {
  width: auto;
  height: 100px;
  margin-bottom: 30px;
  align-items: center;
  justify-content: center;
}

button.btn-login {
  text-transform: uppercase;
  color: white;
  width: 380px;
  height: 50px;
  font-size: 18px;
  font-weight: 800;
  border-radius: 25px;
  border: unset;
}

button.btn-login:hover {
  color: white;
}

button.btn-login:focus,
button.btn-login:active {
  outline: unset;
  box-shadow: unset;
  background-color: initial;
}
</style>
