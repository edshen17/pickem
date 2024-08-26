<script setup lang="ts">
import { computed, ref } from 'vue'
import { playerColumns as columns } from '~/components/data-table/columns'
import type { ICTTFPlayer } from '~/view-models/player'

const props = defineProps<{
  rows: ICTTFPlayer[]
  numberOfPicks: number
}>()

const emit = defineEmits<{
  (e: 'update:selected', value: ICTTFPlayer[]): void
}>()

const initialPagination = {
  rowsPerPage: 100,
}

const selected = ref<ICTTFPlayer[]>([])

const isSelectionDisabled = computed(() => {
  return selected.value.length >= props.numberOfPicks
})

function toggleSelection(row: ICTTFPlayer) {
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
        :model-value="selected.some(item => item.id === scope.row.id)"
        :disable="isSelectionDisabled && !selected.some(item => item.id === scope.row.id)"
        @update:model-value="toggleSelection(scope.row)"
      />
    </template>
  </q-table>
</template>
