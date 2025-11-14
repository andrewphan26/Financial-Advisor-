<template>
  <div class="main-container customer-dashboard">
    hello world

    <div class="box">
      {{ res }}
    </div>
  </div>
</template>

<style></style>

<script>
import { useAuthStore } from '@/stores/auth'
import userSrv from '@/services/user'

export default {
  data() {
    return {
      res: null,
    }
  },
  computed: {
    auth() {
      return useAuthStore()
    },
  },

  methods: {
    async init() {
      this.res = await userSrv.getUserInfo(this.auth.user.id)
      console.log(this.res)
    },
  },

  created() {
    this.init()
  },
}
</script>
