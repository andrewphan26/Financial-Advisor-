<template>
  <div class="container customer-login">
    <v-form class="form">
      <v-text-field
        v-model="email"
        :error-messages="v$.email.$errors.map((e) => e.$message)"
        label="E-mail"
        required
        prepend-inner-icon="mdi-email-outline"
      ></v-text-field>

      <v-text-field
        v-model="password"
        :error-messages="v$.password.$errors.map((e) => e.$message)"
        :append-inner-icon="passwordVisible ? 'mdi-eye-off' : 'mdi-eye'"
        :type="passwordVisible ? 'text' : 'password'"
        placeholder="Enter your password"
        prepend-inner-icon="mdi-lock-outline"
        required
        @click:append-inner="passwordVisible = !passwordVisible"
      ></v-text-field>

      <div class="actions center">
        <v-btn class="submit btn" @click="onSubmit"> submit </v-btn>
      </div>
      <div class="register-nav flex center">
        <RouterLink to="/" class="link-btn mt-3">Register</RouterLink>
      </div>
    </v-form>
  </div>
</template>

<style>
.customer-login {
  align-self: center;
  margin: auto;
  transform: translateY(-50px);
  padding: 64px 150px;
}

.form > .v-input {
  width: 360px;
}
</style>

<script>
import { useVuelidate } from '@vuelidate/core'
import { email, required } from '@vuelidate/validators'

import userSrv from '@/services/user'

export default {
  components: {},

  data() {
    return {
      passwordVisible: false,

      // Form
      email: '',
      password: '',
    }
  },

  validations() {
    return {
      email: { required, email },
      password: { required },
    }
  },

  setup: () => ({ v$: useVuelidate() }),

  methods: {
    async init() {
      // this.res = await userSrv.register({
      //   email: 'testUser2@sal.com',
      //   password: '123456',
      //   type: 'customer',
      //   firstName: 'Ricardo',
      //   lastName: 'Sanchez',
      // })
      // console.log(res)
    },
    async onSubmit(vals) {
      const valid = await this.v$.$validate()
      if (valid) {
        console.log('Submitting info: ', this.email, this, this.password)
      } else {
        console.log('invalid yo', valid)
      }
    },
  },

  created() {
    this.init()
  },
}
</script>
