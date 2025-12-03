<template>
  <div class="settings-page">

    <!-- TOP NAV -->
    <header class="top-nav">
      <button class="nav-btn" @click="goHome">Home</button>
      <button class="nav-btn danger" @click="logout">Sign Out</button>
    </header>

    <h2 class="title">Settings</h2>

    <!-- MAIN SETTINGS CARD -->
    <div class="settings-card">

      <!-- Avatar Selection -->
      <h3>Select Avatar:</h3>
      <div class="avatar-row">
        <img 
          v-for="a in avatars" 
          :key="a" 
          :src="a"
          :class="['avatar-option', avatar === a ? 'selected' : '']"
          @click="avatar = a"
        />
      </div>

      <!-- FORM -->
      <div class="form-row">
        <label>First Name</label>
        <input type="text" v-model="first_name" class="form-input" />
      </div>

      <div class="form-row">
        <label>Last Name</label>
        <input type="text" v-model="last_name" class="form-input" />
      </div>

      <div class="form-row">
        <label>Email</label>
        <input type="email" v-model="email" class="form-input" />
      </div>

      <button class="update-btn" @click="updateSettings">
        Update
      </button>

    </div>

  </div>
</template>


<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();
const employeeId = localStorage.getItem("employee_id");

// State
const first_name = ref("");
const last_name = ref("");
const email = ref("");
const avatar = ref("");

// Pre-existing avatar images
const avatars = [
  "/avatars/1.png",
  "/avatars/2.png",
  "/avatars/3.png",
  "/avatars/4.png"
];

// Load existing info
const employee_Id = localStorage.getItem("employee_id");

const loadSettings = async () => {
  try {
    const res = await fetch(
      `http://localhost:3000/employee/settings/${employeeId}`
    );

    if (!res.ok) {
      console.error("Failed to load settings. HTTP", res.status);
      return;
    }

    const data = await res.json();
    console.log("Settings API:", data);

    first_name.value = data.first_name || "";
    last_name.value = data.last_name || "";
    email.value = data.email || "";
    avatar.value = data.avatar || avatars[0];
  } catch (err) {
    console.error("Failed to load settings:", err);
  }
};


const updateSettings = async () => {
  await fetch(`http://localhost:3000/employee/settings/${employeeId}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      first_name: first_name.value,
      last_name: last_name.value,
      email: email.value,
      avatar: avatar.value
    })
  });

  alert("Information updated successfully!");
};

const goHome = () => router.push("/employee/dashboard");
const logout = () => {
  localStorage.clear();
  router.push("/employee/login");
};

onMounted(loadSettings);
</script>


<style>
/* Entire Page */
.settings-page {
  padding: 30px;
  color: white;
}

/* Top Navigation */
.top-nav {
  display: flex;
  justify-content: flex-end;
  gap: 15px;
  margin-bottom: 20px;
}

.nav-btn {
  background: white;
  border-radius: 10px;
  padding: 10px 18px;
  font-weight: bold;
  cursor: pointer;
  color: black;
}

.nav-btn.danger {
  background: white;
  color: black;
}

.title {
  font-size: 28px;
  margin-bottom: 25px;
}

/* Settings Card */
.settings-card {
  background: #1a1a1a;
  border-radius: 14px;
  padding: 25px;
  width: 450px;
}

/* Avatar Row */
.avatar-row {
  display: flex;
  gap: 15px;
  margin-bottom: 20px;
}

.avatar-option {
  width: 60px;
  height: 60px;
  border-radius: 100px;
  cursor: pointer;
  border: 3px solid transparent;
}

.avatar-option.selected {
  border-color: #4caf50;
}

/* Form */
.form-row {
  display: flex;
  flex-direction: column;
  margin-bottom: 15px;
}

.form-input {
  background: white;
  color: black;
  padding: 10px;
  border-radius: 6px;
  border: none;
}

.update-btn {
  width: 100%;
  margin-top: 10px;
  background: #4caf50;
  color: white;
  padding: 12px;
  border-radius: 8px;
  font-size: 16px;
  cursor: pointer;
}
</style>
