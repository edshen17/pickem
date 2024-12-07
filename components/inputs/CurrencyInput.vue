<script setup lang="ts">
import { watch } from 'vue'
import { useCurrencyInput } from 'vue-currency-input'

const props = defineProps<{
  modelValue: number
  currency: string
  error?: boolean
  errorMessage?: string
  disable?: boolean
  readonly?: boolean
}>()

const emit = defineEmits(['update:modelValue'])

const {
  inputRef,
  formattedValue,
  numberValue,
  setValue,
  setOptions,
} = useCurrencyInput({ currency: props.currency })

watch(() => props.modelValue, (value) => {
  setValue(value)
})

watch(() => props.currency, (currency) => {
  setOptions({ currency })
})

watch(numberValue, (value) => {
  emit('update:modelValue', value)
})
</script>

<template>
  <q-input
    ref="inputRef"
    v-model="formattedValue"
    :error-message="errorMessage"
    :error="error"
    :disable="disable"
    :readonly="readonly"
  />
</template>
