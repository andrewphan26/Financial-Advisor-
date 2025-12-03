import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import { useRegister } from '@/stores/register'
import AdminDashboardView from '../views/Admin/AdminDashBoardView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    // Home
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },

    // About / Sample
    {
      path: '/about',
      name: 'about',
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

    // Customer Dashboard
    {
      path: '/customer/dashboard',
      name: 'customer-dashboard',
      component: () => import('../views/Customer/Dashboard.vue'),
      meta: { requiresAuth: true },
    },
    // {
    //   path: '/customer/spendings',
    //   name: 'customer-spendings',
    //   component: () => import('../views/Customer/Finance/Spendings.vue'),
    //   meta: { requiresAuth: true },
    // },
    {
      path: '/customer/spendings/new',
      name: 'customer-spendings-new',
      component: () => import('../views/Customer/Finance/NewSpending.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/customer/spendings/:id/edit',
      name: 'customer-spendings-edit',
      component: () => import('../views/Customer/Finance/NewSpending.vue'),
      meta: { requiresAuth: true },
    },

    // Loan View
    {
      path: '/loan',
      name: 'loan-details',
      component: () => import('../views/LoanView.vue'),
    },

    // Catch-all for unknown routes
    {
      path: '/:catchAll(.*)',
      redirect: '/login',
    },
  ],
})

// ======================================================
//                     ROUTE GUARD
// ======================================================

router.beforeEach((to, from, next) => {
  const registerStore = useRegister()
  const token = localStorage.getItem('token')
  const isLoggedIn = !!token

  // Redirect logged-in users away from login/register
  const publicPages = ['home', 'login', 'register']
  if (isLoggedIn && publicPages.includes(to.name)) {
    return next({ name: 'customer-dashboard' })
  }

  // Protect Customer Routes
  if (to.meta.requiresAuth && !token) {
    return next({ name: 'login' })
  }

  // Employee / Admin Tokens
  const employeeToken = localStorage.getItem('employee_token')
  const adminToken = localStorage.getItem('admin_token')

  // Protect Employee Routes
  if (to.meta.requiresEmployeeAuth && !employeeToken && !adminToken) {
    return next({ name: 'employee-login' })
  }

  // Protect Admin Routes
  if (to.meta.requiresAdminAuth && !adminToken) {
    return next({ name: 'employee-login' })
    // later redirect to admin-login if you create one
  }

  next()
})

export default router
