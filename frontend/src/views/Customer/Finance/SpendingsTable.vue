<template>
  <div class="container spendings">
    <div class="spendings-header">
      <h2>My Spendings</h2>
      <v-btn class="new-spending-btn" color="primary" size="small" @click="onNewSpending"
        >New spending</v-btn
      >
    </div>

    <div class="summary">
      <div>
        Total spent: <strong>{{ formatCurrency(totalSpent) }}</strong>
      </div>
      <div>
        Transactions: <strong>{{ transactions.length }}</strong>
      </div>
    </div>

    <v-divider class="my-4"></v-divider>

    <v-sheet class="transactions-list">
      <v-row class="table-header">
        <v-col cols="3" class="header-cell">Date</v-col>
        <v-col cols="3" class="header-cell">Category</v-col>
        <v-col cols="3" class="header-cell">Sub Category</v-col>
        <v-col cols="3" class="header-cell amount">Amount</v-col>
      </v-row>
      <v-row
        v-for="tx in transactions"
        :key="tx.id"
        class="transaction clickable"
        @click="onEditSpending(tx.id)"
      >
        <v-col cols="3">{{ tx.date }}</v-col>
        <v-col cols="3">{{ tx.category }}</v-col>
        <v-col cols="4">{{ tx.sub_category }}</v-col>
        <v-col cols="2" class="amount">{{ formatCurrency(tx.amount) }}</v-col>
      </v-row>
      <div v-if="transactions.length === 0" class="empty">No transactions available</div>
    </v-sheet>
  </div>
</template>

<script>
import { computed } from 'vue'
import { toCurrency } from '@/utils/formatters'

export default {
  props: {
    transactions: {
      type: Array,
      required: true,
      default: () => [],
    },
  },
  emits: ['new-spending', 'edit-spending'],
  setup(props, { emit }) {
    const formatCurrency = (v) => toCurrency(v)

    const totalSpent = computed(() => props.transactions.reduce((s, t) => s + t.amount, 0))

    const onNewSpending = () => emit('new-spending')
    const onEditSpending = (id) => emit('edit-spending', id)

    return {
      formatCurrency,
      totalSpent,
      onNewSpending,
      onEditSpending,
    }
  },
}
</script>

<style scoped>
.spendings {
  padding: 10px 16px;
  width: 1080px; /* width: 80vw; */
  max-width: none;
  box-sizing: border-box;
  position: sticky;
  bottom: 24px;
  left: 0;
  /* margin-left: calc(-50vw + 50% + 350px); */
  z-index: 40;
  border-radius: 0;
}
.spendings-header {
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  align-items: center;
  width: 100%;
}
.spendings-header h2 {
  grid-column: 2;
  justify-self: center;
}
.new-spending-btn {
  grid-column: 3;
  justify-self: end;
}
.summary {
  display: flex;
  justify-content: space-between;
  margin-bottom: 4px;
  align-items: center;
  font-size: 14px;
  gap: 4px;
}

.spendings h2 {
  font-size: 24px;
  margin: 0 0 10px 0;
  font-weight: 600;
}

.spendings .v-divider {
  margin: 2px 0;
  height: 1px;
}

.transactions-list {
  width: 100%;
  max-height: 20vh;
  overflow-y: auto;
}

.table-header {
  position: sticky;
  top: 0;
  background-color: #1a1a1a;
  color: white;
  font-weight: 600;
  font-size: 14px;
  padding: 4px 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
}

.header-cell {
  padding: 4px 3px !important;
}

.header-cell:first-child {
  margin-right: 30px;
  margin-left: 10px;
}

.header-cell.amount {
  margin-left: -100px;
}

.transactions-list .transaction {
  padding: 4px 3px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.06);
  font-size: 14px;
}

.transactions-list .transaction.clickable {
  cursor: pointer;
  transition: background-color 0.2s;
}

.transactions-list .transaction.clickable:hover {
  background-color: rgba(255, 255, 255, 0.05);
}

.transactions-list .transaction > .v-col:first-child {
  margin-right: 30px;
}
.amount {
  text-align: right;
  margin-left: -80px;
}
.empty {
  padding: 20px;
  text-align: center;
  color: #666;
}
</style>
