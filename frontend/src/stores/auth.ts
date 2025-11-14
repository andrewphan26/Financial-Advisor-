import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import router from '@/router'

export const useAuthStore = defineStore('auth', () => {
  const token = ref(localStorage.getItem('token') || null)

  function setToken(data: { token: string | null }) {
    token.value = data.token

    localStorage.setItem('token', data.token || '')
  }

  function logout() {
    token.value = null
    localStorage.removeItem('token')

    router.push('/customer-login')
  }

  const isLoggedIn = computed(() => !!token.value)

  return { token, setToken, logout, isLoggedIn }
})
