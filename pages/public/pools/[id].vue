<script setup lang="ts">
import { computed, ref } from 'vue'
import { playerColumns as columns, resultColumns } from '~/components/data-table/columns'
import type { IPickView, IPoolPlayer, IPoolWithTournamentAndPicks } from '~/view-models/pool'

const currentRoute = useCurrentRoute()

const poolWithTournamentAndPicks = ref<IPoolWithTournamentAndPicks>()

const selectedPlayers = ref<IPoolPlayer[]>([])
const selectedPickId = ref<string | null>(null)
const submittedPicks = ref<IPickView[]>([])
const page = ref(0)
const isSubmittingPicks = ref(false)
const showPickTable = ref(false)
const isDragging = ref(false)
const bracketName = ref('')
const hasResults = ref(true)

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
  bracketName.value = ``
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

function onCancel() {
  page.value = 0
  showPickTable.value = false
}

function updateSubmittedPicks(submittedPicks: Ref<IPickView[]>, newPick: IPickView): void {
  const existingPick = submittedPicks.value.find(
    pick => pick.id === newPick.id,
  )

  if (existingPick) {
    submittedPicks.value = submittedPicks.value.map(pick =>
      pick.id === newPick.id ? newPick : pick,
    )
  }
  else {
    submittedPicks.value.push(newPick)
  }
}

async function onSubmit() {
  isSubmittingPicks.value = true
  try {
    const response = await $fetch('/api/picks', {
      method: 'POST',
      body: {
        id: selectedPickId.value,
        poolId: (currentRoute.value.params as any).id,
        playerIds: selectedPlayers.value.map(p => p.id),
        bracketName: bracketName.value,
      },
    }) as IPickView
    updateSubmittedPicks(submittedPicks, response)
    selectedPlayers.value = []
    NotificationManager.success('Bracket submitted')
  }
  catch (err: any) {
    NotificationManager.error(err.data.message)
  }
  finally {
    page.value = 0
    isSubmittingPicks.value = false
    showPickTable.value = false
  }
}

function editPicks(pick: IPickView) {
  selectedPlayers.value = poolWithTournamentAndPicks.value?.event.players.filter(p => pick.playerIds.includes(p.id)) ?? []
  selectedPickId.value = pick.id
  page.value = 1
  showPickTable.value = true
  bracketName.value = pick.name
}

async function deletePicks(pick: IPickView) {
  try {
    await $fetch(`/api/picks/${pick.id}`, {
      method: 'DELETE',
    })
    submittedPicks.value = submittedPicks.value.filter(p => p.id !== pick.id)
    NotificationManager.success('Bracket deleted')
  }
  catch {
    NotificationManager.error('Failed to delete bracket')
  }
}

function getNumberOfMatches(players: number): number {
  return Math.ceil(Math.log2(players)) + 1
}

function getPlayerStandings(pick: IPickView) {
  const players = pick.playerIds
    .map(playerId =>
      poolWithTournamentAndPicks.value?.event.players.find(p => p.id === playerId),
    )
    .filter((player): player is IPoolPlayer => player !== undefined)

  const maxPossibleWins = getNumberOfMatches(players.length)

  return players.map((player, index) => {
    const placement = index + 1
    const wins = maxPossibleWins - Math.ceil(Math.log2(placement))
    const pointsPerWin = players.length - index
    const total = pointsPerWin * wins
    const actualWins = poolWithTournamentAndPicks.value?.results?.[player.id] ?? 0
    const actualTotal = actualWins * pointsPerWin
    return {
      name: player.name,
      wins,
      total,
      actualTotal,
    }
  })
}

function getTotalWins(pick: IPickView) {
  return getPlayerStandings(pick).reduce((sum, player) => sum + player.wins, 0)
}

function getTotalPoints(pick: IPickView) {
  return getPlayerStandings(pick).reduce((sum, player) => sum + player.total, 0)
}
</script>

<template>
  <div v-if="poolWithTournamentAndPicks" class="lg:py-8 u-mx-auto u-w-11/12 u-min-h-screen-md u-py-6 lg:u-w-10/12 u-space-y-6 md:u-pb-8">
    <div class="u-flex u-items-center u-justify-between">
      <div class="u-w-full">
        <div class="u-flex u-justify-between">
          <p class="u-text-xl u-font-bold">
            {{ `${poolWithTournamentAndPicks.name ?? `${poolWithTournamentAndPicks.tournament.title} - ${poolWithTournamentAndPicks.event.title}`}` }}
          </p>
        </div>
        <div v-show="submittedPicks.length > 0 && !showPickTable">
          <p class="u-my-8 u-text-xl u-font-bold">
            Your brackets
          </p>
          <div v-for="pick in submittedPicks" :key="pick.id" class="u-mb-4 lg:u-w-150">
            <div class="u-mb-4 u-w-full">
              <div class="u-flex u-items-center u-justify-between">
                <p class="u-text-gray-600 u-font-bold dark:u-text-gray-300">
                  {{ pick.name }}
                </p>
                <div class="u-mb-3 u-flex u-justify-end">
                  <q-btn flat icon="edit" @click="editPicks(pick)" />
                  <q-btn flat icon="delete" @click="deletePicks(pick)" />
                </div>
              </div>
              <q-table
                :dense="true"
                :rows="getPlayerStandings(pick)"
                :columns="hasResults ? resultColumnsWithActual : resultColumns"
                row-key="name"
                :pagination="{ rowsPerPage: 0 }"
                flat
                bordered
              >
                <template #bottom-row>
                  <q-tr>
                    <q-td class="text-weight-bold">
                      Total
                    </q-td>
                    <q-td class="text-weight-bold">
                      {{ getTotalWins(pick) }}
                    </q-td>
                    <q-td v-if="hasResults" class="text-weight-bold">
                      {{ getPlayerStandings(pick).reduce((sum, player) => sum + (player.actualWins ?? 0), 0) }}
                    </q-td>
                    <q-td class="text-weight-bold">
                      {{ getTotalPoints(pick) }}
                    </q-td>
                    <q-td v-if="hasResults" class="text-weight-bold">
                      {{ getPlayerStandings(pick).reduce((sum, player) => sum + (player.actualTotal ?? 0), 0) }}
                    </q-td>
                  </q-tr>
                </template>
              </q-table>
            </div>
          </div>
        </div>
        <q-btn v-show="!showPickTable" color="primary" class="u-my-4" @click="showPickTable = true">
          Submit a new bracket
        </q-btn>
        <div class="u-mt-8 u-text-lg u-font-bold">
          <q-input v-show="showPickTable" v-model="bracketName" label="Bracket name" class="u-my-6" />
          <p v-show="showPickTable">
            {{ page === 0 ? `Remaining picks: ${remainingPicks}` : 'Picks in order' }}
          </p>
        </div>
      </div>
    </div>
    <PlayerSelectionTable
      v-show="page === 0 && showPickTable"
      :initial-selected="selectedPlayers"
      :rows="poolWithTournamentAndPicks.event.players"
      :number-of-picks="poolWithTournamentAndPicks.numberOfPicks"
    />
    <q-markup-table v-show="page === 1 && showPickTable">
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
              <template v-if="column.name === 'points'">
                {{ selectedPlayers.length - selectedPlayers.indexOf(row) }}
              </template>
              <template v-else>
                {{ (row as any)[column.field as string] }}
              </template>
            </td>
          </tr>
        </transition-group>
      </draggable>
    </q-markup-table>
    <div class="flex u-my-5 u-space-x-3">
      <q-space />
      <q-btn v-show="page === 1" color="secondary" flat label="Back" @click="onBack" />
      <q-btn v-show="page >= 0 && showPickTable" color="secondary" label="Cancel" @click="onCancel" />
      <q-btn :class="{ invisible: poolWithTournamentAndPicks.numberOfPicks !== selectedPlayers.length && !showPickTable }" color="primary" :label="page === 0 ? 'Next' : 'Submit'" :loading="isSubmittingPicks" @click="onNext" />
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
