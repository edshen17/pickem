<script setup lang="ts">
import { useForm } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'
import type { IPoolView } from '~/view-models/pool'

import type { PoolValidator } from '~/validators/pool'
import { poolValidator } from '~/validators/pool'
import { supportedCurrencies } from '~/utils/currency'
import { formatDate } from '~/utils/formatter/date'

const { pool } = defineProps<{
  pool?: IPoolView
  // TODO: use loading/skeletons
  loading?: boolean
}>()

const router = useRouter()

const parentClass = 'row items-center u-justify-between lg:u-flex-row lg:u-justify-initial'
const textClass = 'u-w-full u-mb-2 lg:u-w-64 lg:u-mb-0'
const titleClass = `u-pt-4 u-text-xl u-font-bold`
const inlineParentClass = 'u-ml-10 items-center u-hidden! lg:u-inline-flex!'
const inlineChildClass = 'u-mr-8 u-w-18'
const inputWidth = 'u-w-full lg:u-w-64'

const loadingTournaments = ref(true)
const isSaving = ref(false)

const { handleSubmit, values, setFieldValue, defineField, setValues } = useForm<PoolValidator>({
  validationSchema: toTypedSchema(poolValidator),
})

onMounted(async () => {
  if (pool) {
    const { isPrivateLeague, prizeAllocation, password, entryStartDate, ...rest } = pool
    setValues({ ...rest, auth: { isPrivateLeague, password: password ?? `` }, numberOfWinners: getObjectLength(prizeAllocation), prizeAllocation, entryStartDate: formatDate(entryStartDate, 'YYYY/MM/DD') })
  }
})

const { data: tournaments } = await useFetchApi('/api/tournaments').then((res) => {
  loadingTournaments.value = false
  return res
})

const [isPrivateLeague, isPrivateLeagueProps] = defineField('auth.isPrivateLeague', quasarConfig)
const [password, passwordProps] = defineField('auth.password', quasarConfig)
const [isPubliclyWatchable, isPubliclyWatchableProps] = defineField('isPubliclyWatchable', quasarConfig)
const [maxNumberOfPlayers, maxNumberOfPlayersProps] = defineField('maxNumberOfPlayers', quasarConfig)
const [numberOfPicks, numberOfPicksProps] = defineField('numberOfPicks', quasarConfig)
const [entryFee, entryFeeProps] = defineField('entryFee', quasarConfig)
const [currency, currencyProps] = defineField('currency', quasarConfig)
const [numberOfWinners, numberOfWinnersProps] = defineField('numberOfWinners', quasarConfig)
const [prizeAllocation, prizeAllocationProps] = defineField('prizeAllocation', quasarConfig)
const [ownerAllocation, ownerAllocationProps] = defineField('poolAllocation.owner', quasarConfig)
const [adminAllocation, adminAllocationProps] = defineField('poolAllocation.admin', quasarConfig)
const [tournamentId, tournamentIdProps] = defineField('tournamentId', quasarConfig)
const [eventId, eventIdProps] = defineField('eventId', quasarConfig)
const [entryStartDate, entryStartDateProps] = defineField('entryStartDate', quasarConfig)
const [name, nameProps] = defineField('name', quasarConfig)

const selectedTournament = computed(() => {
  return tournaments.value?.find(t => t.id === tournamentId.value)
})

const events = computed(() => {
  return selectedTournament.value?.events ?? []
})

const selectedEvent = computed(() => {
  return events.value.find(e => e.id === eventId.value)!
})

const entryEndDate = computed(() => {
  return formatDate(selectedEvent.value?.start_date, 'YYYY/MM/DD')
})

const winnerRange = computed(() => {
  return Array.from({ length: numberOfWinners.value }, (_, i) => i + 1)
})

const readOnly = computed(() => {
  const startDate = pool?.entryStartDate
  return startDate ? isDateBeforeToday(startDate) : false
})

function getOrdinal(n: number) {
  const suffixes = ['th', 'st', 'nd', 'rd']
  const v = n % 100
  return suffixes[(v - 20) % 10] || suffixes[v] || suffixes[0]
}

const onSubmit = handleSubmit(async (values) => {
  isSaving.value = true
  const { path: routePath, params } = router.currentRoute.value
  // TODO: correctly type params
  const path = routePath.includes('new') ? 'new' : (params as any).id
  await $fetch(`/api/pools/${path}`, { method: 'POST', body: values }).then(async (id) => {
    router.replace({ path: `/pools/${id}` })
    NotificationManager.success('Pool saved')
  }).catch(() => {
    NotificationManager.error()
  }).finally(() => {
    isSaving.value = false
  })
})

watch(numberOfWinners, (newValue) => {
  const newAllocation = Object.fromEntries(
    Array.from({ length: newValue }, (_, index) => {
      const position = index + 1
      return [position, prizeAllocation.value[position]]
    }),
  )
  setFieldValue('prizeAllocation', newAllocation)
})

watch(tournamentId, () => {
  const newEvent = events.value?.[0]
  setFieldValue('eventId', newEvent.id)
})
</script>

<template>
  <!-- TODO: add loading state? -->
  <div class="u-mx-auto u-w-11/12 u-pb-6">
    <div v-if="readOnly" class="q-pa-md q-gutter-sm">
      <q-banner inline-actions class="text-white bg-yellow-9">
        You can't make changes to a pool if entries have started.
      </q-banner>
    </div>
    <div class="u-mx-auto u-px-4 u-pt-4 u-container">
      <q-form class="u-w-full u-space-y-4" @submit="onSubmit">
        <p :class="titleClass">
          Tournament & Event settings
        </p>
        <div :class="parentClass">
          <div :class="textClass">
            ICTTF tournament
          </div>
          <q-select
            v-model="tournamentId"
            option-value="id"
            option-label="title"
            emit-value
            map-options
            :class="inputWidth"
            :options="tournaments"
            :loading="loadingTournaments"
            v-bind="tournamentIdProps"
            :disable="readOnly"
            :readonly="readOnly"
          />
        </div>
        <div :class="parentClass">
          <div :class="textClass">
            ICTTF event
          </div>
          <q-select
            v-model="eventId"
            option-value="id"
            option-label="title"
            emit-value
            map-options
            :class="inputWidth"
            :options="events"
            v-bind="eventIdProps"
            :disable="readOnly"
            :readonly="readOnly"
          />
        </div>
        <p :class="titleClass">
          Pool settings
        </p>
        <div :class="parentClass">
          <div :class="textClass">
            Name
          </div>
          <q-input
            v-model="name" v-bind="nameProps" :class="inputWidth" :disable="readOnly" :readonly="readOnly"
          />
        </div>
        <div :class="parentClass">
          <div :class="textClass">
            Private League
          </div>
          <div class="q-gutter-x-lg lg:u-w-56">
            <q-radio v-model="isPrivateLeague" :val="true" label="Yes" v-bind="isPrivateLeagueProps" :disable="readOnly" :readonly="readOnly" />
            <q-radio v-model="isPrivateLeague" :val="false" label="No" v-bind="isPrivateLeagueProps" :disable="readOnly" :readonly="readOnly" />
          </div>
          <div v-if="isPrivateLeague" :class="inlineParentClass">
            <div :class="inlineChildClass">
              Password
            </div>
            <q-input v-model="password" v-bind="passwordProps" :class="inputWidth" :disable="readOnly" :readonly="readOnly" />
          </div>
        </div>
        <div v-if="isPrivateLeague" :class="`${parentClass} lg:u-hidden!`">
          <div :class="textClass">
            Password
          </div>
          <q-input v-model="password" v-bind="passwordProps" :disable="readOnly" :readonly="readOnly" />
        </div>
        <div :class="parentClass">
          <div :class="textClass">
            Publicly watchable
          </div>
          <div class="q-gutter-x-lg">
            <q-radio v-model="isPubliclyWatchable" :val="true" label="Yes" v-bind="isPubliclyWatchableProps" :disable="readOnly" :readonly="readOnly" />
            <q-radio v-model="isPubliclyWatchable" :val="false" label="No" v-bind="isPubliclyWatchableProps" :disable="readOnly" :readonly="readOnly" />
          </div>
        </div>
        <div :class="parentClass">
          <div :class="textClass">
            Max number of players
          </div>
          <q-input v-model="maxNumberOfPlayers" v-bind="maxNumberOfPlayersProps" :class="inputWidth" :disable="readOnly" :readonly="readOnly" />
        </div>
        <div :class="parentClass">
          <div :class="textClass">
            Number of picks
          </div>
          <q-input v-model="numberOfPicks" v-bind="numberOfPicksProps" :class="inputWidth" :disable="readOnly" :readonly="readOnly" />
        </div>
        <div :class="parentClass">
          <div :class="textClass">
            Entry fee
          </div>
          <div :class="parentClass">
            <currency-input :disable="readOnly" :readonly="readOnly" :class="inputWidth" :model-value="entryFee" :currency="values.currency" v-bind="entryFeeProps" @update:model-value="(v) => { setFieldValue('entryFee', v) }" />
          </div>
          <div :class="inlineParentClass">
            <div :class="inlineChildClass">
              Currency
            </div>
            <q-select v-model="currency" class="u-w-50" :options="supportedCurrencies" v-bind="currencyProps" :disable="readOnly" :readonly="readOnly" />
          </div>
        </div>
        <div :class="`${parentClass} lg:u-hidden!`">
          <div :class="textClass">
            Currency
          </div>
          <q-select v-model="currency" :class="inputWidth" :options="supportedCurrencies" v-bind="currencyProps" :disable="readOnly" :readonly="readOnly" />
        </div>
        <div :class="parentClass">
          <div :class="textClass">
            Entry start date
          </div>
          <q-input v-model="entryStartDate" filled mask="date" :rules="['date']" v-bind="entryStartDateProps" :class="inputWidth" :disable="readOnly" :readonly="readOnly">
            <template #append>
              <q-icon name="event" class="cursor-pointer">
                <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                  <q-date v-model="entryStartDate">
                    <div class="row items-center justify-end">
                      <q-btn v-close-popup label="Close" color="primary" flat />
                    </div>
                  </q-date>
                </q-popup-proxy>
              </q-icon>
            </template>
          </q-input>
        </div>
        <div :class="parentClass">
          <div :class="textClass">
            Entry close date
          </div>
          <q-input v-model="entryEndDate" :class="inputWidth" disable readonly />
        </div>
        <p :class="titleClass">
          Prize settings
        </p>
        <div :class="parentClass">
          <div :class="textClass">
            Number of winners
          </div>
          <q-input v-model="numberOfWinners" :class="inputWidth" v-bind="numberOfWinnersProps" type="number" :disable="readOnly" :readonly="readOnly" />
        </div>
        <div v-for="n in winnerRange" :key="n" :class="parentClass">
          <div :class="textClass">
            Prize {{ n }}{{ getOrdinal(n) }} Place (%)
          </div>
          <q-input v-model="prizeAllocation[n]" :class="inputWidth" type="number" v-bind="prizeAllocationProps" :disable="readOnly" :readonly="readOnly" />
        </div>
        <div :class="parentClass">
          <div :class="textClass">
            Owner allocation to prizes (%)
          </div>
          <q-input v-model="ownerAllocation" :class="inputWidth" v-bind="ownerAllocationProps" :disable="readOnly" :readonly="readOnly" />
        </div>
        <div :class="parentClass">
          <div :class="textClass">
            Admin allocation to prizes (%)
          </div>
          <q-input v-model="adminAllocation" :class="inputWidth" v-bind="adminAllocationProps" :rules="[val => val <= 7.5 && val >= 0 || 'Must be less than or equal to 7.5%', val => val >= 0 || 'Must be greater than or equal to 0%']" :disable="readOnly" :readonly="readOnly" />
        </div>
        <!-- TODO: make sticky and float right -->
        <div>
          <q-btn v-if="!readOnly" label="Save" type="submit" color="primary" />
        </div>
      </q-form>
    </div>
  </div>
</template>
