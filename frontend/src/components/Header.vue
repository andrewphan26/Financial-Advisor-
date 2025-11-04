<template>
  <div class="header flex">
    <div class="logo flex">
      <ToolingIcon class="icon" />

      <div class="name">Loan System</div>
    </div>
    <slot name="user-opts"></slot>
  </div>
</template>

<style scoped>
.header {
  background-color: rgb(17, 27, 39);
  color: #fff;
  height: 70px;
  width: 100%;
  margin-bottom: 48px;

  justify-content: flex-start;
}

.logo {
  height: 100%;
  padding: 24px;
  font-size: 36px;
  font-weight: bold;
  justify-content: center;
  align-items: center;
}

.logo .icon {
  display: block;
  width: 45px;
  height: 45px;
  margin-right: 18px;
}
</style>

<script>
import ToolingIcon from './icons/IconTooling.vue'
export default {
  components: {
    ToolingIcon,
  },
}
</script>
