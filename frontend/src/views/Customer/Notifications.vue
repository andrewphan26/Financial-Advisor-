<template>
  <div class="dashboard-item">
    <div class="title-row">
      <h2>Notifications</h2>
    </div>

    <div>
      <div class="table-card" v-if="notifications.length">
        <table class="jeffrey">
          <thead>
            <tr>
              <th>Description</th>
              <th>Date</th>
            </tr>
          </thead>

          <tbody>
            <tr v-for="item in notifications" :key="item.id" class="notification-item">
              <td>{{ item.description }}</td>
              <td>{{ item.date ? new Date(item.date).toLocaleDateString() : '-' }}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <p v-else>No Notifications yet</p>
    </div>
  </div>
</template>

<script>
import notificationSrv from '@/services/notifications.js'

export default {
  data() {
    return {
      notifications: [],
    }
  },

  computed: {},

  methods: {
    async init() {
      this.notifications = await notificationSrv.getNotifications()
      console.log(this.notifications)
    },
  },

  created() {
    this.init()
  },
}
</script>

<style scoped></style>
