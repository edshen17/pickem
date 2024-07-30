<script setup lang="ts">
import { ref } from 'vue'
import type { IPlayerView } from '~/view-models/player'

const selected = ref<IPlayerView[]>([])
const numberOfSelections = 3

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

}
</script>

<template>
  <div class="q-pa-md">
    <PlayerSelectionTable
      v-model:selected="selected"
      :rows="rows"
      :number-of-selections="numberOfSelections"
    />
    <div class="flex u-my-5">
      <q-space />
      <q-btn :class="{ invisible: numberOfSelections !== selected.length }" color="primary" label="Submit" @click="onSubmit" />
    </div>
  </div>
</template>
