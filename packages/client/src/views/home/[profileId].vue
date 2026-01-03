<script setup lang="ts">
import TimeSlots from '@/components/availability/timeSlots.vue'
import type { User } from '@/api/graphql'
import { gql } from '@apollo/client'
import { useQuery } from '@vue/apollo-composable'
import { ref } from 'vue'
import { useRoute } from 'vue-router'
const route = useRoute()
const profileId = route.params.profileId as string

const UserDocument = gql`
  query User2 {
    user {
      profiles {
        id
        availabilitySlots {
          dayOfWeek
          startTime
          duration
        }
      }
    }
  }
`
const { onResult, loading } = useQuery(UserDocument)
const userData = ref<User | null>(null)
onResult(result => {
  if (result.data) userData.value = result.data.user
})
</script>

<template>
  <div>
    <TimeSlots
      v-if="!loading"
      :availabilitySlots="userData?.profiles?.find(p => p.id === profileId)?.availabilitySlots || []"
    />
  </div>
</template>
