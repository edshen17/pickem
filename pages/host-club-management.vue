<script setup lang="ts">
import { hostClubManagementColumns as columns } from '~/components/data-table/columns'
import { emailValidator } from '~/validators/user'
import { isOwner } from '~/view-models/role'
import type { ITeamMember } from '~/view-models/user'

const { user: piniaUser } = storeToRefs(useUserStore())

// TODO: sort rows by role
// TODO: move table to end after inviting user

const loadingHostClubs = ref(true)
const loadingInvite = ref (false)
const loadingDeactivate = ref(false)
const isInviteModalOpen = ref(false)
const invitedEmail = ref('')
const isValidEmail = ref<boolean | null>(null)
const emailErrorMessage = ref('')
const selectedRoleId = ref<string | null>(null)
const isValidRole = ref<boolean | null>(null)
const isDeactivateModalOpen = ref(false)
const selectedUser = ref<ITeamMember | null>(null)
const initialPagination = {
  rowsPerPage: 10,
}

const { data, refresh } = await useFetchApi('/api/host-clubs').then((res) => {
  loadingHostClubs.value = false
  return res
})

const rows = computed(() => {
  const selectedHostClubId = piniaUser.value?.host_club?.id
  const selectedHostClub = data.value?.find(club => club.id === selectedHostClubId)
  return selectedHostClub ? selectedHostClub.host_club_members : []
})

// refactor to be generic
function validateEmail() {
  try {
    emailValidator.parse(invitedEmail.value)
    isValidEmail.value = true
    emailErrorMessage.value = ''
  }
  catch (error: any) {
    isValidEmail.value = false
    emailErrorMessage.value = error.issues[0].message
  }
}

function validateRole() {
  isValidRole.value = Boolean(selectedRoleId.value)
}

function hasError(v: boolean | null) {
  return v !== null && !v
}

async function refreshHostClubTable() {
  loadingHostClubs.value = true
  setTimeout(async () => {
    await refresh()
    loadingHostClubs.value = false
  }, 2000)
}

async function onInvite() {
  if (isValidEmail.value && isValidRole.value) {
    loadingInvite.value = true
    $fetch('/api/users/invite', { method: 'POST', body: {
      email: invitedEmail.value,
      roleId: selectedRoleId.value,
    } }).then(async () => {
      // TODO: use invited user response instead of making another request
      NotificationManager.success('User invited')
      await refreshHostClubTable()
    }).catch(() => {
      NotificationManager.error()
    }).finally(() => {
      loadingInvite.value = false
      isInviteModalOpen.value = false
    })
  }
}

async function onToggleDeactivate() {
  loadingDeactivate.value = true
  $fetch('/api/host-club-members/delete', { method: 'POST', body: {
    userId: selectedUser.value?.id,
  } }).then(async () => {
    NotificationManager.success('User deactivated')
    await refreshHostClubTable()
  }).catch(() => {
    NotificationManager.error()
  }).finally(() => {
    loadingDeactivate.value = false
    isDeactivateModalOpen.value = false
  })
}

function resetModal() {
  invitedEmail.value = ''
  isValidEmail.value = null
  emailErrorMessage.value = ''
  isValidRole.value = null
  selectedRoleId.value = null
}

function prepareDeactivateUser(user: ITeamMember) {
  isDeactivateModalOpen.value = true
  selectedUser.value = user
}
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
      :loading="loadingHostClubs"
      :dense="$q.screen.lt.md"
      title="Members"
      :rows="rows"
      :columns="columns"
      row-key="name"
      :pagination="initialPagination"
    >
      <template #top>
        <span class="u-text-lg">Members</span>
        <q-space />
        <q-btn color="primary" icon="person_add_alt" label="Invite" @click="isInviteModalOpen = true" />
      </template>
      <template #body-cell-actions="props">
        <q-td :props="props">
          <q-btn v-if="!isOwner(props.row.role)" flat :icon="props.row.deletedAt === null ? 'delete' : 'undo'" @click="prepareDeactivateUser(props.row)" />
        </q-td>
      </template>
      <template #body-cell="props">
        <q-td
          :props="props"
          :class="props.row.deletedAt !== null ? 'u-text-gray-300 dark:u-text-gray-500' : ''"
        >
          {{ props.value }}
        </q-td>
      </template>
    </q-table>
    <q-dialog
      v-model="isInviteModalOpen"
      @hide="resetModal"
    >
      <q-card style="min-width: 350px">
        <q-card-section>
          <div class="u-text-lg">
            Invite members to your team
          </div>
        </q-card-section>
        <q-card-section class="q-pt-sm">
          <q-input
            v-model="invitedEmail"
            class="q-mb-sm" label="Email address" :error="hasError(isValidEmail)"
            :error-message="emailErrorMessage"
            @blur="validateEmail"
          />
          <RoleSelect v-model="selectedRoleId" :error="hasError(isValidRole)" @blur="validateRole" @update:model-value="validateRole" />
        </q-card-section>
        <q-card-actions align="right" class="text-primary">
          <q-btn v-close-popup flat label="Cancel" />
          <q-btn flat label="Send invite" :loading="loadingInvite" @click="onInvite" />
        </q-card-actions>
      </q-card>
    </q-dialog>
    <q-dialog v-model="isDeactivateModalOpen">
      <q-card>
        <q-card-section class="row items-center q-my-md">
          <span class="q-ml-sm">{{ selectedUser?.deletedAt === null ? `Are you sure you want to deactivate ${selectedUser.name}?` : `Are you sure you want to reactivate ${selectedUser?.name}?` }}</span>
        </q-card-section>
        <q-card-actions align="right">
          <q-btn v-close-popup flat label="Cancel" color="primary" />
          <q-btn flat label="Confirm" color="primary" :loading="loadingDeactivate" @click="onToggleDeactivate" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>
