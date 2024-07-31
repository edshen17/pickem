<script setup lang="ts">
import { ref } from 'vue'
import type { IPlayerView } from '~/view-models/player'
import { playerColumns as columns } from '~/components/data-table/columns'

const selected = ref<IPlayerView[]>([])
const numberOfSelections = 3
const page = ref(0)

const rows: Ref<IPlayerView[]> = ref([
  {
    id: '1',
    lastName: 'CLAFLIN',
    firstName: 'STEVE',
    rank: 1,
    rating: 2000,
    order: 1,
  },
  {
    id: '2',
    lastName: 'FLEMMING',
    firstName: 'FLASH',
    rank: 2,
    rating: 2100,
    order: 2,
  },
  {
    id: '3',
    lastName: 'SHEN',
    firstName: 'EDWIN',
    rank: 3,
    rating: 1900,
    order: 3,
  },
  {
    id: '4',
    lastName: 'BAGGALEY',
    firstName: 'ANDREW',
    rank: 4,
    rating: 1800,
    order: 4,
  },
  {
    id: '5',
    lastName: 'A',
    firstName: 'X',
    rank: 5,
    rating: 10,
    order: 5,
  },
])

function onSubmit() {
  page.value += 1
}

function onBack() {
  page.value -= 1
}

const isDragging = ref(false)
</script>

<template>
  <div class="q-pa-md">
    <!-- add pool description, prizes, etc -->
    <div class="q-mb-md u-text-lg u-font-bold">
      <p v-if="page === 0">
        Remaining picks: {{ numberOfSelections - selected.length }}
      </p>
      <p v-else>
        Picks in order
      </p>
    </div>
    <PlayerSelectionTable
      v-show="page === 0"
      v-model:selected="selected"
      :rows="rows"
      :number-of-selections="numberOfSelections"
    />
    <!-- TODO: refactor into own component -->
    <q-markup-table v-show="page === 1">
      <thead>
        <tr>
          <th class="q-table--col-auto-width" />
          <th
            v-for="column in columns"
            :key="column.name"
            :class="column.classes || 'text-left'"
          >
            {{ column.label }}
          </th>
        </tr>
      </thead>
      <draggable
        v-model="selected"
        tag="tbody"
        class="u-cursor-move"
        @start="isDragging = true"
        @end="isDragging = false"
      >
        <transition-group type="transition" name="flip-list">
          <tr
            v-for="row in selected"
            :key="row.id"
          >
            <td class="u-w-16 u-text-center lg:u-w-18">
              <q-icon name="drag_handle" />
            </td>
            <td
              v-for="column in columns"
              :key="column.name"
              class="text-left"
            >
              {{ row[column.field as string] }}
            </td>
          </tr>
        </transition-group>
      </draggable>
    </q-markup-table>
    <div class="flex u-my-5">
      <q-space />
      <q-btn v-show="page === 1" color="primary" label="Back" @click="onBack" />
      <q-btn v-show="page === 0" :class="{ invisible: numberOfSelections !== selected.length }" color="primary" label="Submit" @click="onSubmit" />
    </div>
  </div>
</template>

<style>
.flip-list-move {
  transition: transform 0.5s;
}
.no-move {
  transition: transform 0s;
}
</style>
