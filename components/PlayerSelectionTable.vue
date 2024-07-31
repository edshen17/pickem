<script setup lang="ts">
import { computed, ref } from 'vue'
import { playerColumns as columns } from '~/components/data-table/columns'
import type { IPlayerView } from '~/view-models/player'

const props = defineProps<{
  rows: IPlayerView[]
  numberOfSelections: number
}>()

const emit = defineEmits<{
  (e: 'update:selected', value: IPlayerView[]): void
}>()

const initialPagination = {
  rowsPerPage: 100,
}

const selected = ref<IPlayerView[]>([])

const isSelectionDisabled = computed(() => {
  return selected.value.length >= props.numberOfSelections
})

function toggleSelection(row: IPlayerView) {
  const index = selected.value.findIndex(item => item.id === row.id)
  if (index === -1) {
    if (selected.value.length < props.numberOfSelections) {
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
        :model-value="selected.some(item => item.id === scope.row.id)"
        :disable="isSelectionDisabled && !selected.some(item => item.id === scope.row.id)"
        @update:model-value="toggleSelection(scope.row)"
      />
    </template>
  </q-table>
</template>
