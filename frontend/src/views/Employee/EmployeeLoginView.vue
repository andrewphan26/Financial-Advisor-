<template>
  <div class="container login">
    <v-form class="form">
      
      <!-- Email -->
      <v-text-field
        v-model="email"
        :error-messages="v$.email.$errors.map((e) => e.$message)"
        label="E-mail"
        required
        prepend-inner-icon="mdi-email-outline"
      ></v-text-field>

      <!-- Password -->
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

      <!-- Errors -->
      <div class="errors-feedback">
        <div class="error-message" v-if="errorFeedback">{{ errorFeedback }}</div>
      </div>

      <!-- Submit -->
      <div class="actions center">
        <v-btn class="submit btn" @click="onSubmit"> Login </v-btn>
      </div>

    </v-form>

    <!-- Navigation -->
    <div class="register-nav flex center">
      <RouterLink to="/login" class="link-btn mt-3">Back to Customer Login</RouterLink>
    </div>
  </div>
</template>

<style>
.login {
  align-self: center;
  margin: auto;
  transform: translateY(-50px);
  padding: 64px 100px; /* SAME EXACT SIZE */
}

.form > .v-input {
  width: 360px; /* SAME WIDTH */
}

.error-message {
  color: #ff6b6b;
  margin-top: 10px;
}

.register-nav .link-btn {
  color: #7bb2ff;
  text-decoration: underline;
  cursor: pointer;
}
</style>

<script>
import { useVuelidate } from '@vuelidate/core'
import { required, email } from '@vuelidate/validators'

export default {
  
  created() {
    localStorage.removeItem("token")
    localStorage.removeItem("customer_token")
    localStorage.removeItem("employee_token")
    localStorage.removeItem("admin_token")
    localStorage.removeItem("employee_id")
    localStorage.removeItem("employee_name")
    localStorage.removeItem("employee_role")
  },

  data() {
    return {
      email: '',
      password: '',
      passwordVisible: false,
      errorFeedback: null,
    }
  },

  validations() {
    return {
      email: { required, email },
      password: { required },
    }
  },

  setup: () => ({
    v$: useVuelidate(),
  }),

  methods: {
    async employeeLogin() {
      this.errorFeedback = null

      try {
        const res = await fetch("http://localhost:3000/employee/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: this.email,
            password: this.password
          })
        })

        const data = await res.json()

        if (!res.ok) {
          this.errorFeedback = data.message || "Login failed"
          return
        }

        localStorage.setItem("employee_id", data.id)
        localStorage.setItem("employee_name", data.first_name)
        
        if (data.role === "admin") {
          localStorage.setItem("admin_token", data.token)
          localStorage.setItem("employee_role", "admin")
        } else {
          localStorage.setItem("employee_token", data.token)
          localStorage.setItem("employee_role", "analyst")
        }


        this.$router.push("/employee/dashboard")

      } catch (err) {
        this.errorFeedback = "Server error"
      }
    },

    async onSubmit() {
      this.errorFeedback = null
      const valid = await this.v$.$validate()
      if (valid) {
        this.employeeLogin()
      }
    },
  },
}
</script>

