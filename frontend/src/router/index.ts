import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

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
      component: () => import('../views/Customer/Register.vue'),
    },
    {
      path: '/customer-login',
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
  ],
})

router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('token')

  if (to.meta.requiresAuth && !token) {
    return next({ name: 'login' })
  }

  next()
})

export default router
