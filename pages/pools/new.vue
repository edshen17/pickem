<script setup lang="ts">
definePageMeta({
  requiresAuth: true,
})

// const { user: piniaUser } = storeToRefs(useUserStore())
const isPrivateLeague = ref(false)
// row items-center q-gutter-x-lg u-justify-between lg:u-justify-initial
const parentClass = 'row items-center u-justify-between lg:u-flex-row lg:u-justify-initial'

const $q = useQuasar()
console.log($q.dark.isActive)
</script>

<template>
  <div class="u-mx-auto u-w-11/12 lg:u-my-5 lg:u-w-7/12 md:u-w-9/12">
    <p class="u-pt-4 u-text-xl u-font-bold">
      Pool settings
    </p>
    <q-form class="u-w-full">
      <div :class="parentClass">
        <div class="u-w-36">
          Private League
        </div>
        <div class="q-gutter-x-lg">
          <q-radio v-model="isPrivate" val="yes" label="Yes" />
          <q-radio v-model="isPrivate" val="no" label="No" />
        </div>
        <!-- <q-input v-model="email" class="u-w-full md:u-w-initial">
          <template #before>
            <p class="u-m-0 u-flex u-flex-col u-justify-between u-text-base u-text-black">
              Password to join:
            </p>
          </template>
        </q-input> -->
        <div :class="`${parentClass} u-hidden! lg:u-inline-flex!`">
          <div class="u-w-44">
            Password to join:
          </div>
          <q-input v-model="email" />
        </div>
      </div>
      <div :class="`${parentClass} lg:u-hidden!`">
        <div class="u-w-44">
          Password to join:
        </div>
        <q-input v-model="email" />
      </div>
      <div :class="parentClass">
        <div class="u-w-36">
          Publicly watchable
        </div>
        <div class="q-gutter-x-lg">
          <q-radio v-model="isPrivate" val="yes" label="Yes" />
          <q-radio v-model="isPrivate" val="no" label="No" />
        </div>
      </div>
      <div :class="parentClass">
        <div class="u-w-44">
          Max number of players
        </div>
        <q-input v-model="email" />
      </div>
      <div :class="parentClass">
        <div class="u-w-44">
          Number of picks
        </div>
        <q-input v-model="email" />
      </div>
      <div>
        <q-btn label="Submit" type="submit" color="primary" />
        <q-btn label="Reset" type="reset" color="primary" flat class="q-ml-sm" />
      </div>
    </q-form>
  </div>
</template>
