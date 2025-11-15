<template>
  <v-text-field :label="label" ref="inputRef"></v-text-field>
</template>

<script>
import { watch } from 'vue'
import { watchDebounced } from '@vueuse/core'
import { useCurrencyInput } from 'vue-currency-input'

export default {
  name: 'CurrencyInput',
  props: {
    label: String,
    modelValue: Number,
    options: Object,
  },
  setup(props) {
    const { inputRef, setOptions, setValue, numberValue } = useCurrencyInput(props.options)

    // watchDebounced(numberValue, (value) => emit('update:modelValue', value), { debounce: 1000 })

    watch(
      () => props.modelValue,
      (value) => {
        setValue(value)
      },
    )

    watch(
      () => props.options,
      (options) => {
        setOptions(options)
      },
    )
    return { inputRef }
  },
}
</script>
