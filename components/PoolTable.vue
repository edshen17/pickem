<script setup lang="ts">
import { computed, ref } from 'vue'
import type { SerializeObject } from 'nitropack'
import { toTitleCase } from '~/utils/formatter/string'
import { poolColumns as columns } from '~/components/data-table/columns'
import { type IPoolListView, PoolStatus } from '~/view-models/pool'

const { rows } = defineProps<{
  rows: SerializeObject<IPoolListView>[]
}>()

const currentRoute = useCurrentRoute()

const expanded = ref(Object.values(PoolStatus))

const initialPagination = {
  rowsPerPage: 50,
}

const isPublic = computed(() => {
  return currentRoute.value.fullPath.includes('public')
})

const groupedRows = computed(() => {
  // TODO: type items as row
  const groups: { [key: string]: { status: string, items: any[] } } = {}
  rows?.forEach((row) => {
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

const isExpanded = (status: PoolStatus) => expanded.value.includes(status)

function toggleExpand(status: PoolStatus) {
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
        {{ isPublic ? 'PickEm Pools' : 'Pool Management' }}
      </p>
    </div>
    <q-table
      :rows="groupedRows"
      :columns="columns"
      row-key="status"
      :dense="$q.screen.lt.md"
      :pagination="initialPagination"
    >
      <template #top>
        <q-space />
        <q-btn v-if="$router.currentRoute.value.name !== 'public-pools'" color="primary" icon="add" label="New pool" @click="$router.push('/pools/new')" />
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
              <template v-if="col.name === 'name'">
                <NuxtLink :to="`${isPublic ? '/public' : ''}/pools/${item.id}`" class="u-link">
                  {{ item[col.field] }}
                </NuxtLink>
              </template>
              <template v-else>
                {{ col.field !== undefined ? item[col.field] : '' }}
              </template>
            </q-td>
          </q-tr>
        </template>
      </template>
    </q-table>
  </div>
</template>
