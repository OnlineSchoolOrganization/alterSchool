<script setup lang="ts">
import { type User, type User1Query } from '@/api/graphql'
import { graphql } from '@/api'
import { useQuery } from '@vue/apollo-composable'
import { ref } from 'vue'
const UserDocument = graphql(`
  query User1 {
    user {
      id
      firstName
      lastName
      profiles {
        id
        firstName
        lastName
      }
    }
  }
`)
const { onResult, loading } = useQuery(UserDocument)
const userData = ref<User1Query['user'] | null>(null)
onResult(result => {
  if (result.data) userData.value = result.data.user
})
</script>
<template>
  <div v-if="loading">Loading...</div>
  <div v-else v-for="value in userData?.profiles">
    {{ value.firstName }} {{ value.lastName }}
    <a :href="`/home/${value.id}`">Vezi profil</a>
  </div>
</template>
