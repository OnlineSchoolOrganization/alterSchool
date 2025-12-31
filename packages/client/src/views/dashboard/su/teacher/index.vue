<script setup lang="ts">
import { gql } from '@apollo/client'
import layout from '../layout.vue'
import type { Teacher } from '@/api/graphql'
import { ref } from 'vue'
import { useQuery } from '@vue/apollo-composable'
const TEACHER_DOCUMENT = gql`
  query Teacher {
    teachers {
      id
      firstName
      lastName
    }
  }
`

const { onResult, loading } = useQuery(TEACHER_DOCUMENT)
const teacherData = ref<Teacher | null>(null)

onResult(result => {
  if (result.data) teacherData.value = result.data.teachers
})
</script>
<template>
  <layout>
    <div v-if="loading">Loading...</div>
    <div v-else v-for="value in teacherData">{{ value.firstName }} {{ value.lastName }}</div>
    <a href="/dashboard/su/teacher/add">add teacher</a>
  </layout>
</template>
