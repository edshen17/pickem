<script setup lang="ts">
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

const isToken = computed(() => props.currency === 'ICTTF Token')

const {
  inputRef,
  formattedValue,
  numberValue,
  setValue,
  setOptions,
} = useCurrencyInput({ currency: isToken.value ? 'USD' : props.currency })

watch(() => props.modelValue, (value) => {
  setValue(value)
})

watch(() => props.currency, (currency) => {
  if (!isToken.value) {
    setOptions({ currency })
  }
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
    :prefix="isToken ? 'ICTTF' : undefined"
  />
</template>
