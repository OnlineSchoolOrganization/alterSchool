<script setup lang="ts">
import { graphql, useFragment, type FragmentType } from '@/api'
const userRow = graphql(`
  fragment UserRow on User {
    id
    email
    firstName
    lastName
    profiles {
      id
      deleted
      roleProfile {
        ... on Teacher {
          id
        }
        ... on Student {
          id
        }
      }
    }
  }
`)
const props = defineProps<{
  user: FragmentType<typeof userRow>
}>()
const user1 = useFragment(userRow, props.user)
console.log(user1)
</script>

<template>
  <tr>
    <td class="border p-2">{{ user1.email }}</td>
    <td class="border p-2">{{ user1.firstName }}</td>
    <td class="border p-2">{{ user1.lastName }}</td>
    <td class="border p-2">
      {{ user1.profiles?.filter(p => p.roleProfile && p.roleProfile.__typename === 'Teacher' && !p.deleted).length }}
    </td>
    <td class="border p-2">
      {{ user1.profiles?.filter(p => p.roleProfile && p.roleProfile.__typename === 'Student' && !p.deleted).length }}
    </td>
    <td class="border p-2">{{ user1.profiles?.filter(p => p.deleted).length }}</td>
  </tr>
</template>
