<script setup lang="ts">
import { toTypedSchema } from '@vee-validate/zod'
import { useForm } from 'vee-validate'

const validationSchema = toTypedSchema(tournamentValidator)

const { values, handleSubmit } = useForm<TournamentValidator>({ validationSchema })
</script>

<template>
  <div class="u-m-5 u-w-4/12">
    <TextInput name="text" type="text" placeholder="Tournament name" :focused="true" />
    <p>Add admins</p>
    <Button>Create</Button>
  </div>
</template>
