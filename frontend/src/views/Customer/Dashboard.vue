<template>
  <div class="customer-dashboard">
    <div class="d-flex flex-row tabs-container">
      <v-tabs v-model="tab" direction="vertical">
        <v-tab
          prepend-icon="mdi-offer"
          text="My Loans"
          @click="goToTab('my-loans')"
          :value="'my-loans'"
        />
        <v-tab
          prepend-icon="mdi-account"
          text="Personal Information"
          @click="goToTab('personal-info')"
          :value="'personal-info'"
        />
        <v-tab
          prepend-icon="mdi-office-building"
          text="Employment Information"
          @click="goToTab('employment-info')"
          :value="'employment-info'"
        />
        <v-tab
          prepend-icon="mdi-finance"
          text="Finance"
          @click="goToTab('finance')"
          :value="'finance'"
        />
        <v-tab
          prepend-icon="mdi-bell"
          text="Notification"
          @click="goToTab('notifications')"
          :value="'notifications'"
        />
      </v-tabs>

      <div class="tab-content">
        <router-view />
      </div>
    </div>
  </div>
</template>

<style>
.customer-dashboard {
  min-width: 1420px;
}
.tabs-container {
  width: 100%;
}
.v-slide-group {
  /* border-right: 1px solid white; */
  margin-right: 36px;
}
.v-window-item {
  /* padding: 12px; */
}
</style>

<script>
import { ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'

export default {
  setup() {
    const route = useRoute()
    const router = useRouter()
    const tab = ref(route.name)

    watch(
      () => route.name,
      (newName) => {
        tab.value = newName
      },
    )

    const goToTab = (tabName) => {
      router.push({ name: tabName })
    }

    return { tab, goToTab }
  },
}
</script>
