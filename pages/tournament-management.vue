<script setup lang="ts">
import { toTypedSchema } from '@vee-validate/zod'
import { useForm } from 'vee-validate'
import { type TournamentValidator, tournamentValidator } from '~/validators/tournament'

const validationSchema = toTypedSchema(tournamentValidator)

const { values, handleSubmit } = useForm<TournamentValidator>({ validationSchema })

console.log(values)
</script>

<template>
  <div class="u-m-5 u-w-4/12">
    <TextInput name="name" type="text" placeholder="Tournament name" :focused="true" />
    <p>Add admins</p>
    {{ values }}
    <Button>Create</Button>
  </div>
</template>
