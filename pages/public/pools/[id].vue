<script setup lang="ts">
import { computed, ref } from 'vue'
import { playerColumns as columns } from '~/components/data-table/columns'
import type { IPickView, IPoolPlayer, IPoolWithTournamentAndPicks } from '~/view-models/pool'

const currentRoute = useCurrentRoute()

const poolWithTournamentAndPicks = ref<IPoolWithTournamentAndPicks>()

const selectedPlayers = ref<IPoolPlayer[]>([])
const submittedPicks = ref<IPickView[]>([])
const page = ref(0)
const isSubmittingPicks = ref(false)

onMounted(async () => {
  const data = await $fetch(`/api/pools/${(currentRoute.value.params as any).id}/tournament`) as unknown as IPoolWithTournamentAndPicks
  const { event } = data
  const { players } = event
  poolWithTournamentAndPicks.value = { ...data, event: { ...event, players: players.sort((a, b) => Number(b.rating) - Number(a.rating))
    .map((player, index) => ({
      ...player,
      rank: index + 1,
    })) } }
  submittedPicks.value = poolWithTournamentAndPicks.value.picks
})

const remainingPicks = computed(() => {
  return (poolWithTournamentAndPicks.value?.numberOfPicks ?? 0) - selectedPlayers.value.length
})

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
  try {
    const pickToEdit = submittedPicks.value.find(pick =>
      pick.playerIds.length === selectedPlayers.value.length
      && pick.playerIds.every(id => selectedPlayers.value.some(p => p.id === id)),
    )

    const response = await $fetch('/api/picks', {
      method: 'POST',
      body: {
        id: pickToEdit?.id,
        poolId: (currentRoute.value.params as any).id,
        playerIds: selectedPlayers.value.map(p => p.id),
      },
    }) as IPickView

    if (pickToEdit) {
      const index = submittedPicks.value.findIndex(p => p.id === pickToEdit.id)
      if (index !== -1) {
        submittedPicks.value[index] = response
      }
    }
    else {
      submittedPicks.value.push(response)
    }

    selectedPlayers.value = []
    NotificationManager.success('Picks submitted')
    page.value = 0
  }
  catch {
    NotificationManager.error('Failed to submit picks')
  }
  finally {
    isSubmittingPicks.value = false
  }
}

function editPicks(pick: IPickView) {
  selectedPlayers.value = poolWithTournamentAndPicks.value?.event.players.filter(p => pick.playerIds.includes(p.id)) ?? []
  submittedPicks.value = submittedPicks.value.filter(p => p.id !== pick.id)
  page.value = 0
}

async function deletePicks(pick: IPickView) {
  try {
    await $fetch(`/api/picks/${pick.id}`, {
      method: 'DELETE',
    })
    submittedPicks.value = submittedPicks.value.filter(p => p.id !== pick.id)
    NotificationManager.success('Pick deleted')
  }
  catch {
    NotificationManager.error('Failed to delete pick')
  }
}

const isDragging = ref(false)
</script>

<template>
  <div v-if="poolWithTournamentAndPicks" class="lg:py-8 u-mx-auto u-w-11/12 u-min-h-screen-md u-py-6 lg:u-w-10/12 u-space-y-6 md:u-pb-8">
    <div class="u-flex u-items-center u-justify-between">
      <div class="u-font-bold">
        <p class="u-text-xl">
          {{ poolWithTournamentAndPicks.tournament.title }} - {{ poolWithTournamentAndPicks.event.title }}
        </p>

        <p class="u-text-lg">
          {{ page === 0 ? `Remaining picks: ${remainingPicks}` : 'Picks in order' }}
        </p>
      </div>
    </div>
    <div v-if="submittedPicks.length > 0">
      <p class="u-text-xl u-font-bold">
        Your picks
      </p>
      <div v-for="pick in submittedPicks" :key="pick.id" class="u-mb-2 u-flex u-items-center u-justify-between u-border-1 u-border-[rgba(255,255,255,0.28)] u-border-rounded">
        <p class="u-m-3">
          {{ poolWithTournamentAndPicks.event.players.filter(p => pick.playerIds.includes(p.id)).map(player => player.name).join(', ') }}
        </p>
        <p class="u-m-3 u-text-xl u-space-x-2">
          <q-icon name="edit" class="u-cursor-pointer" @click="editPicks(pick)" />
          <q-icon name="delete" class="u-cursor-pointer" @click="deletePicks(pick)" />
        </p>
      </div>
    </div>
    <PlayerSelectionTable
      v-show="page === 0"
      :initial-selected="selectedPlayers"
      :rows="poolWithTournamentAndPicks.event.players"
      :number-of-picks="poolWithTournamentAndPicks.numberOfPicks"
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
              {{ (row as any)[column.field as string] }}
            </td>
          </tr>
        </transition-group>
      </draggable>
    </q-markup-table>
    <div class="flex u-my-5 u-space-x-3">
      <q-space />
      <q-btn v-show="page === 1" color="secondary" flat label="Back" @click="onBack" />
      <q-btn :class="{ invisible: poolWithTournamentAndPicks.numberOfPicks !== selectedPlayers.length }" color="primary" :label="page === 0 ? 'Next' : 'Submit'" :loading="isSubmittingPicks" @click="onNext" />
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
