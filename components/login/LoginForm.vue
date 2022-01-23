<template>
  <b-form @submit.prevent="$emit('login', { id, password })">
    <b-form-input v-model="id" type="text"></b-form-input>
    <b-form-input v-model="password" type="password"></b-form-input>
    <b-btn type="submit">Login</b-btn>
  </b-form>
</template>

<script>
export default {
  data() {
    return {
      id: '',
      password: '',
    };
  },
};
</script>

<style scoped>
input[type='password'] {
  font-family: sans-serif;
}
</style>
