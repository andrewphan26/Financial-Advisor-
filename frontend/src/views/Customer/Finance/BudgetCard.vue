<template>
  <div class="budget-window">
    <div class="budget-header">
      <h3>Budget</h3>
      <span class="budget-amount" v-if="monthlyBudget">{{ formatCurrency(monthlyBudget) }}</span>
      <span class="budget-amount not-set" v-else>Not set</span>
      <v-btn 
        class="budget-action"
        color="primary" 
        size="small" 
        @click="openDialog"
      >
        {{ monthlyBudget ? 'Update Budget' : 'Set Budget' }}
      </v-btn>
    </div>
    <div class="budget-body">
      <div class="budget-row">
        <span class="label">Monthly spending</span>
        <span class="value red">{{ formatCurrency(monthlySpent) }}</span>
      </div>
      <div class="budget-row">
        <span class="label">Monthly remain</span>
        <span class="value" :class="{ negative: monthlyRemain < 0, green: monthlyRemain >= 0 }">{{ formatCurrency(monthlyRemain) }}</span>
      </div>
      <div class="budget-row">
        <span class="label">Average monthly</span>
        <span class="value">{{ formatCurrency(averageMonthly) }}</span>
      </div>
    </div>

    <!-- Budget Dialog -->
    <v-dialog v-model="budgetDialog" max-width="400">
      <v-card class="budget-dialog-card">
        <v-card-title>Set Monthly Budget</v-card-title>
        <v-card-text>
          <v-text-field
            v-model.number="budgetInput"
            label="Monthly Budget"
            type="number"
            step="0.01"
            min="0"
            prefix="$"
            density="compact"
            autofocus
          />
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn color="default" variant="text" @click="budgetDialog = false">Cancel</v-btn>
          <v-btn color="primary" @click="saveBudget">Save</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import { ref, computed } from 'vue'
import { toCurrency } from '@/utils/formatters'
import spendingSrv from '@/services/spending'

export default {
  props: {
    transactions: {
      type: Array,
      required: true,
      default: () => []
    },
    monthlyBudget: {
      type: Number,
      default: null
    }
  },
  emits: ['budget-updated'],
  setup(props, { emit }) {
    const budgetDialog = ref(false)
    const budgetInput = ref(null)

    const formatCurrency = (v) => toCurrency(v)

    // Compute spending for the current calendar month
    const monthlySpent = computed(() => {
      const now = new Date()
      const year = now.getFullYear()
      const month = now.getMonth() // 0-11
      let sum = 0
      for (const tx of props.transactions) {
        if (!tx.date) continue
        const d = new Date(tx.date)
        if (!isNaN(d) && d.getFullYear() === year && d.getMonth() === month) {
          sum += Number(tx.amount || 0)
        }
      }
      return sum
    })

    // Remaining budget for current month
    const monthlyRemain = computed(() => {
      const budget = Number(props.monthlyBudget || 0)
      const spent = Number(monthlySpent.value || 0)
      return budget - spent
    })

    // Average monthly spending across all months present in transactions
    const averageMonthly = computed(() => {
      if (!props.transactions.length) return 0
      const perMonth = new Map() // key: YYYY-MM, value: sum
      for (const tx of props.transactions) {
        if (!tx.date) continue
        const d = new Date(tx.date)
        if (isNaN(d)) continue
        const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
        const prev = perMonth.get(key) || 0
        perMonth.set(key, prev + Number(tx.amount || 0))
      }
      const months = perMonth.size
      if (months === 0) return 0
      const total = Array.from(perMonth.values()).reduce((a, b) => a + b, 0)
      return total / months
    })

    const openDialog = () => {
      budgetInput.value = props.monthlyBudget
      budgetDialog.value = true
    }

    const saveBudget = async () => {
      try {
        if (budgetInput.value == null || budgetInput.value < 0) {
          alert('Please enter a valid budget amount')
          return
        }
        
        console.log('Updating budget to:', budgetInput.value)
        const result = await spendingSrv.updateMonthlyBudget(budgetInput.value)
        console.log('Budget update result:', result)
        emit('budget-updated', budgetInput.value)
        budgetDialog.value = false
      } catch (err) {
        console.error('Failed to update budget - Full error:', err)
        console.error('Error response:', err.response?.data)
        console.error('Error status:', err.response?.status)
        
        let errorMsg = 'Failed to update budget. '
        if (err.response?.status === 401) {
          errorMsg += 'Please log in again.'
        } else if (err.response?.status === 500) {
          errorMsg += 'Database error: ' + (err.response?.data?.message || err.message)
        } else if (!err.response) {
          errorMsg += 'Cannot connect to server.'
        } else {
          errorMsg += err.response?.data?.message || err.message
        }
        
        alert(errorMsg)
      }
    }

    return {
      formatCurrency,
      monthlySpent,
      monthlyRemain,
      averageMonthly,
      budgetDialog,
      budgetInput,
      openDialog,
      saveBudget
    }
  }
}
</script>

<style scoped>
.budget-window {
  width: 375px;
  background-color: #2c2c2c;
  border-radius: 8px;
  color: #fff;
  padding: 12px;
  box-shadow: rgba(0, 0, 0, 0.1) 0px 4px 6px -1px, rgba(0, 0, 0, 0.06) 0px 2px 4px -2px;
}
.budget-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 6px;
}
.budget-window h3 {
  margin: 0;
  font-size: 24px;
  font-weight: 600;
}
.budget-amount {
  font-size: 18px;
  font-weight: 500;
  color: #4caf50;
}
.budget-action {
  margin-left: auto;
}
.budget-amount.not-set {
  color: #999;
  font-style: italic;
  font-size: 14px;
}
.budget-body {
  min-height: 40px;
  border: 1px dashed rgba(255,255,255,0.2);
  border-radius: 6px;
  display: flex;
  flex-direction: column;
  align-items: stretch;
  padding: 8px;
}
.budget-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 12px;
  font-size: 15px;
  line-height: 1.6;
  min-height: 44px;
}
.budget-row .label {
  color: #bbb;
}
.budget-row .value {
  font-weight: 600;
}
.budget-row .value.negative {
  color: #f55a5a;
}
.budget-row .value.red {
  color: #f55a5a;
}
.budget-row .value.green {
  color: #4caf50;
}
.budget-dialog-card {
  background-color: #2c2c2c;
  color: #fff;
}
</style>
