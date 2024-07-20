<script setup lang="ts">
import { computed, ref } from 'vue'
import type { QTableProps } from 'quasar'

const expanded = ref(['scheduled', 'live'])

const columns: QTableProps['columns'] = [
  {
    name: 'name',
    required: true,
    label: 'Status',
    align: 'left',
    field: row => row.name,
    format: val => `${val}`,
    sortable: true,
  },
  { name: 'calories', align: 'left', label: 'Calories', field: 'calories', sortable: true },
  { name: 'fat', align: 'left', label: 'Fat (g)', field: 'fat', sortable: true },
  { name: 'carbs', align: 'left', label: 'Carbs (g)', field: 'carbs' },
  { name: 'protein', align: 'left', label: 'Protein (g)', field: 'protein' },
]

const rows = [
  {
    name: 'Frozen Yogurt',
    calories: 159,
    fat: 6.0,
    carbs: 24,
    protein: 4.0,
    status: 'scheduled',
  },
  {
    name: 'Ice cream sandwich',
    calories: 237,
    fat: 9.0,
    carbs: 37,
    protein: 4.3,
    status: 'live',
  },
  {
    name: 'Eclair',
    calories: 262,
    fat: 16.0,
    carbs: 23,
    protein: 6.0,
    status: 'scheduled',
  },
  {
    name: 'Cupcake',
    calories: 305,
    fat: 3.7,
    carbs: 67,
    protein: 4.3,
    status: 'live',
  },
]

const groupedRows = computed(() => {
  // TODO: type items as row
  const groups: { [key: string]: { status: string, items: any[] } } = {}
  rows.forEach((row) => {
    if (!groups[row.status]) {
      groups[row.status] = {
        status: row.status,
        items: [],
      }
    }
    groups[row.status].items.push(row)
  })
  return Object.values(groups)
})

const isExpanded = (status: string) => expanded.value.includes(status)

function toggleExpand(status: string) {
  const index = expanded.value.indexOf(status)
  if (index === -1)
    expanded.value.push(status)
  else
    expanded.value.splice(index, 1)
}
</script>

<template>
  <q-table
    title="Treats"
    :rows="groupedRows"
    :columns="columns"
    row-key="status"
    :dense="$q.screen.lt.md"
  >
    <template #body="props">
      <q-tr :props="props">
        <q-td auto-width>
          <q-btn
            size="sm"
            color="primary"
            round
            dense
            :icon="isExpanded(props.row.status) ? 'remove' : 'add'"
            @click="toggleExpand(props.row.status)"
          />
          <span class="u-mx-4"> {{ props.row.status }} ({{ props.row.items.length }} {{ `pool${props.row.items.length > 1 ? 's' : ''}` }})</span>
        </q-td>
        <q-td colspan="100%" />
      </q-tr>
      <template v-if="isExpanded(props.row.status)">
        <q-tr v-for="item in props.row.items" :key="item.name">
          <q-td auto-width />
          <q-td v-for="col in props.cols.slice(1)" :key="col.name" :props="props">
            {{ col.field !== undefined ? item[col.field] : '' }}
          </q-td>
        </q-tr>
      </template>
    </template>
  </q-table>
</template>
