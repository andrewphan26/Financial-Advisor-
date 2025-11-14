import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import router from '@/router'

export const useAuthStore = defineStore('auth', () => {
  const token = ref(localStorage.getItem('token') || null)
  const user = ref(JSON.parse(localStorage.getItem('user') || 'null'))

  function setToken(data: { token: string | null; user: any }) {
    token.value = data.token
    user.value = data.user

    localStorage.setItem('token', data.token || '')
    localStorage.setItem('user', JSON.stringify(data.user))
  }

  function logout() {
    token.value = null
    user.value = null
    localStorage.removeItem('token')
    localStorage.removeItem('user')

    router.push('/customer-login')
  }

  const isLoggedIn = computed(() => !!token.value)

  return { token, user, setToken, logout, isLoggedIn }
})
