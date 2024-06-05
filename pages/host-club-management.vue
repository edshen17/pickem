<script setup>
const { data: result, error } = await useAsyncData('host-club', async () => {
  const client = useSupabaseClient()
  const userId = 'your-user-id' // Replace with the actual user ID

  const { data, error } = await client
    .from('host_clubs')
    .select(`
      *,
      host_club_members (
        user_id
      )
    `)
    .eq('host_club_members.user_id', userId)

  if (error) {
    console.error('Error fetching data:', error)
    return null
  }

  return data
})

const data = [
  { title: 'Name', value: 'Edwin', editable: true },
  { title: 'Date of Birth', value: 'Unfilled', editable: true },
  { title: 'Gender', value: 'Male', editable: true },
  { title: 'From', value: 'New York, United States', editable: true },
  { title: 'Living in', value: 'Other, United States', editable: true },
  { title: 'Timezone', value: 'Asia/Seoul (UTC+09:00)', editable: true },
]
</script>

<template>
  <div class="lg:py-8 u-mx-auto u-w-11/12 u-py-6 lg:u-w-5/12 u-space-y-6 md:u-pb-8">
    <p class="u-text-lg u-font-bold">
      Host Club Management
    </p>
    <div v-for="(item, index) in data" :key="index" class="row">
      <div class="col u-font-bold">
        {{ item.title }}
      </div>
      <div class="col-xs-7 col-lg-8">
        {{ item.value }}
      </div>
      <div class="col-1 i-fa6-solid:pencil">
        test
      </div>
    </div>
  </div>
</template>

<style scoped>
[contenteditable] {
  outline: none;
  @apply u-border-b u-border-dashed u-border-gray-400;
}
</style>
