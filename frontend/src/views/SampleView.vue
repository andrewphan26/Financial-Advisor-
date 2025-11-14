<template>
  <div class="main-container">
    <div class="test">
      <h1>Testing backend - Res received:</h1>
      <div v-for="item in status">
        <p>{{ item }}</p>
      </div>
    </div>
  </div>
</template>

<style>
@media (min-width: 1024px) {
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
