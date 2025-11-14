import axios from 'axios'
import { useAuthStore } from '@/stores/auth'

export default function setupInterceptors() {
  const authStore = useAuthStore()

  // Request
  axios.interceptors.request.use(
    (response) => {
      const token = authStore.token

      if (token) {
        response.headers.Authorization = `Bearer ${token}`
      }

      return response
    },
    (error) => Promise.reject(error),
  )

  // Response
  const responseInterceptor = axios.interceptors.response.use(
    (response) => response,
    async (error) => {
      const originalRequest = error.config

      // If request didn't return 401 → just reject
      if (error.response?.status !== 401) {
        return Promise.reject(error)
      }

      // If no refresh token logic → just logout & redirect
      authStore.logout()
      return Promise.reject(error)
    },
  )
}
