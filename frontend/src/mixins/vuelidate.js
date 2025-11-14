import { useVuelidate } from '@vuelidate/core'

export default {
  data() {
    return {
      v$: useVuelidate(rules, state),
    }
  },
}
