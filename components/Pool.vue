<script setup lang="ts">
import { useForm } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'
import type { IPoolView } from '~/view-models/pool'

import type { PoolValidator } from '~/validators/pool'
import { poolValidator } from '~/validators/pool'

const { pool } = defineProps<{
  pool?: IPoolView
  // TODO: use loading/skeletons
  loading?: boolean
}>()

const route = useRoute('pools-id')
const router = useRouter()

const parentClass = 'row items-center u-justify-between lg:u-flex-row lg:u-justify-initial'
const textClass = 'u-w-44 lg:u-w-64'
const titleClass = `u-pt-4 u-text-xl u-font-bold`
const inlineParentClass = 'u-ml-10 items-center u-hidden! lg:u-inline-flex!'
const inlineChildClass = 'u-mr-8 u-w-18'

const { handleSubmit, values, setFieldValue, defineField, setValues } = useForm<PoolValidator>({
  validationSchema: toTypedSchema(poolValidator),
})

onMounted(() => {
  if (pool) {
    const { isPrivateLeague, password, ...rest } = pool
    setValues({ ...rest, auth: { isPrivateLeague, password: password ?? `` } })
  }
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

const isSaving = ref(false)

const winnerRange = computed(() => {
  return Array.from({ length: numberOfWinners.value }, (_, i) => i + 1)
})

function getOrdinal(n: number) {
  const suffixes = ['th', 'st', 'nd', 'rd']
  const v = n % 100
  return suffixes[(v - 20) % 10] || suffixes[v] || suffixes[0]
}

const onSubmit = handleSubmit(async (values) => {
  isSaving.value = true
  const path = route.path.includes('new') ? 'new' : route.params.id
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
</script>

<template>
  <div class="u-mx-auto u-w-11/12 u-pb-6">
    <div class="u-mx-auto u-px-4 u-pt-4 u-container">
      <p :class="titleClass">
        Pool settings
      </p>
      <q-form class="u-w-full u-space-y-4" @submit="onSubmit">
        <div :class="parentClass">
          <div :class="textClass">
            Private League
          </div>
          <div class="q-gutter-x-lg lg:u-w-56">
            <q-radio v-model="isPrivateLeague" :val="true" label="Yes" v-bind="isPrivateLeagueProps" />
            <q-radio v-model="isPrivateLeague" :val="false" label="No" v-bind="isPrivateLeagueProps" />
          </div>
          <div v-if="isPrivateLeague" :class="inlineParentClass">
            <div :class="inlineChildClass">
              Password
            </div>
            <q-input v-model="password" v-bind="passwordProps" class="u-w-50" />
          </div>
        </div>
        <div v-if="isPrivateLeague" :class="`${parentClass} lg:u-hidden!`">
          <div :class="textClass">
            Password
          </div>
          <q-input v-model="password" v-bind="passwordProps" />
        </div>
        <div :class="parentClass">
          <div :class="textClass">
            Publicly watchable
          </div>
          <div class="q-gutter-x-lg">
            <q-radio v-model="isPubliclyWatchable" :val="true" label="Yes" v-bind="isPubliclyWatchableProps" />
            <q-radio v-model="isPubliclyWatchable" :val="false" label="No" v-bind="isPubliclyWatchableProps" />
          </div>
        </div>
        <div :class="parentClass">
          <div :class="textClass">
            Max number of players
          </div>
          <q-input v-model="maxNumberOfPlayers" v-bind="maxNumberOfPlayersProps" />
        </div>
        <div :class="parentClass">
          <div :class="textClass">
            Number of picks
          </div>
          <q-input v-model="numberOfPicks" v-bind="numberOfPicksProps" />
        </div>
        <div :class="parentClass">
          <div :class="textClass">
            Entry fee
          </div>
          <div :class="parentClass">
            <currency-input :model-value="entryFee" :currency="values.currency" v-bind="entryFeeProps" @update:model-value="(v) => { setFieldValue('entryFee', v) }" />
          </div>
          <div :class="inlineParentClass">
            <div :class="inlineChildClass">
              Currency
            </div>
            <q-select v-model="currency" class="u-w-50" :options="supportedCurrencies" v-bind="currencyProps" />
          </div>
        </div>
        <div :class="`${parentClass} lg:u-hidden!`">
          <div :class="textClass">
            Currency
          </div>
          <q-select v-model="currency" class="u-w-50" :options="supportedCurrencies" v-bind="currencyProps" />
        </div>
        <p :class="titleClass">
          Prize settings
        </p>
        <div :class="parentClass">
          <div :class="textClass">
            Number of winners
          </div>
          <q-input v-model="numberOfWinners" v-bind="numberOfWinnersProps" type="number" />
        </div>
        <div v-for="n in winnerRange" :key="n" :class="parentClass">
          <div :class="textClass">
            Prize {{ n }}{{ getOrdinal(n) }} Place (%)
          </div>
          <q-input v-model="prizeAllocation[n]" type="number" v-bind="prizeAllocationProps" />
        </div>
        <div :class="parentClass">
          <div :class="textClass">
            Owner allocation to prizes (%)
          </div>
          <q-input v-model="ownerAllocation" v-bind="ownerAllocationProps" />
        </div>
        <div :class="parentClass">
          <div :class="textClass">
            Admin allocation to prizes (%)
          </div>
          <q-input v-model="adminAllocation" v-bind="adminAllocationProps" :rules="[val => val <= 7.5 && val >= 0 || 'Must be less than or equal to 7.5%', val => val >= 0 || 'Must be greater than or equal to 0%']" />
        </div>
        <!-- TODO: make sticky and float right -->
        <div>
          <q-btn label="Save" type="submit" color="primary" />
        </div>
      </q-form>
    </div>
  </div>
</template>
