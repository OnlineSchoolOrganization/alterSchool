<script setup lang="ts">
import { computed, ref } from 'vue'
import { useQuery } from '@vue/apollo-composable'
import row from './row.vue'
import layout from '../layout.vue'
import { graphql } from '@/api'

const USERS_DOCUMENT = graphql(`
  query Users($filter: String, $skip: Int!, $take: Int!) {
    users(filter: $filter, skip: $skip, take: $take) {
      id
      ...UserRow
    }
    usersCount(filter: $filter)
  }
`)

const filterInput = ref('')
const filter = ref('')
const take = 10
const page = ref(1)
const skip = computed(() => (page.value - 1) * take)

const { result, loading } = useQuery(USERS_DOCUMENT, () => ({
  filter: filter.value,
  skip: skip.value,
  take: take,
}))

const users = computed(() => result.value?.users ?? [])
const total = computed(() => result.value?.usersCount ?? 0)
</script>
<template>
  <layout>
    <div v-if="loading">Loading...</div>
    <div>
      <form class="flex gap-2 mb-4" @submit.prevent="() => { filter = filterInput; page = 1; skip = 0 }">
        <input
          type="text"
          v-model="filterInput"
          placeholder="Filter by email"
          class="flex-1 p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button type="submit" class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">Search</button>
      </form>
      <table class="w-full border-collapse border border-gray-300">
        <thead>
          <tr class="bg-gray-100">
            <th class="border p-2 text-left">Email</th>
            <th class="border p-2 text-left">First Name</th>
            <th class="border p-2 text-left">Last Name</th>
            <th class="border p-2 text-left">Teacher Profiles</th>
            <th class="border p-2 text-left">Student Profiles</th>
            <th class="border p-2 text-left">Deleted Profiles</th>
          </tr>
        </thead>
        <tbody>
          <row v-for="user in users" :key="user.id" :user="user" />
        </tbody>
      </table>
      <div class="flex justify-between items-center mt-4">
        <button class="px-3 py-1 border rounded disabled:opacity-50" :disabled="page === 1" @click="page--">
          Prev
        </button>

        <span> Page {{ page }} / {{ Math.ceil(total / take) }} </span>

        <button
          class="px-3 py-1 border rounded disabled:opacity-50"
          :disabled="page >= Math.ceil(total / take)"
          @click="page++"
        >
          Next
        </button>
      </div>
    </div>
  </layout>
</template>
