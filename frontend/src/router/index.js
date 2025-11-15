import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import { useRegister } from '@/stores/register'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/about',
      name: 'about',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/AboutView.vue'),
    },
    {
      path: '/sample',
      name: 'sample',
      component: () => import('../views/SampleView.vue'),
    },

    // Auth
    {
      path: '/customer-register',
      name: 'register',
      component: () => import('../views/Customer/Register/Register.vue'),
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('../views/Customer/Login.vue'),
    },

    // Customer
    {
      path: '/customer/dashboard',
      name: 'customer-dashboard',
      component: () => import('../views/Customer/Dashboard.vue'),
      meta: { requiresAuth: true },
    },

    // Catch-all for unknown routes
    {
      path: '/:catchAll(.*)',
      redirect: '/login',
    },
  ],
})

router.beforeEach((to, from, next) => {
  const registerStore = useRegister()
  const token = localStorage.getItem('token')
  const isLoggedIn = !!token

  // If already logged in, redirect to dashboard
  const publicPages = ['home', 'login', 'register']
  if (isLoggedIn && publicPages.includes(to.name)) {
    return next({ name: 'customer-dashboard' })
  }

  // Protect routes that need auth
  if (to.meta.requiresAuth && !token) {
    return next({ name: 'login' })
  }

  // Warn user if leaving page on registration process
  // const isLeavingRegister = from.name === 'register'
  // if (
  //   isLeavingRegister &&
  //   (registerStore.hasLoanInProcess || registerStore.registrationInProcess)
  // ) {
  //   if (!confirm('Leave this page? Your progress will reset.')) {
  //     return next(false)
  //   }
  // }

  next()
})

export default router
