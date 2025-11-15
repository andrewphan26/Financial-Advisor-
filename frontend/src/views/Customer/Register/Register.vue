<template>
  <div class="container register">
    <!-- Success Modal -->
    <Modal ref="successModal" :onAccept="onSuccess">
      <template #body>
        <div class="icon success"><v-icon icon="mdi-check-circle"></v-icon></div>
        <div class="msg">Your account has been created successfully</div>
      </template>
    </Modal>
    <!-- Error Modal -->
    <Modal ref="errorModal">
      <template #body>
        <div class="icon error"><v-icon icon="mdi-alert-circle"></v-icon></div>
        <div class="msg">{{ error }}</div>
      </template>
    </Modal>

    <div class="form-container">
      <PersonalInfo ref="personalForm" :form="personalInfo" v-if="step === 1" />
      <EmploymentInfo ref="employmentForm" :form="employmentInfo" v-if="step === 2" />
    </div>

    <div class="full-w actions flex sb">
      <v-btn class="prev btn common" @click="onPrev" v-if="step >= 1"> Prev </v-btn>
      <v-btn class="next btn common" @click="onNext">
        {{ step > 1 ? 'Finish' : 'Next' }}
      </v-btn>
    </div>
  </div>
</template>

<style>
.register {
  align-self: center;
  margin: auto;
  transform: translateY(-50px);
  padding: 64px 100px;
}

.form-container {
  width: 580px;
  margin-bottom: 16px;
}
.title,
hr {
  font-weight: bold;
  margin-bottom: 12px;
}

.icon.success {
  color: rgb(110, 172, 110);
  font-size: 56px;
}
.icon.error {
  color: #f55a5a;
  font-size: 56px;
}
</style>

<script>
import { useRegister } from '@/stores/register'
import PersonalInfo from './PersonalInfo.vue'
import EmploymentInfo from './EmploymentInfo.vue'
import Modal from '@/components/Modal.vue'
import userSrv from '@/services/user'

export default {
  components: { PersonalInfo, EmploymentInfo, Modal },

  data() {
    return {
      error: null,
      registerStore: useRegister(),
      step: 1,

      personalInfo: {
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        confirmPassword: '',
        address: '',
        phone: '',
      },
      employmentInfo: {
        company: '',
        role: '',
        address: '',
        phone: '',
        email: '',
        monthlySalary: null,
      },
    }
  },

  methods: {
    onSuccess() {
      this.$router.push('/login')
    },
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
    async onNext() {
      let valid = false

      if (this.step === 1) {
        valid = await this.$refs.personalForm.validateForm()
      } else if (this.step === 2) {
        valid = await this.$refs.employmentForm.validateForm()
      }

      if (!valid) return

      if (this.step === 2) {
        this.onSubmit()
      } else {
        this.step++
      }

      // Save form data in store
      this.registerStore.setUserInfo({
        userInfo: {
          personalInfo: this.personalInfo,
          employmentInfo: this.employmentInfo,
        },
      })
    },

    onPrev() {
      if (this.step === 1) this.$router.push('/')
      else this.step--
    },

    async onSubmit() {
      this.error = null
      try {
        if (this.registerStore.hasLoanInProcess) {
          const res = await userSrv.registerNApplyLoan({
            personalInfo: this.personalInfo,
            employmentInfo: this.employmentInfo,
            loan: this.registerStore.loan,
          })
          console.log(res)

          // If success registration
          this.openSuccessModal()

          // Clean store loan & registration info
          this.registerStore.cleanRegister()
        } else {
          const res = await userSrv.registerCustomer({
            personalInfo: this.personalInfo,
            employmentInfo: this.employmentInfo,
          })
          console.log(res)

          // If success registration
          this.openSuccessModal()

          // Clean store loan & registration info
          this.registerStore.cleanRegister()
        }
        this.registerStore.cleanRegister()
      } catch (err) {
        this.error = err
        this.openErrorModal()
      }
    },
  },
}
</script>
