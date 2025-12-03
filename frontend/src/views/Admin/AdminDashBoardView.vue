<template>
  <div class="dashboard-wrapper">
    
    <!-- TOP BAR -->
    <div class="top-bar">
      <h1 class="page-title">Admin Dashboard</h1>
      <div class="top-buttons">
        <button class="btn" @click="goHome">Home</button>
        <button class="btn" @click="goCreateUser">Create User</button>
        <button class="btn danger" @click="logout">Sign Out</button>
      </div>
    </div>

    <div class="dashboard-layout">

      <!-- LEFT SIDEBAR -->
      <div class="sidebar">
        <img class="profile-img" :src="avatar" />
        <h2 class="name">{{ firstName }}</h2>
        <p class="role">admin</p>

        <!-- FILTERS -->
        <div class="filters">
          <h3>Filter:</h3>

          <label>
            <input type="radio" value="all" v-model="filter" /> All
          </label>

          <label>
            <input type="radio" value="customer" v-model="filter" /> Customer
          </label>

          <label>
            <input type="radio" value="employee" v-model="filter" /> Employee
          </label>

        </div>
      </div>

      <!-- MAIN TABLE -->
      <div class="main-content">
        <h2 class="section-title">Users</h2>

        <div class="table-card">
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Type</th>
                <th>Role</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              <tr v-for="u in filteredUsers" :key="u.user_id">
                <td>{{ u.first_name }} {{ u.last_name }}</td>
                <td>{{ u.email }}</td>
                <td>{{ u.type }}</td>
                <td>{{ u.role || "-" }}</td>

                <td>
                  <button class="edit-btn" @click="editUser(u.id)">Edit</button>
                  <button class="delete-btn" @click="deleteUser(u.id)">Delete</button>
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
import { ref, computed, onMounted } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();

// Admin info (analytics type but acts as admin)
const adminId = localStorage.getItem("employee_id");
const firstName = localStorage.getItem("employee_name") || "Admin";
const avatar = ref(localStorage.getItem("employee_avatar") || "/avatars/default.png");

const loadAdminInfo = async () => {
  try {
    const res = await fetch(`http://localhost:3000/admin/profile/${adminId}`);
    const data = await res.json();

    avatar.value = data.avatar || "/avatars/default.png";
  } catch (err) {
    console.error("Failed to load admin profile:", err);
  }
};

// Users list
const users = ref([]);
const filter = ref("all");

// Fetch all users
const loadUsers = async () => {
  const res = await fetch("http://localhost:3000/admin/users");
  users.value = await res.json();
};

// Filter logic
const filteredUsers = computed(() => {
  if (filter.value === "all") return users.value;
  return users.value.filter((u) => u.type === filter.value);
});

// Delete user
const deleteUser = async (id) => {
  if (!confirm("Are you sure you want to delete this user?")) return;

  await fetch(`http://localhost:3000/admin/users/${id}`, {
    method: "DELETE",
  });

  loadUsers(); // refresh
};

// Navigation
const goHome = () => router.push("/admin/dashboard");
const goCreateUser = () => router.push("/admin/users/create");
const editUser = (id) => router.push(`/admin/users/edit/${id}`);

const logout = () => {
  localStorage.clear();
  router.push("/employee/login");
};

onMounted(() => {
  loadUsers();
  loadAdminInfo();  
});

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
  padding: 10px 20px;
  border-radius: 8px;
  font-weight: bold;
  cursor: pointer;
}

.btn.danger {
  background: #e63946;
  color: white;
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
  text-align: left;
}

.profile-img {
  width: 140px;
  display: block;
  margin: 0 auto 15px auto;
  border-radius: 50%;
}

.filters {
  margin-top: 20px;
}

.filters h3 {
  margin-bottom: 10px;
}

.filters label {
  display: block;
  margin-bottom: 8px;
  font-size: 15px;
}

/* MAIN CONTENT */
.main-content {
  flex: 1;
  background: #1f1f1f;
  padding: 30px;
  border-radius: 12px;
  border: 1px solid #2f2f2f;
}

.table-card {
  max-height: 550px;
  overflow-y: auto;
}

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
}

.edit-btn {
  background: #3b82f6;
  color: white;
  border: none;
  padding: 5px 12px;
  border-radius: 4px;
  margin-right: 6px;
  cursor: pointer;
}

.delete-btn {
  background: #e63946;
  color: white;
  border: none;
  padding: 5px 12px;
  border-radius: 4px;
  cursor: pointer;
}
</style>
