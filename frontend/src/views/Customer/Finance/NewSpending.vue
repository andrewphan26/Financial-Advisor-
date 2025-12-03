<template>
  <div class="new-spending">
    <h2>{{ isEdit ? 'Edit Spending' : 'New Spending' }}</h2>
    <v-divider class="my-3" />

    <v-form @submit.prevent="onSubmit" ref="form">
      <v-row>
        <v-col cols="12" md="6">
          <v-text-field
            v-model="formData.date"
            type="date"
            label="Date"
            required
            density="compact"
          />
        </v-col>
        <v-col cols="12" md="6">
          <v-text-field v-model="formData.category" label="Category" required density="compact" />
        </v-col>
        <v-col cols="12" md="6">
          <v-text-field v-model="formData.sub_category" label="Sub Category" density="compact" />
        </v-col>
        <v-col cols="12" md="6">
          <v-text-field
            v-model.number="formData.amount"
            label="Amount"
            type="number"
            step="0.01"
            min="0"
            required
            prefix="$"
            density="compact"
          />
        </v-col>
      </v-row>

      <div class="actions">
        <v-btn v-if="isEdit" color="error" variant="text" @click="onDelete">Delete</v-btn>
        <v-spacer v-if="isEdit" />
        <v-btn color="default" variant="text" @click="goBack">Cancel</v-btn>
        <v-btn color="primary" type="submit">Save</v-btn>
      </div>
    </v-form>
  </div>
</template>

<script>
import { ref, onMounted, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import spendingSrv from '@/services/spending'

export default {
  setup() {
    const router = useRouter()
    const route = useRoute()
    const form = ref(null)
    const spendingId = computed(() => route.params.id)
    const isEdit = computed(() => !!spendingId.value)

    const today = new Date().toISOString().slice(0, 10)
    const formData = ref({
      date: today,
      category: '',
      sub_category: '',
      amount: null,
    })

    const loadSpending = async () => {
      if (!isEdit.value) return

      try {
        console.log('Loading spending with id:', spendingId.value)
        const spending = await spendingSrv.getSpendings()
        const item = spending.find((s) => s.id === parseInt(spendingId.value))

        if (item) {
          formData.value = {
            date: item.date,
            category: item.category,
            sub_category: item.sub_category,
            amount: item.amount,
          }
        } else {
          alert('Spending not found')
          router.push({ name: 'finance' })
        }
      } catch (e) {
        console.error('Failed to load spending:', e)
        alert('Failed to load spending data')
      }
    }

    onMounted(loadSpending)

    const onSubmit = async () => {
      console.log('Save button clicked')
      try {
        // Basic required checks
        if (!formData.value.date || !formData.value.category || formData.value.amount == null) {
          console.warn('Validation failed - missing required fields')
          alert('Please fill in Date, Category, and Amount')
          return
        }

        if (isEdit.value) {
          console.log('Updating spending with data:', formData.value)
          await spendingSrv.updateSpending(spendingId.value, {
            date: formData.value.date,
            category: formData.value.category,
            sub_category: formData.value.sub_category,
            amount: formData.value.amount,
          })
          console.log('Spending updated successfully')
        } else {
          console.log('Creating spending with data:', formData.value)
          const result = await spendingSrv.createSpending({
            date: formData.value.date,
            category: formData.value.category,
            sub_category: formData.value.sub_category,
            amount: formData.value.amount,
          })
          console.log('Spending created successfully:', result)
        }

        router.push({ name: 'finance' })
      } catch (e) {
        console.error('Failed to save spending - Full error:', e)
        console.error('Error response:', e.response?.data)
        console.error('Error status:', e.response?.status)

        let errorMsg = 'Failed to save spending. '
        if (e.response?.status === 401) {
          errorMsg += 'You are not logged in.'
        } else if (e.response?.status === 400) {
          errorMsg += 'Invalid data: ' + (e.response?.data?.message || 'Check required fields')
        } else if (!e.response) {
          errorMsg += 'Cannot connect to server. Is the backend running on port 3000?'
        } else {
          errorMsg += 'Server error: ' + (e.response?.data?.message || e.message)
        }

        alert(errorMsg)
      }
    }

    const goBack = () => router.push({ name: 'finance' })

    const onDelete = async () => {
      if (!confirm('Are you sure you want to delete this spending?')) {
        return
      }

      try {
        console.log('Deleting spending with id:', spendingId.value)
        await spendingSrv.deleteSpending(spendingId.value)
        console.log('Spending deleted successfully')
        router.push({ name: 'finance' })
      } catch (e) {
        console.error('Failed to delete spending - Full error:', e)
        console.error('Error response:', e.response?.data)
        console.error('Error status:', e.response?.status)

        let errorMsg = 'Failed to delete spending. '
        if (e.response?.status === 401) {
          errorMsg += 'You are not logged in.'
        } else if (e.response?.status === 404) {
          errorMsg += 'Spending not found.'
        } else if (!e.response) {
          errorMsg += 'Cannot connect to server.'
        } else {
          errorMsg += 'Server error: ' + (e.response?.data?.message || e.message)
        }

        alert(errorMsg)
      }
    }

    return { form, formData, onSubmit, goBack, isEdit, onDelete }
  },
}
</script>

<style scoped>
.new-spending {
  max-width: 760px;
  margin: 24px auto;
  background: #2c2c2c;
  color: #fff;
  padding: 16px;
  border-radius: 8px;
  box-shadow:
    rgba(0, 0, 0, 0.1) 0px 4px 6px -1px,
    rgba(0, 0, 0, 0.06) 0px 2px 4px -2px;
}
.new-spending h2 {
  font-size: 18px;
  margin: 0 0 8px 0;
}
.actions {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
}
</style>
