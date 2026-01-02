<template>
  <div class="about">
    <h1>Response:</h1>
    <div v-for="item in status">
      <p>{{ item }}</p>
    </div>
  </div>
</template>

<style>
@media (min-width: 1024px) {
  .about {
    min-height: 100vh;
    display: flex;
    align-items: center;
  }
}
</style>

<script>
import testSrv from '@/services/test'

export default {
  data() {
    return {
      status: [],
    }
  },

  methods: {
    async init() {
      this.status = await testSrv.testApi()
      console.log(status)
    },
  },

  created() {
    this.init()
  },
}
</script>
