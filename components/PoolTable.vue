<script setup lang="ts">
import { computed, ref } from 'vue'
import { toTitleCase } from '~/utils/formatter/string'
import { poolColumns as columns } from '~/components/data-table/columns'

const expanded = ref(['scheduled', 'started', 'live', 'completed'])

const rows = [
  {
    status: 'scheduled',
    name: 'PPWC SOS',
    host: 'Fronton, MX',
    admin: 'Steve',
    entries: 0,
    donations: 0,
    numberOfWinners: 3,
    openDate: '1-Dec-24',
    closeDate: '1-Jan-25',
  },
  {
    status: 'scheduled',
    name: 'PPWC HOS',
    host: 'Brazil',
    admin: 'Edwin',
    entries: 0,
    donations: 0,
    numberOfWinners: 3,
    openDate: '2-Dec-24',
    closeDate: '2-Jan-25',
  },
  {
    status: 'started',
    name: 'PPWC SOS',
    host: 'Miami',
    admin: 'Bill',
    entries: 50,
    donations: 1000,
    numberOfWinners: 2,
    openDate: '1-Feb-24',
    closeDate: '5-Mar-24',
  },
  {
    status: 'started',
    name: 'PPWC HOS',
    host: 'New York',
    admin: 'Bill',
    entries: 100,
    donations: 2000,
    numberOfWinners: 1,
    openDate: '1-Feb-24',
    closeDate: '7-Mar-24',
  },
  {
    status: 'live',
    name: 'PPWC SOS',
    host: 'Fronton, MX',
    admin: 'Steve',
    entries: 200,
    donations: 4000,
    numberOfWinners: 4,
    openDate: '1-Feb-24',
    closeDate: '29-Feb-24',
  },
  {
    status: 'live',
    name: 'PPWC HOS',
    host: 'Fronton, MX',
    admin: 'Steve',
    entries: 300,
    donations: 6000,
    numberOfWinners: 5,
    openDate: '1-Feb-24',
    closeDate: '29-Feb-24',
  },
  {
    status: 'completed',
    name: 'PPWC SOS',
    host: 'Fronton, MX',
    admin: 'Steve',
    entries: 100,
    donations: 2000,
    numberOfWinners: 3,
    openDate: '1-Feb-24',
    closeDate: '29-Feb-24',
  },
  {
    status: 'completed',
    name: 'PPWC HOS',
    host: 'Fronton, MX',
    admin: 'Steve',
    entries: 500,
    donations: 10000,
    numberOfWinners: 1,
    openDate: '1-Feb-24',
    closeDate: '29-Feb-24',
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
  <div class="lg:py-8 u-mx-auto u-w-11/12 u-min-h-screen-md u-py-6 lg:u-w-10/12 u-space-y-6 md:u-pb-8">
    <div class="u-flex u-items-center u-justify-between">
      <p class="u-text-xl u-font-bold">
        PickEm Pools
      </p>
    </div>
    <q-table
      :rows="groupedRows"
      :columns="columns"
      row-key="status"
      :dense="$q.screen.lt.md"
    >
      <template #top>
        <q-space />
        <q-btn color="primary" icon="add" label="New pool" @click="$router.push('/pools/new')" />
      </template>
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
            <span class="u-mx-4"> {{ toTitleCase(props.row.status) }}</span>
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
  </div>
</template>
