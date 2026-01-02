<template>
  <div class="my-loans-container">
    <div class="title-row">
      <h2>My Loans</h2>
      <button class="primary-btn" @click="toNewLoan">Apply new Loan</button>
    </div>

    <div class="loans-container">
      <div class="table-card" v-if="loans.length">
        <table class="jeffrey">
          <thead>
            <tr>
              <th>Amount</th>
              <th>Start Date</th>
              <th>End Date</th>
              <th>Next Payment</th>
              <th>Frequency</th>
              <th>Term</th>
              <th>Status</th>
            </tr>
          </thead>

          <tbody>
            <tr
              v-for="item in loans"
              :key="item.id"
              class="loan-item"
              @click="toLoanDetail(item.id)"
            >
              <td>${{ item.amount }}</td>
              <td>{{ item.start_date ? new Date(item.start_date).toLocaleDateString() : '-' }}</td>
              <td>{{ item.end_date ? new Date(item.end_date).toLocaleDateString() : '-' }}</td>
              <td>
                {{
                  item.next_payment_date
                    ? new Date(item.next_payment_date).toLocaleDateString()
                    : '-'
                }}
              </td>
              <td>{{ item.frequency }}</td>
              <td>{{ formattedTerm(item.term, item.frequency) }}</td>

              <td :class="`status status-${item.status}`">{{ item.status }}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <p v-else>No previous loan history.</p>
    </div>
  </div>
</template>

<script>
import loanSrv from '@/services/loan.js'

export default {
  data() {
    return {
      loans: [],
    }
  },

  computed: {},

  methods: {
    async init() {
      this.loans = await loanSrv.getCustomerLoans()
      console.log(this.loans)
    },
    formattedTerm(term, freq) {
      const unit = {
        monthly: 'Months',
        weekly: 'Weeks',
        biweekly: 'Weeks',
      }
      return `${freq != 'biweekly' ? term : term * 2} ${unit[freq]}`
    },
    toLoanDetail(loanId) {
      this.$router.push({ name: 'my-loans-view', params: { id: loanId } })
    },
    toNewLoan() {
      this.$router.push({ name: 'my-loans-apply' })
    },
  },

  created() {
    this.init()
  },
}
</script>

<style scoped>
.loan-item {
  cursor: pointer;
}

.loan-item:hover {
  transition: all ease-in 0.04s;
  background-color: rgb(48, 48, 48);
}
</style>
