<template>
  <div class="dashboard-wrapper">

    <!-- TOP BAR -->
    <div class="top-bar">
      <h1 class="page-title">Analyst Dashboard</h1>
      <div class="top-buttons">
  <button class="btn" @click="goToSettings">Settings</button>
  <button 
    v-if="isAdmin"
    class="btn"
    @click="goToAdminDashboard"
  >
    Admin Dashboard
  </button>

  <button class="btn" @click="logout">Sign Out</button>
</div>

    </div>

    <div class="dashboard-layout">

      <!-- LEFT SIDEBAR -->
      <div class="sidebar">
        <img class="profile-img" :src="avatar" />

        <h2 class="name">{{ firstName }}</h2>
        <p class="role">{{ role }}</p>
      </div>

      <!-- MAIN CONTENT -->
      <div class="main-content">
        <h2 class="section-title">Assigned Loans</h2>

        <div class="table-card">
          <table>
            <thead>
              <tr>
                <th>Customer</th>
                <th>Amount</th>
                <th>Interest</th>
                <th>Start Date</th>
                <th>End Date</th>
                <th>Status</th>
                <th> Actions </th>
              </tr>
            </thead>

            <tbody>
              <tr v-for="loan in loans" :key="loan.id">
                <td>{{ loan.customer }}</td>
                <td>${{ loan.amount.toLocaleString() }}</td>
                <td>{{ loan.interest }}%</td>
                <td>{{ loan.start }}</td>
                <td>{{ loan.end }}</td>
                <td class="status">{{ loan.status }}</td>

                <td>
                <button class="view-btn" @click="viewLoan(loan.id)">View</button>
                </td>

              </tr>
            </tbody>

          </table>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue"
import { useRouter } from "vue-router"

const router = useRouter()

// employee info
const employeeId = localStorage.getItem("employee_id")
const firstName = localStorage.getItem("employee_name") || "Employee"
const role = localStorage.getItem("employee_role") || "Analyst"
const avatar = ref("")
const isAdmin = role.toLowerCase() === "admin"

console.log("Employee ID:", employeeId)


const loans = ref([])

// Fetch loans assigned to this employee
const loadLoans = async () => {
  try {
    const res = await fetch(`http://localhost:3000/employee/loans/${employeeId}`)
    const data = await res.json()

    loans.value = data.map(l => ({
      id: l.id,
      customer: l.customer,
      amount: l.amount,
      interest: l.interest,
      start: new Date(l.start_date).toLocaleDateString(),
      end: new Date(l.end_date).toLocaleDateString(),
      status: l.status
    }))
  } catch (err) {
    console.error("Failed to load loans", err)
  }
}

const loadEmployeeInfo = async () => {
  try {
    const res = await fetch(
      `http://localhost:3000/employee/settings/${employeeId}`
    )

    if (!res.ok) {
      console.error("Failed to load employee info. HTTP", res.status)
      return
    }

    const data = await res.json()

    // avatar path from DB, fall back to default if missing
    avatar.value = data.avatar || "/avatars/default.png"
  } catch (err) {
    console.error("Failed to load employee info:", err)
  }
}


onMounted(() => {
  loadLoans()
  loadEmployeeInfo()
})

const logout = () => {
  localStorage.removeItem("employee_token")
  localStorage.removeItem("employee_id")
  localStorage.removeItem("employee_name")
  localStorage.removeItem("employee_role")
  router.push("/employee/login")
}

const goToSettings = () => {
  const id = localStorage.getItem("employee_id");
  router.push(`/employee/settings/${id}`);
};


const viewLoan = (loanId) => {
  router.push(`/employee/loan/${loanId}`)
}

const goToAdminDashboard = () => {             
  router.push("/admin/dashboard")
}

</script>


<style scoped>
.dashboard-wrapper {
  background: #141414;
  min-height: 100vh;
  padding: 30px;
  color: white;
}

/* TOP BAR */
.top-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 25px;
}

.page-title {
  font-size: 30px;
  font-weight: 600;
}

.top-buttons {
  display: flex;
  gap: 10px;
}

.btn {
  background: white;
  color: black;
  border: none;
  padding: 10px 20px;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 600;
}

/* LAYOUT */
.dashboard-layout {
  display: flex;
  gap: 30px;
}

/* SIDEBAR */
.sidebar {
  width: 250px;
  background: #1f1f1f;
  padding: 30px 20px;
  border-radius: 12px;
  border: 1px solid #2f2f2f;
  text-align: center;
}

.profile-img {
  width: 140px;
  margin-bottom: 15px;
  border-radius: 50%;
}

.name {
  font-size: 20px;
  margin-bottom: 4px;
}

.role {
  color: #bbbbbb;
  font-size: 14px;
}

/* MAIN CONTENT */
.main-content {
  flex: 1;
  background: #1f1f1f;
  padding: 30px;
  border-radius: 12px;
  border: 1px solid #2f2f2f;
}

.section-title {
  margin-bottom: 20px;
  font-size: 22px;
  border-bottom: 1px solid #333;
  padding-bottom: 6px;
}

/* TABLE */
table {
  width: 100%;
  border-collapse: collapse;
}

th {
  text-align: left;
  padding: 10px;
  color: #bfbfbf;
  font-size: 14px;
  border-bottom: 1px solid #333;
}

td {
  padding: 12px 10px;
  border-bottom: 1px solid #2a2a2a;
  font-size: 15px;
}

.status {
  color: #4ade80; /* green for active */
  font-weight: 600;
}

.view-btn {
  background: #3b82f6;
  color: white;
  border: none;
  padding: 6px 12px;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 600;
}

.view-btn:hover {
  background: #2563eb;
}


</style>
