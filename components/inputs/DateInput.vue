<script setup lang="ts">
import type { ValidationRule } from 'quasar'
import { ref } from 'vue'
import { formatDate } from '~/utils/formatter/date'

const { modelValue, className, readOnly, disable } = defineProps<{
  modelValue: string
  className?: string
  readOnly?: boolean
  disable?: boolean
  rules?: ValidationRule[]
}>()

const emit = defineEmits(['update:modelValue'])

const mask = ref('##/##/####')
const masked = ref(modelValue)
const standard = ref(formatDate(modelValue, 'YYYY/MM/DD'))
const qDateProxy = ref(null)

watch(() => modelValue, (newVal) => {
  if (newVal !== masked.value) {
    masked.value = newVal
    standard.value = maskedToStandard()
  }
})

function maskedToStandard(): string {
  const parts = masked.value.split('/')
  const [month, day, year] = parts
  return [year, month, day].join('/')
}

function standardToMasked(): string {
  const parts = standard.value.split('/')
  const [year, month, day] = parts
  return [month, day, year].join('/')
}

function onMaskedInput() {
  const newDate = masked.value.length === 0
    ? null
    : masked.value.length === 10
      ? maskedToStandard()
      : standard.value

  if (newDate !== standard.value) {
    standard.value = newDate ?? ``
    emit('update:modelValue', masked.value)
  }
}

function onStandardInput() {
  const newText = !standard.value
    ? ''
    : standardToMasked()

  if (newText !== masked.value) {
    masked.value = newText
    emit('update:modelValue', masked.value)
  }
}
</script>

<template>
  <q-input
    v-model="masked"
    filled
    :mask="mask"
    :class="className"
    :disable="disable"
    :readonly="readOnly"
    v-bind="$attrs"
    :rules="rules"
    @update:model-value="onMaskedInput"
  >
    <template #append>
      <q-icon name="event" class="cursor-pointer">
        <q-popup-proxy
          ref="qDateProxy"
          cover
          transition-show="scale"
          transition-hide="scale"
        >
          <q-date
            v-model="standard"
            @update:model-value="onStandardInput"
          >
            <div class="row items-center justify-end">
              <q-btn
                v-close-popup
                label="Close"
                color="primary"
                flat
              />
            </div>
          </q-date>
        </q-popup-proxy>
      </q-icon>
    </template>
  </q-input>
</template>
