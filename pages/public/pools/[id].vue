<script setup lang="ts">
import { ref } from 'vue'
import type { ICTTFPlayer } from '~/view-models/player'
import { playerColumns as columns } from '~/components/data-table/columns'

const currentRoute = useCurrentRoute()

// TODO: type
const { data } = await useFetchApi(`/api/pools/${(currentRoute.value.params as any).id}/tournament`)

const selectedPlayers = ref<ICTTFPlayer[]>([])
const page = ref(0)
const isSubmittingPicks = ref(false)

async function onNext() {
  if (page.value === 0)
    page.value += 1
  else
    await onSubmit()
}

function onBack() {
  page.value -= 1
}

async function onSubmit() {
  isSubmittingPicks.value = true
  $fetch('/api/picks', { method: 'POST', body: {
    poolId: (currentRoute.value.params as any).id,
    playerIds: selectedPlayers.value.map(p => p.id),
  } }).then(async () => {
    NotificationManager.success('Picks submitted')
  }).catch(() => {
    NotificationManager.error()
  }).finally(() => {
    isSubmittingPicks.value = false
  })
}

const isDragging = ref(false)
</script>

<template>
  <div v-if="data" class="lg:py-8 u-mx-auto u-w-11/12 u-min-h-screen-md u-py-6 lg:u-w-10/12 u-space-y-6 md:u-pb-8">
    <div class="u-flex u-items-center u-justify-between">
      <div class="u-font-bold">
        <p class="u-text-xl">
          {{ data.tournament.title }} - {{ data.event.title }}
        </p>
        <p class="u-text-lg">
          {{ page === 0 ? `Remaining picks: ${data.numberOfPicks - selectedPlayers.length}` : 'Picks in order' }}
        </p>
      </div>
    </div>
    <PlayerSelectionTable
      v-show="page === 0"
      v-model:selected="selectedPlayers"
      :rows="data.event.players as ICTTFPlayer[]"
      :number-of-picks="data.numberOfPicks"
    />
    <q-markup-table v-show="page === 1">
      <thead>
        <tr>
          <th class="q-table--col-auto-width" />
          <th
            v-for="column in columns"
            :key="column.name"
            :class="column.classes ?? 'text-left'"
          >
            {{ column.label }}
          </th>
        </tr>
      </thead>
      <draggable
        v-model="selectedPlayers"
        tag="tbody"
        class="u-cursor-move"
        @start="isDragging = true"
        @end="isDragging = false"
      >
        <transition-group type="transition" name="flip-list">
          <tr
            v-for="row in selectedPlayers"
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
    <div class="flex u-my-5 u-space-x-3">
      <q-space />
      <q-btn v-show="page === 1" color="secondary" flat label="Back" @click="onBack" />
      <q-btn :class="{ invisible: data.numberOfPicks !== selectedPlayers.length }" color="primary" :label="page === 0 ? 'Next' : 'Submit'" :loading="isSubmittingPicks" @click="onNext" />
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
