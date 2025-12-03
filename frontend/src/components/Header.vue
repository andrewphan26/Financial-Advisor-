<template>
  <div class="header flex">
    <div class="logo flex" @click="toHome">
      <ToolingIcon class="icon" />

      <div class="name">Loan System</div>
    </div>
    <div class="user-opts">
      <slot name="user-opts">
        <v-btn class="sign-out btn" v-if="isLoggedIn" @click="logout">Sign out</v-btn>
        <!-- <v-btn class="sign-in btn" v-else @click="toLogin">Sign in</v-btn> -->
      </slot>
    </div>
  </div>
</template>

<style scoped>
.header {
  background-color: rgb(17, 27, 39);
  color: #fff;
  height: 70px;
  width: 100%;
  margin-bottom: 48px;

  justify-content: space-between;
}

.logo {
  height: 100%;
  padding: 24px;
  font-size: 36px;
  font-weight: bold;
  justify-content: center;
  align-items: center;
  cursor: pointer;
}

.logo .icon {
  display: block;
  width: 45px;
  height: 45px;
  margin-right: 18px;
}

.user-opts {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  margin-right: 36px;
}
</style>

<script>
import { useAuthStore } from '@/stores/auth'
import ToolingIcon from './icons/IconTooling.vue'
export default {
  components: {
    ToolingIcon,
  },
  computed: {
    auth() {
      return useAuthStore()
    },
    isLoggedIn() {
      return this.auth.isLoggedIn
    },
  },
  methods: {
    toHome() {
      this.$router.push('/')
    },
    toLogin() {
      this.$router.push('/login')
    },
    logout() {
      this.auth.logout()
    },
  },
}
</script>
