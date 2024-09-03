<script setup lang="ts">
import type { QTableProps } from 'quasar'
import { computed, ref, watch } from 'vue'
import { playerColumns as columns } from '~/components/data-table/columns'
import type { IPoolPlayer } from '~/view-models/pool'

const props = defineProps<{
  rows: IPoolPlayer[]
  numberOfPicks: number
  initialSelected: IPoolPlayer[]
}>()

const emit = defineEmits<{
  (e: 'update:selected', value: IPoolPlayer[]): void
}>()

const initialPagination: QTableProps['pagination'] = {
  rowsPerPage: 100,
  sortBy: 'rating',
  descending: true,
}

const selected = ref<IPoolPlayer[]>(props.initialSelected)

// Watch for changes in initialSelected prop
watch(() => props.initialSelected, (newValue) => {
  selected.value = newValue
}, { immediate: true })

const isSelectionDisabled = computed(() => {
  return selected.value.length >= props.numberOfPicks
})

function toggleSelection(row: IPoolPlayer) {
  const index = selected.value.findIndex(item => item.id === row.id)
  if (index === -1) {
    if (selected.value.length < props.numberOfPicks) {
      selected.value.push(row)
      emit('update:selected', selected.value)
    }
  }
  else {
    selected.value.splice(index, 1)
    emit('update:selected', selected.value)
  }
}
</script>

<template>
  <q-table
    :dense="$q.screen.lt.md"
    :pagination="initialPagination"
    :rows="rows"
    :columns="columns"
    row-key="id"
    :selected="selected"
    selection="multiple"
  >
    <template #header-selection />
    <template #body-selection="scope">
      <q-checkbox
        :model-value="scope.selected"
        :disable="isSelectionDisabled && !scope.selected"
        @update:model-value="toggleSelection(scope.row)"
      />
    </template>
  </q-table>
</template>
