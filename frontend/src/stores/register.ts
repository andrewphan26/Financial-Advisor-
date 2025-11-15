import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

export const useRegister = defineStore('register', () => {
  const loan = ref(null)
  const userInfo = ref(null)

  function setLoan(data: { loan: any }) {
    loan.value = data.loan
  }

  function setUserInfo(data: { userInfo: any }) {
    userInfo.value = data.userInfo
  }

  function cleanRegister() {
    loan.value = null
    userInfo.value = null
  }

  const hasLoanInProcess = computed(() => !!loan.value)
  const registrationInProcess = computed(() => !!userInfo.value)

  return {
    loan,
    userInfo,
    setLoan,
    setUserInfo,
    cleanRegister,
    hasLoanInProcess,
    registrationInProcess,
  }
})
