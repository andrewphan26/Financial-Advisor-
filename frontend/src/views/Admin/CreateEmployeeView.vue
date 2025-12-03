<template>
  <div class="create-wrapper">

    <!-- TOP BAR -->
    <div class="top-bar">
      <button class="top-btn" @click="goHome">Home</button>
      <button class="top-btn danger" @click="logout">Sign Out</button>
    </div>

    <h1 class="title">Create New User</h1>

    <div class="form-box">
      <label>First Name</label>
      <input v-model="firstName" type="text" />

      <label>Last Name</label>
      <input v-model="lastName" type="text" />

      <label>Email</label>
      <input v-model="email" type="email" />

      <label>Password</label>
      <input v-model="password" type="password" />

      <label>User Type</label>
      <select v-model="type">
        <option value="customer">Customer</option>
        <option value="employee">Employee</option>
      </select>

      <label>Role</label>
      <select v-model="role">
        <option value="">None</option>
        <option value="admin">Admin</option>
        <option value="analytic">Analytic</option>
      </select>

      <button class="create-btn" @click="createUser">Create User</button>
    </div>

    <!-- SUCCESS POPUP -->
    <div v-if="success" class="toast">
      User successfully created!
    </div>

  </div>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();

const firstName = ref("");
const lastName = ref("");
const email = ref("");
const password = ref("");
const type = ref("customer");
const role = ref("");

const success = ref(false);

const showSuccess = () => {
  success.value = true;
  setTimeout(() => {
    success.value = false;
    router.push("/admin/dashboard");
  }, 2000);
};

const createUser = async () => {
  await fetch("http://localhost:3000/admin/users/create", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      first_name: firstName.value,
      last_name: lastName.value,
      email: email.value,
      password: password.value,
      type: type.value,
      role: role.value,
    }),
  });

  showSuccess();
};

const goHome = () => router.push("/admin/dashboard");
const logout = () => router.push("/employee/login");
</script>

<style scoped>
.create-wrapper {
  padding: 20px;
  background: #111;
  min-height: 100vh;
  min-width: 480px;
  color: white;
}

.top-bar {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
}

.top-btn {
  background: #333;
  color: white;
  padding: 10px 18px;
  border-radius: 6px;
  border: none;
  cursor: pointer;
}

.top-btn.danger {
  background: #c0392b;
}

.title {
  margin-bottom: 20px;
  font-size: 24px;
}

.form-box {
  background: #1c1c1c;
  padding: 20px;
  border-radius: 10px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.form-box input,
.form-box select {
  padding: 12px;
  background: white;
  border: none;
  border-radius: 8px;
}

.create-btn {
  margin-top: 20px;
  padding: 15px;
  background: #3b82f6;
  color: white;
  border: none;
  border-radius: 10px;
  font-size: 16px;
  cursor: pointer;
}

/* Popup */
.toast {
  position: fixed;
  top: 20px;
  right: 20px;
  background: #22c55e;
  color: white;
  padding: 15px 20px;
  border-radius: 8px;
  font-weight: bold;
  box-shadow: 0px 4px 10px rgba(0,0,0,0.3);
  animation: fadeInOut 2s ease-in-out forwards;
  z-index: 9999;
}

@keyframes fadeInOut {
  0% { opacity: 0; transform: translateY(-10px); }
  10% { opacity: 1; transform: translateY(0); }
  90% { opacity: 1; }
  100% { opacity: 0; transform: translateY(-10px); }
}
</style>
