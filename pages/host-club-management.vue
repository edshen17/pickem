<script setup lang="ts">
import { hostClubManagementColumns as columns } from '~/components/data-table/columns'
import { emailValidator } from '~/validators/user'

const { user: piniaUser } = storeToRefs(useUserStore())

const loading = ref(true)
const isInviteModalOpen = ref(false)
const invitedEmail = ref('')
const isValidEmail = ref<boolean | null>(null)
const emailErrorMessage = ref('')
const selectedRoleId = ref<string | null>(null)
const isValidRole = ref<boolean | null>(null)

// sort by owner, then name
const { data } = await useFetchApi<any[]>('/api/host-clubs').then((res) => {
  loading.value = false
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

function onSubmit() {
  if (isValidEmail.value && isValidRole.value) {
    // make api
    // resetModal()
  }
}

function resetModal() {
  invitedEmail.value = ''
  isValidEmail.value = null
  emailErrorMessage.value = ''
  isValidRole.value = null
  selectedRoleId.value = null
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
            class="q-mb-sm" filled dense label="Email address" :error="hasError(isValidEmail)"
            :error-message="emailErrorMessage"
            @blur="validateEmail"
          />
          <RoleSelect v-model="selectedRoleId" :error="hasError(isValidRole)" @blur="validateRole" @update:model-value="validateRole" />
        </q-card-section>
        <q-card-actions align="right" class="text-primary">
          <q-btn v-close-popup flat label="Cancel" />
          <q-btn flat label="Send invite" @click="onSubmit" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>
