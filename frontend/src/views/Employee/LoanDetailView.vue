<template>
  <div class="page">
    <!-- Top Navigation -->
    <header class="header">
      <h2>Loan Details</h2>

      <div class="actions">
        <button @click="goToSettings" class="btn">Settings</button>
        <button @click="logout" class="btn danger">Sign Out</button>
      </div>
    </header>

    <!-- Main content: two columns -->
    <div class="main-grid">
      <!-- LEFT SIDE: LOAN DETAILS -->
      <div class="left">
        <h3 class="customer-name">Customer: {{ customerName }}</h3>

        <p><strong>Loan ID:</strong> {{ loan.id }}</p>
        <p><strong>Amount:</strong> ${{ loan.amount }}</p>
        <p><strong>Status:</strong> {{ loan.status }}</p>
        <p><strong>Created:</strong> {{ loan.created_at }}</p>

        <div class="loan-actions">
          <button @click="takeAction('approve')" class="btn approve">
            Approve
          </button>
          <button @click="takeAction('reject')" class="btn reject">
            Reject
          </button>
        </div>

        <!-- Loan history -->
        <div class="history-card">
          <h3>Loan History</h3>

          <div class="history-scroll">
            <ul v-if="history.length">
              <li v-for="item in history" :key="item.id">
                <strong>Loan #{{ item.id }}</strong> — {{ item.status }} — ${{ item.amount }}
              </li>
            </ul>

            <p v-else>No previous loan history.</p>
          </div>
        </div>
      </div>

      <!-- RIGHT SIDE: CUSTOMER INFO -->
      <div class="right">
        <div class="info-card">
          <h3>Customer’s Information</h3>
          <p><strong>First Name:</strong> {{ loan.first_name }}</p>
          <p><strong>Last Name:</strong> {{ loan.last_name }}</p>
          <p><strong>Address:</strong> {{ loan.address }}</p>
          <p><strong>Phone Number:</strong> {{ loan.phone }}</p>
          <p><strong>Monthly Budget:</strong> {{ finance.monthly_budget }}</p>
        </div>

        <div class="info-card">
          <h3>Employment Information</h3>
          <p><strong>Company:</strong> {{ employment.company }}</p>
          <p><strong>Role:</strong> {{ employment.role }}</p>
          <p><strong>Address:</strong> {{ employment.address }}</p>
          <p><strong>Email:</strong> {{ employment.email }}</p>
          <p><strong>Monthly Salary:</strong> {{ employment.monthly_salary }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from "vue"
import { useRoute, useRouter } from "vue-router"

const route = useRoute()
const router = useRouter()

const loanId = route.params.id

const loan = ref({})
const history = ref([])

// NEW: extra info blocks
const finance = ref({})
const employment = ref({})

const customerName = computed(() => {
  if (!loan.value.first_name) return ""
  return `${loan.value.first_name} ${loan.value.last_name}`
})

// Load loan details
const loadLoan = async () => {
  const res = await fetch(`http://localhost:3000/loan/${loanId}`)
  const data = await res.json()

  console.log("Loan API response:", data)
  loan.value = data

  if (loan.value && loan.value.customer_id) {
    const customerId = loan.value.customer_id
    loadHistory(customerId)
    loadFinance(customerId)
    loadEmployment(customerId)
  }
}

// Load loan history
const loadHistory = async (customerId) => {
  const res = await fetch(
    `http://localhost:3000/loan/customer/history/${customerId}`
  )
  history.value = await res.json()
}

// Load financial info
const loadFinance = async (customerId) => {
  try {
    const res = await fetch(
      `http://localhost:3000/customer/finance/${customerId}`
    )
    if (!res.ok) return
    finance.value = await res.json()
  } catch (err) {
    console.error("Error loading finance:", err)
  }
}

// Load employment info
const loadEmployment = async (customerId) => {
  try {
    const res = await fetch(
      `http://localhost:3000/customer/employment/${customerId}`
    )
    if (!res.ok) return
    employment.value = await res.json()
  } catch (err) {
    console.error("Error loading employment:", err)
  }
}

// Approve/Reject loan
const takeAction = async (action) => {
  try {
    const res = await fetch(`http://localhost:3000/loan/action/${loanId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action }),
    })

    if (!res.ok) {
      console.error("Failed to update loan status")
      return
    }

    await loadLoan() // refresh status & history
  } catch (err) {
    console.error("Error updating loan status:", err)
  }
}

const logout = () => {
  localStorage.clear()
  router.push("/employee/login")
}

const goToSettings = () => alert("Settings coming soon!")

onMounted(() => {
  loadLoan()
})
</script>

<style>
.page {
  padding: 40px;
  max-width: 1200px;
  margin: auto;
}

/* Top bar */
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.actions .btn {
  margin-left: 10px;
}

/* Two-column layout */
.main-grid {
  margin-top: 40px;
  display: grid;
  grid-template-columns: 1.1fr 0.9fr;
  gap: 40px;
}

.customer-name {
  font-size: 22px;
  margin-bottom: 16px;
}

.left p,
.right p {
  margin: 6px 0;
  font-size: 16px;
}

/* Buttons */
.loan-actions {
  margin-top: 20px;
  display: flex;
  gap: 10px;
}

/* History card with scroll */
.history-card {
  margin-top: 25px;
  border: 1px solid #666;
  padding: 15px;
  border-radius: 10px;
}

.history-scroll {
  max-height: 140px;
  overflow-y: auto;
  padding-right: 6px;
}

/* Info cards on the right */
.info-card {
  padding: 20px;
  border: 1px solid #555;
  border-radius: 10px;
  margin-bottom: 20px;
}

.btn {
  padding: 10px 18px;
  border-radius: 6px;
  border: none;
  cursor: pointer;
}

.btn.approve {
  background: #4caf50;
  color: white;
}

.btn.reject {
  background: #f44336;
  color: white;
}

.btn.danger {
  background: #d9534f;
  color: white;
}
</style>
