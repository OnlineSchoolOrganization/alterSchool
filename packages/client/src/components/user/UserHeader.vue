<script setup lang="ts">
import { graphql, useFragment, type FragmentType } from '@/api'

const USER_HEADER_FRAGMENT = graphql(`
  fragment UserHeader on User {
    firstName
    lastName
    email
    phoneNumber
    role
  }
`)

const props = defineProps<{
  user: FragmentType<typeof USER_HEADER_FRAGMENT>
}>()

const user = useFragment(USER_HEADER_FRAGMENT, props.user)
</script>

<template>
  <div class="bg-white rounded-2xl shadow p-6">
    <h1 class="text-2xl font-semibold">
      {{ user.firstName }} {{ user.lastName }}
    </h1>

    <div class="mt-4 grid grid-cols-2 gap-4 text-sm text-gray-700">
      <div><span class="font-medium">Email:</span> {{ user.email }}</div>
      <div><span class="font-medium">Telefon:</span> {{ user.phoneNumber }}</div>
      <div><span class="font-medium">Roluri:</span> {{ user.role?.join(', ') }}</div>
    </div>
  </div>
</template>
