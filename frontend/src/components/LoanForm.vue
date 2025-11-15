<template>
  <div class="container loan-form">
    <v-form class="form">
      <v-container>
        <v-row class="amount">
          <v-col>
            <v-label>Amount</v-label>
            <CurrencyField
              disabled
              v-model="fieldAmount"
              :options="{ currency: 'USD', valueRange: { min: 0, max: 20000 } }"
            />
          </v-col>
        </v-row>

        <v-row class="amount-slider">
          <v-col>
            <v-slider v-model="sliderAmount" :max="20000">
              <template #prepend> $500.00 </template>
              <template #append> $20,000.00 </template>
            </v-slider>
          </v-col>
        </v-row>

        <v-row class="frequency">
          <v-col cols="2">Frequency:</v-col>
          <v-col cols="4">
            <v-select
              :error-messages="v$.frequency.$errors.map((e) => e.$message)"
              v-model="frequency"
              :items="frequencies"
              density="compact"
              label="Frequency"
            ></v-select>
          </v-col>
        </v-row>

        <v-row class="frequency">
          <v-col cols="2">Term:</v-col>
          <v-col>
            <div class="term-items">
              <div
                v-for="(termItem, idx) in termFrequencies"
                :key="idx"
                :class="`term-item ${termItem.label}`"
                @click="onTermSelect(termItem, $event.currentTarget)"
              >
                {{ termItem.label }}
              </div>
            </div>
          </v-col>
        </v-row>

        <v-row class="frequency">
          <v-col cols="3">Total to pay:</v-col>
          <v-col> <b>$9,753.00 (fake for now)</b> </v-col>
        </v-row>
      </v-container>

      <!-- Error feedback -->
      <div class="errors-feedback">
        <div class="error-message" v-if="errorFeedback">{{ errorFeedback }}</div>
      </div>

      <!-- Actions -->
      <div class="actions center">
        <v-btn class="submit btn" @click="onSubmit"> {{ submitBtnText }} </v-btn>
      </div>
    </v-form>
  </div>
</template>

<style>
.loan-form {
  align-self: center;
  margin: auto;
  transform: translateY(-50px);
  padding: 64px 100px;
}

.amount input {
  height: 100px;
  font-size: 48px;
  text-align: center;
}

.amount-slider {
  width: 520px;
}

.term-items {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  column-gap: 15px;
  row-gap: 15px;
}

.term-item {
  text-align: center;
  border-radius: 4px;
  background-color: rgb(219, 219, 219);
  color: black;
  padding: 4px 12px;
  cursor: pointer;
}
.term-item:not(.selected):hover {
  background-color: rgb(206, 206, 206);
}

.term-item.selected {
  background-color: #181818;
  color: white;
}
</style>

<script>
import { useRegister } from '@/stores/register'
import { frequencies, terms } from '@/utils/businessRules'
import CurrencyField from '@/components/CurrencyField.vue'
import { useVuelidate } from '@vuelidate/core'
import { required } from '@vuelidate/validators'

import loanSrv from '@/services/loan'

export default {
  components: {
    CurrencyField,
  },

  props: {
    homepage: false,
    submitBtnText: 'Apply',
  },

  data() {
    return {
      registerStore: useRegister(),

      frequencies,
      terms,
      totalToPay: 50000,

      // Form
      fieldAmount: 1000,
      sliderAmount: 1000,
      frequency: 'monthly',
      term: null,

      // Errors
      errorFeedback: null,
    }
  },

  computed: {
    termFrequencies() {
      return terms[this.frequency]
    },
  },

  validations() {
    return {
      sliderAmount: { required },
      frequency: { required },
      term: { required },
    }
  },

  setup: () => ({ v$: useVuelidate() }),

  methods: {
    async applyLoan() {
      try {
        const res = await loanSrv.applyLoan({
          amount: this.sliderAmount,
          frequency: this.frequency,
          term: this.term,
        })

        // Show success modal
        // wip
      } catch (error) {
        // Show error modal
        this.errorFeedback = error.message
      }
    },
    async onSubmit(vals) {
      this.errorFeedback = null
      const valid = await this.v$.$validate()

      if (valid) {
        if (this.homepage) {
          // Save Loan info in the background if homepage
          this.registerStore.setLoan({
            loan: {
              amount: this.sliderAmount,
              frequency: this.frequency,
              term: this.term,
            },
          })

          // Go to user registration
          this.$router.push('/customer-register')
        } else this.applyLoan()
      }
    },

    cleanTermSelect() {
      // Remove "selected" class from all term items
      const allItems = document.querySelectorAll('.term-item')
      allItems.forEach((item) => item.classList.remove('selected'))

      this.term = null
    },

    onTermSelect(termObj, el) {
      this.cleanTermSelect()

      this.term = termObj.value

      el.classList.add('selected')
    },
  },

  watch: {
    fieldAmount(newVal) {
      if (newVal !== this.sliderAmount) {
        this.sliderAmount = newVal
      }
    },

    sliderAmount(newVal) {
      if (newVal !== this.fieldAmount) {
        this.fieldAmount = newVal
      }
    },

    frequency() {
      this.cleanTermSelect()
    },
  },

  created() {
    if (this.registerStore.hasLoanInProcess) {
      this.fieldAmount = this.registerStore.loan.amount
      this.sliderAmount = this.registerStore.loan.amount
      this.frequency = this.registerStore.loan.frequency
      this.term = this.registerStore.loan.term
    }
  },
}
</script>
