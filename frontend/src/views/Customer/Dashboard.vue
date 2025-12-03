<template>
  <div class="main-container customer-dashboard">
    <div class="d-flex flex-row tabs-container">
      <v-tabs v-model="tab" direction="vertical">
        <v-tab prepend-icon="mdi-offer" text="My Loans" value="option-1"></v-tab>
        <v-tab prepend-icon="mdi-account" text="Personal Information" value="option-2"></v-tab>
        <v-tab
          prepend-icon="mdi-office-building"
          text="Employment Information"
          value="option-3"
        ></v-tab>
        <v-tab prepend-icon="mdi-finance" text="Finance" value="option-4"></v-tab>
        <v-tab prepend-icon="mdi-bell" text="Notification" value="option-5"></v-tab>
      </v-tabs>

      <v-tabs-window v-model="tab">
        <v-tabs-window-item value="option-1"> hello </v-tabs-window-item>

        <v-tabs-window-item value="option-2">
          <v-card flat> </v-card>
        </v-tabs-window-item>

        <v-tabs-window-item value="option-3">
          <v-card flat> </v-card>
        </v-tabs-window-item>
        <v-tabs-window-item value="option-4">
          <Spendings />
        </v-tabs-window-item>
      </v-tabs-window>
    </div>
  </div>
</template>

<style>
.customer-dashboard {
  min-width: 1400px;
}
.tabs-container {
  width: 100%;
}
.v-slide-group {
  border-right: 1px solid white;
  margin-right: 36px;
}
.v-window-item {
  /* padding: 12px; */
}
</style>

<script>
import { useAuthStore } from '@/stores/auth'
import userSrv from '@/services/user'
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import Spendings from '@/views/Customer/Finance/Spendings.vue'

export default {
  data() {
    return {
      res: null,
    }
  },

  components: {
    Spendings,
  },
  computed: {
    auth() {
      return useAuthStore()
    },
  },
  setup() {
    const route = useRoute()
    const tab = ref(route.query.tab || 'option-1')

    onMounted(() => {
      if (route.query.tab) {
        tab.value = route.query.tab
      }
    })

    return { tab }
  },

  methods: {
    async init() {
      this.res = await userSrv.getPersonalInfo()
      console.log(this.res)
    },
  },

  created() {
    this.init()
  },
}
</script>
