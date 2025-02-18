<script setup lang="ts">
import type { IPrizeAllocation } from '~/view-models/pool'

const props = defineProps<{
  maxNumberOfPlayers: number
  entryFee: number
  numberOfWinners: number
  prizeAllocation: IPrizeAllocation
  poolManagerAllocation: number
  currency: string
  numberOfEntries: number
}>()

const currencySymbols: { [key: string]: string } = {
  USD: '$',
  CNY: '¥',
}

const numberOfPlayers = props.numberOfEntries > 0 ? props.numberOfEntries : props.maxNumberOfPlayers

const totalPool = computed(() => numberOfPlayers * props.entryFee)

const totalManagementPercentage = computed(() => {
  const fixedFeesPercentage = Object.values(fees).reduce((sum, fee) => sum + fee, 0) + props.poolManagerAllocation / 100
  return (fixedFeesPercentage * 100)
})

const totalManagementAmount = computed(() => {
  const fixedFeesAmount = Object.values(fees).reduce((sum, fee) => sum + calculateFeeAmount(fee), 0)
  return fixedFeesAmount + calculatePoolManagerAmount()
})

const remainingPercentage = computed(() => 100 - totalManagementPercentage.value)
const remainingAmount = computed(() => totalPool.value - totalManagementAmount.value)

const prizePositions = computed(() => {
  return Array.from({ length: props.numberOfWinners }, (_, index) => {
    const place = index + 1
    const percentage = props.prizeAllocation[place] || 0
    return {
      place,
      percentage,
      amount: calculatePrizeAmount(percentage),
    }
  })
})

function formatFeeLabel(key: string): string {
  return feeLabels[key] || key
}

function formatMoney(amount: number): string {
  const symbol = currencySymbols[props.currency]
  const roundedAmount = Math.round(amount * 100) / 100
  return `${symbol}${roundedAmount.toLocaleString('en-US')}`
}

function calculatePrizeAmount(percentage: number): number {
  return (remainingAmount.value * percentage) / 100
}

function formatPercentage(value: number): string {
  return `${Math.round(value * 100) / 100}%`
}

function calculateFeeAmount(feePercentage: number): number {
  return totalPool.value * feePercentage
}

function calculatePoolManagerAmount(): number {
  return (totalPool.value * props.poolManagerAllocation) / 100
}
</script>

<template>
  <div class="u-max-w-2xl u-w-full">
    <table class="u-mb-4 u-w-full u-border-collapse">
      <tbody>
        <tr class="u-border">
          <td class="u-w-[60%] u-p-2">
            Players
          </td>
          <td class="u-w-[40%] u-p-2 u-text-right">
            {{ numberOfPlayers }}
          </td>
        </tr>
        <tr class="u-border">
          <td class="u-w-[60%] u-p-2">
            Entry Fee
          </td>
          <td class="u-w-[40%] u-p-2 u-text-right">
            {{ formatMoney(entryFee) }}
          </td>
        </tr>
        <tr class="u-border u-bg-gray-100 u-font-medium">
          <td class="u-w-[60%] u-p-2 u-font-bold">
            Total Pool
          </td>
          <td class="u-w-[40%] u-p-2 u-text-right">
            {{ formatMoney(totalPool) }}
          </td>
        </tr>
      </tbody>
    </table>

    <table class="u-mb-4 u-w-full u-border-collapse">
      <thead>
        <tr class="u-bg-gray-100">
          <th class="u-w-[60%] u-border u-p-2 u-text-left">
            Fees
          </th>
          <th class="u-w-[20%] u-border u-p-2 u-text-right">
            %
          </th>
          <th class="u-w-[20%] u-border u-p-2 u-text-right">
            Amount
          </th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(value, key) in fees" :key="key" class="u-border">
          <td class="u-w-[60%] u-p-2">
            {{ formatFeeLabel(key) }}
          </td>
          <td class="u-w-[20%] u-p-2 u-text-right">
            {{ formatPercentage(value * 100) }}
          </td>
          <td class="u-w-[20%] u-p-2 u-text-right">
            {{ formatMoney(calculateFeeAmount(value)) }}
          </td>
        </tr>
        <tr class="u-border">
          <td class="u-w-[60%] u-p-2">
            Pool Manager (Admin)
          </td>
          <td class="u-w-[20%] u-p-2 u-text-right">
            {{ formatPercentage(poolManagerAllocation) }}
          </td>
          <td class="u-w-[20%] u-p-2 u-text-right">
            {{ formatMoney(calculatePoolManagerAmount()) }}
          </td>
        </tr>
        <tr class="u-border u-bg-gray-100 u-font-bold">
          <td class="u-w-[60%] u-p-2">
            Management Total
          </td>
          <td class="u-w-[20%] u-p-2 u-text-right">
            {{ formatPercentage(totalManagementPercentage) }}
          </td>
          <td class="u-w-[20%] u-p-2 u-text-right">
            {{ formatMoney(totalManagementAmount) }}
          </td>
        </tr>
      </tbody>
    </table>

    <table class="u-mb-4 u-w-full u-border-collapse">
      <tbody>
        <tr class="u-border u-bg-gray-100 u-font-bold">
          <td class="u-w-[60%] u-p-2">
            Remaining for Prize Pool
          </td>
          <td class="u-w-[20%] u-p-2 u-text-right">
            {{ formatPercentage(remainingPercentage) }}
          </td>
          <td class="u-w-[20%] u-p-2 u-text-right">
            {{ formatMoney(remainingAmount) }}
          </td>
        </tr>
      </tbody>
    </table>

    <table class="u-w-full u-border-collapse">
      <thead>
        <tr class="u-bg-gray-100">
          <th class="u-w-[60%] u-border u-p-2 u-text-left">
            Prize Position
          </th>
          <th class="u-w-[20%] u-border u-p-2 u-text-right">
            %
          </th>
          <th class="u-w-[20%] u-border u-p-2 u-text-right">
            Amount
          </th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="position in prizePositions" :key="position.place" class="u-border">
          <td class="u-w-[60%] u-p-2">
            <!-- TODO: change to be consistent with 1st, 2nd place? -->
            Winner {{ position.place }}
          </td>
          <td class="u-w-[20%] u-p-2 u-text-right">
            {{ formatPercentage(position.percentage) }}
          </td>
          <td class="u-w-[20%] u-p-2 u-text-right">
            {{ formatMoney(position.amount) }}
          </td>
        </tr>
        <tr class="u-border u-bg-gray-100 u-font-bold">
          <td class="u-w-[60%] u-p-2">
            Prize Pool Total
          </td>
          <td class="u-w-[20%] u-p-2 u-text-right">
            100%
          </td>
          <td class="u-w-[20%] u-p-2 u-text-right">
            {{ formatMoney(remainingAmount) }}
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
