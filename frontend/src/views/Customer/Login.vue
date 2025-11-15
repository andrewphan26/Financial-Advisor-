<template>
  <div class="container login">
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

      <!-- Error feedback -->
      <div class="errors-feedback">
        <div class="error-message" v-if="errorFeedback">{{ errorFeedback }}</div>
      </div>

      <!-- Actions -->
      <div class="actions center">
        <v-btn class="submit btn" @click="onSubmit"> Login </v-btn>
      </div>
    </v-form>
    <div class="register-nav flex center">
      <RouterLink to="/customer-register" class="link-btn mt-3">Register</RouterLink>
    </div>
  </div>
</template>

<style>
.login {
  align-self: center;
  margin: auto;
  transform: translateY(-50px);
  padding: 64px 100px;
}

.form > .v-input {
  width: 360px;
}
</style>

<script>
import { useAuthStore } from '@/stores/auth'
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

      // Errors
      errorFeedback: null,
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
    async login() {
      try {
        const res = await userSrv.login({ email: this.email, password: this.password })

        // If login token received, save it in auth store
        if (res.token) {
          const auth = useAuthStore()
          auth.setToken(res)

          // Redirect to customer dashboard
          this.$router.push('/customer/dashboard')
        }
      } catch (error) {
        this.errorFeedback = error.message
      }
    },
    async onSubmit(vals) {
      this.errorFeedback = null
      const valid = await this.v$.$validate()
      if (valid) {
        this.login()
      }
    },
  },

  created() {},
}
</script>
