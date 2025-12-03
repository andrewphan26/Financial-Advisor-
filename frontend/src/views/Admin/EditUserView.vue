<template>
  <div class="edit-wrapper">

    <!-- TOP BAR -->
    <div class="top-bar">
      <button class="top-btn" @click="goHome">Home</button>
      <button class="top-btn danger" @click="logout">Sign Out</button>
    </div>

    <h1 class="title">Edit User</h1>

    <div class="form-box">
      <label>First Name</label>
      <input type="text" v-model="firstName" />

      <label>Last Name</label>
      <input type="text" v-model="lastName" />

      <label>Email</label>
      <input type="email" v-model="email" />

      <button class="update-btn" @click="updateUser">Update</button>
    </div>

    <div v-if="success" class="toast">
        Update has been made!
    </div>

  </div>
</template>

<script setup>
import { ref, onMounted } from "vue"
import { useRouter, useRoute } from "vue-router"
import { watch } from "vue"

const router = useRouter()
const route = useRoute()

const userId = route.params.id

const firstName = ref("")
const lastName = ref("")
const email = ref("")

// Load user data to pre-fill fields
const loadUser = async (id) => {
  const res = await fetch(`http://localhost:3000/admin/user/${id}`)
  const user = await res.json()

  firstName.value = user.first_name
  lastName.value = user.last_name
  email.value = user.email
};

onMounted(() => {
  loadUser(userId);
});

const success = ref(false);

const showSuccess = () => {
  success.value = true;
  setTimeout(() => {
    success.value = false;
  }, 2000); // hides after 2 seconds
};

const updateUser = async () => {
    if (!firstName.value.trim()) {
    alert("First name cannot be empty.");
    return;
  }
    if (!lastName.value.trim()) {
    alert("Last name cannot be empty.");
    return;
  }
    if (!email.value.trim()) {
    alert("Email cannot be empty.");
    return;
  }
    if (!email.value.trim()) {
    alert("Email cannot be empty.");
    return;
  }
  await fetch(`http://localhost:3000/admin/user/${userId}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      first_name: firstName.value,
      last_name: lastName.value,
      email: email.value
    })
  });

  // Show popup
  showSuccess();

  // Redirect after a short delay
  setTimeout(() => {
    router.push("/admin/dashboard");
  }, 2000);
};


const goHome = () => router.push("/admindashboardview")
const logout = () => {
  localStorage.removeItem("token")
  router.push("/")
}
</script>

<style scoped>
.edit-wrapper {
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

.form-box label {
  font-size: 14px;
}

.form-box input {
  padding: 12px;
  background: white;
  border: none;
  border-radius: 8px;
}

.update-btn {
  margin-top: 20px;
  padding: 15px;
  background: #6abf4b;
  color: white;
  border: none;
  border-radius: 10px;
  font-size: 16px;
  cursor: pointer;
}
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
