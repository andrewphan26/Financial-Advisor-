<template>
  <div class="pie-chart-wrapper" v-if="transactions.length > 0">
    <Pie :data="chartData" :options="chartOptions" />
  </div>
</template>

<script>
import { computed } from 'vue'
import { Pie } from 'vue-chartjs'
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js'
import { toCurrency } from '@/utils/formatters'

ChartJS.register(ArcElement, Tooltip, Legend)

export default {
  components: { Pie },
  props: {
    transactions: {
      type: Array,
      required: true,
      default: () => []
    }
  },
  setup(props) {
    // Compute spending by category
    const categoryBreakdown = computed(() => {
      const breakdown = {}
      props.transactions.forEach((tx) => {
        breakdown[tx.category] = (breakdown[tx.category] || 0) + tx.amount
      })
      return breakdown
    })

    const chartData = computed(() => ({
      labels: Object.keys(categoryBreakdown.value),
      datasets: [
        {
          label: 'Spending by Category',
          data: Object.values(categoryBreakdown.value),
          backgroundColor: [
            'rgba(255, 99, 132, 0.7)',
            'rgba(54, 162, 235, 0.7)',
            'rgba(255, 206, 86, 0.7)',
            'rgba(75, 192, 192, 0.7)',
            'rgba(153, 102, 255, 0.7)',
            'rgba(255, 159, 64, 0.7)',
          ],
          borderColor: [
            'rgba(255, 99, 132, 1)',
            'rgba(54, 162, 235, 1)',
            'rgba(255, 206, 86, 1)',
            'rgba(75, 192, 192, 1)',
            'rgba(153, 102, 255, 1)',
            'rgba(255, 159, 64, 1)',
          ],
          borderWidth: 1,
        },
      ],
    }))

    const chartOptions = {
      responsive: true,
      maintainAspectRatio: true,
      plugins: {
        legend: {
          position: 'bottom',
          labels: {
            font: { size: 10 },
            color: '#fff',
          },
        },
        tooltip: {
          callbacks: {
            label: function (context) {
              const label = context.label || ''
              const value = context.parsed || 0
              const total = context.dataset.data.reduce((a, b) => a + b, 0)
              const percentage = total ? ((value / total) * 100).toFixed(1) : '0.0'
              return `${label}: ${toCurrency(value)} (${percentage}%)`
            },
          },
        },
      },
    }

    return { 
      chartData, 
      chartOptions
    }
  },
}
</script>

<style scoped>
.pie-chart-wrapper {
  width: 375px;
  height: 375px;
  background-color: #2c2c2c;
  border-radius: 8px;
  padding: 12px;
  box-shadow: rgba(0, 0, 0, 0.1) 0px 4px 6px -1px, rgba(0, 0, 0, 0.06) 0px 2px 4px -2px;
}
</style>
