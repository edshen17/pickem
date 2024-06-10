<!-- RoleSelect.vue -->
<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { formatRole } from '~/utils/formatter/role'

interface Role {
  id: number
  name: string
}

const emit = defineEmits<{
  (e: 'update:modelValue', value: string | null): void
}>()

const supabase = useSupabaseClient()

const selectedRole = ref<string | null>(null)
const roles = ref<Role[]>([])

function emitSelectedRole(value: string | null) {
  emit('update:modelValue', value)
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
  <q-select
    v-model="selectedRole"
    :options="roles"
    :option-label="(role) => formatRole(role.name)"
    option-value="id"
    emit-value
    map-options
    filled
    dense
    label="Role"
    @update:model-value="emitSelectedRole"
  />
</template>
