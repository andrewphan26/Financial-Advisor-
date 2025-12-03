import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import { useRegister } from '@/stores/register'
import AdminDashboardView from "../views/Admin/AdminDashBoardView.vue"

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
    {
      path: '/customer/spendings',
      name: 'customer-spendings',
      component: () => import('../views/Customer/Finance/Spendings.vue'),
      meta: { requiresAuth: true },
    },
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

    // Employee Login
    {
      path: '/employee/login',
      name: 'employee-login',
      component: () => import('../views/Employee/EmployeeLoginView.vue'),
    },

    // Analyst Dashboard
    {
      path: '/employee/dashboard',
      name: 'analyst-dashboard',
      component: () => import('../views/Employee/AnalystDashboardView.vue'),
      meta: { requiresEmployeeAuth: true },
    },

    // Loan Info
    {
      path: '/employee/loans',
      name: 'employee-loans',
      component: () => import('../views/Employee/LoanInfoView.vue'),
      meta: { requiresEmployeeAuth: true },
    },

    // Employee Loan Details
    {
      path: '/employee/loan/:id',
      name: 'employee-loan-details',
      component: () => import('../views/Employee/LoanDetailView.vue'),
      meta: { requiresEmployeeAuth: true }
    },

    // Employee Settings
    {
      path: "/employee/settings/:id",
      name: "employee-settings",
      component: () => import("../views/Employee/EmployeeSettingsView.vue"),
      meta: { requiresEmployeeAuth: true }
    },

    // -------------------------------------------- //
    //                 ADMIN ROUTES                 //
    // -------------------------------------------- //

    {
      path: '/admin/dashboard',
      name: 'admin-dashboard',
      component: AdminDashboardView,
      meta: { requiresAdminAuth: true },
    },

    {
      path: '/admin/users/create',
      name: 'admin-create-employee',
      component: () => import('../views/Admin/CreateEmployeeView.vue'),
      meta: { requiresAdminAuth: true },
    },

    {
      path: '/admin/users/edit/:id',
      name: 'admin-edit-user',
      component: () => import('../views/Admin/EditUserView.vue'),
      meta: { requiresAdminAuth: true },
    },

    // -------------------------------------------- //
    //               LEGACY PATH SUPPORT            //
    // -------------------------------------------- //

    {
      path: '/admindashboardview',
      redirect: '/admin/dashboard'  // Forward old path to new one
    },

    // Catch-all: unknown routes → login
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
