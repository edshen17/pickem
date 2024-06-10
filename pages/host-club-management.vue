<script setup lang="ts">
import type { QTableProps } from 'quasar'
import { formatRole } from '~/utils/formatter/role'
import { emailValidator } from '~/validators/user'

const loading = ref(true)
const isInviteModalOpen = ref(false)
const invitedEmail = ref('')
const isValidEmail = ref(true)
const errorMessage = ref('')
const selectedRoleId = ref<string | null>(null)

// sort by owner, then name
const { data } = await useFetch<any[]>('/api/host-clubs').then((res) => {
  loading.value = false
  return res
})

const { user: piniaUser } = storeToRefs(useUserStore())

const columns: QTableProps['columns'] = [
  {
    name: 'name',
    label: 'Name',
    align: 'left',
    field: 'name',
    sortable: true,
  },
  {
    name: 'role',
    label: 'Role',
    align: 'left',
    field: 'role',
    sortable: true,
    format: v => formatRole(v),
  },
  {
    name: 'email',
    label: 'Email',
    align: 'left',
    field: 'email',
    sortable: true,
  },
]

// refactor to be generic
function validateEmail() {
  try {
    emailValidator.parse(invitedEmail.value)
    isValidEmail.value = true
    errorMessage.value = ''
  }
  catch (error: any) {
    isValidEmail.value = false
    errorMessage.value = error.issues[0].message
  }
}

const rows = computed(() => {
  const selectedHostClubId = piniaUser.value?.host_club?.id
  const selectedHostClub = data.value?.find(club => club.id === selectedHostClubId)
  return selectedHostClub ? selectedHostClub.host_club_members : []
})
</script>

<template>
  <div class="lg:py-8 u-mx-auto u-w-11/12 u-min-h-screen-md u-py-6 lg:u-w-10/12 u-space-y-6 md:u-pb-8">
    <div class="u-flex u-items-center u-justify-between">
      <p class="u-text-xl u-font-bold">
        Host Club Management
      </p>
      <p>{{ piniaUser?.host_club?.name }}</p>
    </div>
    <q-table
      :loading="loading"
      :dense="$q.screen.lt.md"
      flat bordered
      title="Members"
      :rows="rows"
      :columns="columns"
      row-key="name"
    >
      <template #top>
        <span class="u-text-lg">Members</span>
        <q-space />
        <q-btn color="primary" icon="person_add_alt" label="Invite" @click="isInviteModalOpen = true" />
      </template>
    </q-table>
    <q-dialog v-model="isInviteModalOpen">
      <q-card style="min-width: 350px">
        <q-card-section>
          <div class="u-text-lg">
            Invite members to your team
          </div>
        </q-card-section>

        <q-card-section class="q-pt-sm">
          <q-input
            v-model="invitedEmail"
            class="q-mb-sm" filled dense label="Email address" :error="!isValidEmail"
            :error-message="errorMessage"
            @blur="validateEmail"
          />
          <RoleSelect v-model="selectedRoleId" />
        </q-card-section>

        <q-card-actions align="right" class="text-primary">
          <q-btn v-close-popup flat label="Cancel" />
          <q-btn v-close-popup flat label="Send invite" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>
