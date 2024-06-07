<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { formatRole } from '~/utils/formatter/role'

interface Role {
  id: number
  name: string
}

const { error, errorMessage } = defineProps<{
  error?: boolean | null
  errorMessage?: string
}>()

const emit = defineEmits<{
  (e: 'update:model-value', value: string | null): void
  (e: 'blur'): void
}>()

const supabase = useSupabaseClient()

const selectedRole = ref<string | null>(null)
const roles = ref<Role[]>([])

function updateModelValue(value: string | null) {
  emit('update:model-value', value)
}

async function fetchRoles() {
  const { data, error } = await supabase.from('roles').select('id, name')
  if (error)
    throw error
  else
    roles.value = data || []
}

onMounted(() => {
  fetchRoles()
})
</script>

<template>
  <div>
    <q-select
      v-model="selectedRole"
      :options="roles"
      :option-label="(role) => formatRole(role.name)"
      option-value="id"
      filled dense emit-value map-options
      label="Role"
      :error="error"
      :error-message="errorMessage || 'Please select a role'"
      @update:model-value="updateModelValue"
      @blur="emit('blur')"
    />
  </div>
</template>
