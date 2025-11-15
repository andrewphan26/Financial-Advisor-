<template>
  <h1 class="title">Personal Information</h1>
  <hr />

  <v-form class="form">
    <v-container>
      <v-row>
        <v-col>
          <v-text-field
            v-model="form.firstName"
            label="First Name"
            :error-messages="v$?.firstName?.$errors.map((e) => e.$message) || []"
            required
          />
        </v-col>
        <v-col>
          <v-text-field
            v-model="form.lastName"
            label="Last Name"
            :error-messages="v$?.lastName?.$errors.map((e) => e.$message) || []"
            required
          />
        </v-col>
      </v-row>
      <v-row>
        <v-col>
          <v-text-field
            v-model="form.address"
            label="Address"
            :error-messages="v$?.address?.$errors.map((e) => e.$message) || []"
            required
          />
        </v-col>
      </v-row>
      <v-row>
        <v-col>
          <v-text-field
            v-model="form.email"
            label="Email"
            :error-messages="v$?.email?.$errors.map((e) => e.$message) || []"
            required
          />
        </v-col>
        <v-col>
          <v-text-field
            v-model="form.phone"
            label="Phone"
            :error-messages="v$?.phone?.$errors.map((e) => e.$message) || []"
            required
          />
        </v-col>
      </v-row>
      <v-row>
        <v-col>
          <v-text-field
            v-model="form.password"
            label="Password"
            :type="passwordVisible ? 'text' : 'password'"
            :append-inner-icon="passwordVisible ? 'mdi-eye-off' : 'mdi-eye'"
            @click:append-inner="passwordVisible = !passwordVisible"
            :error-messages="v$?.password?.$errors.map((e) => e.$message) || []"
            required
          />
        </v-col>
        <v-col>
          <v-text-field
            v-model="form.confirmPassword"
            label="Confirm Password"
            :type="passwordVisible ? 'text' : 'password'"
            :error-messages="v$?.confirmPassword?.$errors.map((e) => e.$message) || []"
            required
          />
        </v-col>
      </v-row>
    </v-container>
  </v-form>
</template>

<script>
import { useVuelidate } from '@vuelidate/core'
import { required, email, helpers } from '@vuelidate/validators'

export default {
  props: ['form'],

  data() {
    return {
      passwordVisible: false,
      v$: null,
    }
  },

  created() {
    const requiredMsg = (msg = 'This field is required') => helpers.withMessage(msg, required)
    const sameAsPassword = (val) => val === this.form.password

    const rules = {
      firstName: { required: requiredMsg() },
      lastName: { required: requiredMsg() },
      email: { required: requiredMsg(), email },
      password: { required: requiredMsg() },
      confirmPassword: {
        required: requiredMsg(),
        sameAsPassword: helpers.withMessage('Passwords must match', sameAsPassword),
      },
      address: {},
      phone: {},
    }

    this.v$ = useVuelidate(rules, this.form)
  },

  methods: {
    async validateForm() {
      if (!this.v$) return false
      const valid = await this.v$.$validate()
      return valid
    },
  },
}
</script>
