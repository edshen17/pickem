<script setup lang="ts">
import { useForm } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'

import type { PoolValidator } from '~/validators/pool'
import { poolValidator } from '~/validators/pool'

definePageMeta({
  requiresAuth: true,
})

const parentClass = 'row items-center u-justify-between lg:u-flex-row lg:u-justify-initial'
const textClass = 'u-w-44 lg:u-w-64'
const titleClass = `u-pt-4 u-text-xl u-font-bold`
const inlineParentClass = 'u-ml-10 items-center u-hidden! lg:u-inline-flex!'
const inlineChildClass = 'u-mr-8 u-w-18'

const { handleSubmit, values, setFieldValue, defineField } = useForm<PoolValidator>({
  // TODO: set initialValues from saved pool
  validationSchema: toTypedSchema(poolValidator),
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
const [poolAllocation] = defineField('poolAllocation', quasarConfig)

const isSaving = ref(false)

const winnerRange = computed(() => {
  return Array.from({ length: numberOfWinners.value }, (_, i) => i + 1)
})

function getOrdinal(n: number) {
  const suffixes = ['th', 'st', 'nd', 'rd']
  const v = n % 100
  return suffixes[(v - 20) % 10] || suffixes[v] || suffixes[0]
}

const onSubmit = handleSubmit((values) => {
  isSaving.value = true
  $fetch('/api/pools/add', { method: 'POST', body: values }).then(async () => {
    NotificationManager.success('Pool saved')
    // redirect to id if new
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
            <currency-input :model-value="entryFee" :currency="values.currency" v-bind="entryFeeProps" />
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
          <!-- TODO: use zod validator by separating owner and admin into separate fields -->
          <q-input v-model="poolAllocation.owner" />
        </div>
        <div :class="parentClass">
          <div :class="textClass">
            Admin allocation to prizes (%)
          </div>
          <q-input v-model="poolAllocation.admin" :rules="[val => val <= 7.5 && val >= 0 || 'Must be less than or equal to 7.5%', val => val >= 0 || 'Must be greater than or equal to 0%']" />
        </div>
        <!-- TODO: make sticky and float right -->
        <div>
          <q-btn label="Save" type="submit" color="primary" />
        </div>
      </q-form>
    </div>
  </div>
</template>
