<template>
  <h1 class="title">Employment Information</h1>
  <hr />

  <v-form class="form">
    <v-container>
      <v-row>
        <v-col>
          <v-text-field
            v-model="form.company"
            label="Company"
            :error-messages="v$?.company?.$errors.map((e) => e.$message) || []"
            required
          />
          <div class="note">If self-employed, type self-employed in this field</div>
        </v-col>
        <v-col>
          <v-text-field
            v-model="form.role"
            label="Role"
            :error-messages="v$?.role?.$errors.map((e) => e.$message) || []"
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
            v-model="form.phone"
            label="Phone"
            :error-messages="v$?.phone?.$errors.map((e) => e.$message) || []"
            required
          />
        </v-col>
        <v-col>
          <v-text-field
            v-model="form.email"
            label="Email"
            :error-messages="v$?.email?.$errors.map((e) => e.$message) || []"
            required
          />
        </v-col>
      </v-row>
      <v-row>
        <v-col>
          <CurrencyField
            required
            label="Monthly Salary"
            v-model="form.monthlySalary"
            :options="{ currency: 'USD', valueRange: { min: 0 } }"
            :error-messages="v$?.monthlySalary?.$errors.map((e) => e.$message) || []"
          />
        </v-col>
      </v-row>
    </v-container>
  </v-form>
</template>

<script>
import CurrencyField from '@/components/CurrencyField.vue'
import { useVuelidate } from '@vuelidate/core'
import { required, email, helpers } from '@vuelidate/validators'

export default {
  props: ['form'],

  components: {
    CurrencyField,
  },

  data() {
    return {
      v$: null,
    }
  },

  created() {
    const requiredMsg = (msg = 'This field is required') => helpers.withMessage(msg, required)

    const rules = {
      company: { required: requiredMsg() },
      role: { required: requiredMsg() },
      email: { required: requiredMsg(), email },
      address: {},
      phone: {},
      monthlySalary: { required: requiredMsg() },
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
