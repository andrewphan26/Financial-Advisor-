<template>
  <!-- centered card -->
  <div class="loan-card" v-if="loanInfo !== null">
    <div class="title-row">
      <h1 class="loan-id">ID: {{ loanInfo.id }}</h1>
      <span class="loan-title">Loan Details</span>
      <span :class="`loan-status badge ${loanInfo.status}`">{{ loanInfo.status }}</span>
    </div>

    <!-- 3-way layout INSIDE the card -->
    <div class="loan-layout">
      <!-- LEFT: users -->
      <section class="left users-panel">
        <h2 class="section-title">Users</h2>

        <div class="user-card">
          <h3>Customer</h3>
          <p>Name: {{ loanInfo.customer_fullname }}</p>
        </div>

        <div class="user-card">
          <h3>Analyst</h3>
          <p>Name: {{ loanInfo.analyst_fullname }}</p>
        </div>
      </section>

      <!-- RIGHT: top + bottom -->
      <section class="right">
        <!-- top right: loan amounts -->
        <section class="top-right loan-info">
          <div class="loan-info-header">
            <h2 class="section-title">Loan Info</h2>
          </div>

          <div class="subsection-layout">
            <div class="info-side left-side">
              <div class="subsection-title">Remaining Amount</div>
              <div class="value-pill">$ {{ remainingAmount }}</div>
            </div>

            <div class="info-divider"></div>

            <div class="info-side right-side">
              <div class="metric-row">
                <span class="label">Start Amount:</span>
                <span class="value">{{ loanInfo.amount }}</span>
              </div>

              <div class="metric-row">
                <span class="label">Interest Rate:</span>
                <span class="value">{{ loanInfo.interest }}%</span>
              </div>

              <div class="metric-row">
                <span class="label">Term:</span>
                <span class="value">{{ formattedTerm(loanInfo.term, loanInfo.frequency) }}</span>
              </div>
            </div>
          </div>
        </section>

        <!-- bottom right: dates -->
        <section class="bottom-right key-dates">
          <div class="key-dates-header">
            <h2 class="section-title">Key Dates</h2>
          </div>

          <div class="subsection-layout">
            <div class="info-side left-side">
              <div class="subsection-title">Next Payment</div>
              <div class="value-pill">
                {{ new Date(loanInfo.next_payment_date).toLocaleDateString() }}
              </div>
            </div>

            <div class="info-divider"></div>

            <div class="info-side right-side">
              <div class="metric-row">
                <span class="label">Start Date:</span>
                <span class="value">{{ new Date(loanInfo.start_date).toLocaleDateString() }}</span>
              </div>

              <div class="metric-row">
                <span class="label">End Date:</span>
                <span class="value">{{ new Date(loanInfo.end_date).toLocaleDateString() }}</span>
              </div>

              <div class="metric-row">
                <span class="label">Frequency:</span>
                <span class="value">{{ loanInfo.frequency }}</span>
              </div>
            </div>
          </div>
        </section>
      </section>
    </div>

    <div class="actions">
      <button class="primary-btn" @click="toDashboard()">Back to Dashboard</button>
      <div class="pay-actions">
        <button class="primary-btn mr-6 due" @click="toDashboard()">
          Pay due ( ${{ nextPaymentAmount }} )
        </button>
        <button class="primary-btn all" @click="toDashboard()">Pay all</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.loan-card {
  max-width: 1000px;
}

.title-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 6px;
  margin-bottom: 5px;
}

.loan-title {
  font-size: 32px;
  margin-bottom: 24px;
}

.loan-id {
  font-size: 18px;
  margin-bottom: 24px;
}

.loan-status {
  display: inline-block;
  margin-bottom: 24px;
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 14px;
  color: #fff;
}

/* 3-way layout inside card */
.loan-layout {
  display: flex;
  gap: 24px;
}

/* left half */
.left {
  flex: 1;
  max-width: 250px;
  background: rgba(255, 255, 255, 0.02);
  border-radius: 6px;
  padding: 16px;
  box-sizing: border-box;
}

/* right half (top + bottom) */
.right {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

/* Main 2-column layout */
.subsection-layout {
  display: flex;
  align-items: center;
  gap: 24px;
}

.info-side {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

/* right sections */
.top-right,
.bottom-right {
  flex: 1;
  background: rgba(255, 255, 255, 0.02);
  border-radius: 6px;
  padding: 16px;
  box-sizing: border-box;
}

.metric-row {
  display: flex;
  font-size: 15px;
}

/* Divider */
.info-divider {
  width: 50px;
  background: #ffffff;
  height: 100%;
  border-radius: 2px;
}

/* small cards, rows, etc. */
.user-card {
  margin-top: 8px;
  padding: 10px 12px;
  border-radius: 6px;
  background: rgba(0, 0, 0, 0.25);
}

.info-row {
  display: flex;
  margin-bottom: 6px;
  font-size: 14px;
}

.section-title {
  margin-bottom: 12px;
  font-size: 18px;
  border-bottom: 1px solid #444;
  padding-bottom: 6px;
}

.subsection-title {
  font-size: 16px;
  font-weight: bold;
  text-align: center;
}

.value-pill {
  height: 70px;
  background: #666; /* placeholder color */
  border-radius: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 20px;
  color: white;
}

.label {
  width: 100px;
  color: #aaa;
}

.value {
  color: #fff;
}

/* bottom button */
.actions {
  margin-top: 32px;
  display: flex;
  justify-content: space-between;
}

.primary-btn {
  padding: 12px 36px;
  border-radius: 4px;
  border: none;
  background: #ffffff;
  color: #111;
  font-weight: 600;
  cursor: pointer;
}

.due {
  background-color: #dabc5c;
}
.all {
  background-color: #e6774c;
}
</style>

<script>
import loanSrv from '@/services/loan.js'

export default {
  data() {
    return {
      loanInfo: null,
    }
  },
  computed: {
    remainingAmount() {
      return (parseFloat(this.loanInfo.amount) - parseFloat(this.loanInfo.amount_paid)).toFixed(2)
    },
    nextPaymentAmount() {
      if (!this.loanInfo.amount || !this.loanInfo.term || !this.loanInfo.frequency) return 0

      const principal = parseFloat(this.loanInfo.amount)
      if (isNaN(principal)) return 0

      const baseAPR = 0.1
      const multiplier =
        this.loanInfo.frequency === 'weekly'
          ? 1.0
          : this.loanInfo.frequency === 'biweekly'
            ? 1.05
            : 1.1 // monthly

      const termAdjustment = this.loanInfo.term * 0.005
      const finalAPR = baseAPR * multiplier + termAdjustment

      const totalInterest = principal * finalAPR * (this.loanInfo.term / 12)

      const totalToPay = principal + totalInterest

      let numberOfPayments = 0

      if (this.loanInfo.frequency === 'monthly') {
        numberOfPayments = this.loanInfo.term
      } else if (this.loanInfo.frequency === 'weekly') {
        numberOfPayments = this.loanInfo.term
      } else if (this.loanInfo.frequency === 'biweekly') {
        numberOfPayments = this.loanInfo.term * 2
      }
      console.log('numberOfPayments', numberOfPayments)

      if (numberOfPayments <= 0) return 0

      return Number((totalToPay / numberOfPayments).toFixed(2))
    },
  },
  methods: {
    async init() {
      try {
        this.loanInfo = await loanSrv.getLoanInfo(this.$route.params.id)

        console.log(this.loanInfo)
      } catch (error) {}
    },
    toDashboard() {
      this.$router.push({ name: 'my-loans' })
    },
    formattedTerm(term, freq) {
      const unit = {
        monthly: 'Months',
        weekly: 'Weeks',
        biweekly: 'Weeks',
      }
      return `${freq != 'biweekly' ? term : term * 2} ${unit[freq]}`
    },
  },

  created() {
    this.init()
  },
}
</script>
