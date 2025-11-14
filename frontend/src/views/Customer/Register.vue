<template>
  <div class="main-container register">
    <div class="test">
      <h1>Testing backend - Res received:</h1>
      <div class="container">
        <div class="test">Testing</div>
      </div>
    </div>
  </div>
</template>

<style>
@media (min-width: 1024px) {
}
</style>

<script>
import { Form } from '@primevue/forms'
import userSrv from '@/services/user'

export default {
  data() {
    return {
      status: [],
    }
  },

  methods: {
    async init() {
      this.res = await userSrv.register({
        email: 'testUser2@sal.com',
        password: '123456',
        type: 'customer',
        firstName: 'Ricardo',
        lastName: 'Sanchez',
      })
      console.log(res)
    },
  },

  created() {
    this.init()
  },
}
</script>
