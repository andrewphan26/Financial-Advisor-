<template>
  <div class="spendings-wrapper">
    <div class="top-cards">
      <SpendingChart :transactions="transactions" />
      <BudgetCard 
        :transactions="transactions" 
        :monthly-budget="monthlyBudget"
        @budget-updated="handleBudgetUpdate"
      />
    </div>

    <SpendingsTable 
      :transactions="transactions"
      @new-spending="goToNewSpending"
      @edit-spending="editSpending"
    />
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import spendingSrv from '@/services/spending'
import SpendingChart from './SpendingChart.vue'
import BudgetCard from './BudgetCard.vue'
import SpendingsTable from './SpendingsTable.vue'

export default {
  components: { 
    SpendingChart,
    BudgetCard,
    SpendingsTable
  },
  setup() {
    const router = useRouter()
    const transactions = ref([])
    const monthlyBudget = ref(null)

    const load = async () => {
      try {
        const res = await spendingSrv.getSpendings()
        transactions.value = res
      } catch (err) {
        console.error('Failed to load spendings', err)
        transactions.value = []
      }
    }

    const loadBudget = async () => {
      try {
        const budget = await spendingSrv.getMonthlyBudget()
        monthlyBudget.value = budget
      } catch (err) {
        console.error('Failed to load monthly budget', err)
        monthlyBudget.value = null
      }
    }

    const goToNewSpending = () => {
      router.push('/customer/spendings/new')
    }

    const editSpending = (id) => {
      router.push(`/customer/spendings/${id}/edit`)
    }

    const handleBudgetUpdate = (newBudget) => {
      monthlyBudget.value = newBudget
    }

    onMounted(() => {
      load()
      loadBudget()
    })

    return { 
      transactions, 
      monthlyBudget,
      goToNewSpending,
      editSpending,
      handleBudgetUpdate
    }
  },
}
</script>

<style scoped>
.spendings-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
  padding-bottom: 400px;
}

.top-cards {
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  justify-content: center;
  gap: 16px;
  flex-wrap: wrap;
  width: 100%;
}
</style>
