<template>
  <div class="dashboard-item">
    <h1 class="title">Personal Information</h1>
    <hr />

    <!-- Success Modal -->
    <Modal ref="successModal">
      <template #body>
        <div class="icon success"><v-icon icon="mdi-check-circle"></v-icon></div>
        <div class="msg">Your personal information has been updated</div>
      </template>
    </Modal>
    <!-- Error Modal -->
    <Modal ref="errorModal">
      <template #body>
        <div class="icon error"><v-icon icon="mdi-alert-circle"></v-icon></div>
        <div class="msg">{{ error }}</div>
      </template>
    </Modal>

    <v-form class="form">
      <v-container>
        <v-row>
          <v-col>
            <v-text-field
              v-model="form.firstName"
              label="First Name"
              :error-messages="v$?.form.firstName?.$errors.map((e) => e.$message) || []"
              required
            />
          </v-col>
          <v-col>
            <v-text-field
              v-model="form.lastName"
              label="Last Name"
              :error-messages="v$?.form.lastName?.$errors.map((e) => e.$message) || []"
              required
            />
          </v-col>
        </v-row>
        <v-row>
          <v-col>
            <v-text-field
              v-model="form.address"
              label="Address"
              :error-messages="v$?.form.address?.$errors.map((e) => e.$message) || []"
              required
            />
          </v-col>
        </v-row>
        <v-row>
          <v-col>
            <v-text-field
              v-model="form.email"
              label="Email"
              :error-messages="v$?.form.email?.$errors.map((e) => e.$message) || []"
              required
            />
          </v-col>
          <v-col>
            <v-text-field
              v-model="form.phone"
              label="Phone"
              :error-messages="v$?.form.phone?.$errors.map((e) => e.$message) || []"
              required
            />
          </v-col>
        </v-row>
      </v-container>
    </v-form>

    <div class="full-w actions flex sb">
      <v-btn class="prev btn common" @click="onSubmit"> Update </v-btn>
    </div>
  </div>
</template>

<script>
import { useVuelidate } from '@vuelidate/core'
import { required, email, helpers } from '@vuelidate/validators'
import Modal from '@/components/Modal.vue'
import userSrv from '@/services/user.js'

export default {
  data() {
    return {
      form: {},
    }
  },

  components: {
    Modal,
  },

  validations() {
    const requiredMsg = (msg = 'This field is required') => helpers.withMessage(msg, required)
    return {
      form: {
        firstName: { required: requiredMsg() },
        lastName: { required: requiredMsg() },
        email: { required: requiredMsg(), email },
        address: {},
        phone: {},
      },
    }
  },

  setup: () => ({ v$: useVuelidate() }),

  methods: {
    openSuccessModal() {
      if (this.$refs.successModal) {
        this.$refs.successModal.dialog = true
      }
    },
    openErrorModal() {
      if (this.$refs.errorModal) {
        this.$refs.errorModal.dialog = true
      }
    },

    async onSubmit() {
      const valid = await this.v$.$validate()

      if (!valid) return

      this.error = null
      try {
        const res = await userSrv.updatePersonalInfo(this.form)
        console.log(res)

        this.openSuccessModal()
      } catch (err) {
        this.error = err
        this.openErrorModal()
      }
    },

    async init() {
      try {
        this.form = await userSrv.getPersonalInfo()
      } catch (error) {}
    },
  },
  created() {
    this.init()
  },
}
</script>
