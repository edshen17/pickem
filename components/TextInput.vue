<script setup lang="ts">
import { toRef } from 'vue'
import { useField } from 'vee-validate'

const props = defineProps({
  type: {
    type: String,
    default: 'text',
  },
  value: {
    type: String,
    default: '',
  },
  name: {
    type: String,
    required: true,
  },
  placeholder: {
    type: String,
    default: '',
  },
  className: {
    type: String,
    default: '',
  },
  showErrorMessage: {
    type: Boolean,
    default: true,
  },
  focused: {
    type: Boolean,
    default: false,
  },
})

const name = toRef(props, 'name')

const {
  value: inputValue,
  errorMessage,
  handleChange,
  handleBlur,
  meta,
} = useField(name, undefined, {
  initialValue: props.value,
})

const hasError = errorMessage || meta.valid
</script>

<template>
  <div class="u-w-full">
    <input
      :id="name"
      :name="name"
      :type="type"
      :value="inputValue"
      :placeholder="placeholder"
      :class="className"
      @change="handleChange"
      @blur="handleBlur"
    >
    <p v-if="showErrorMessage" v-show="errorMessage || meta.valid" :class="hasError ? `u-text-red-400 u-pt-1 u-text-sm` : ``">
      {{ errorMessage }}
    </p>
  </div>
</template>
