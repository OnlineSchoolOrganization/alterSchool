<script setup lang="ts">
import { computed, onMounted, onBeforeUnmount, ref } from 'vue'
import { useQuery } from '@vue/apollo-composable'
import MenuItem from './MenuItem.vue'
import ThemeToggle from './ThemeToggle.vue'
import { graphql } from '@/api'

// query GraphQL pentru user
const { result, refetch } = useQuery(graphql(`
query MeForMenu {
  me {
    id
    role
    profiles {
      id
      username
      roleProfile {
        __typename
      }
    }
  }
}
  `)
)

const me = computed(() => result.value?.me)

const isSuperUser = computed(() => me.value?.role?.includes('SUPER_USER'))
const hasTeacherProfile = computed(() =>
  me.value?.profiles?.some(p => p.roleProfile?.__typename === 'Teacher')
)
const auth = ref(localStorage.getItem('token'))

function handleAuthChange() {
    auth.value = localStorage.getItem('token')
    refetch()
}

onMounted(() => {
  window.addEventListener('auth-changed', handleAuthChange)
})

onBeforeUnmount(() => {
  window.removeEventListener('auth-changed', handleAuthChange)
})
</script>

<template>
  <!-- TOPBAR DESKTOP -->
  <nav class="hidden md:flex w-full bg-slate-900 text-white items-center justify-between px-6 py-3 gap-2 shadow-md">
    <div class="flex items-center gap-2 flex-wrap">
      <MenuItem label="Admin" to="/dashboard" :show="!!isSuperUser" />
      <MenuItem label="Teacher Dashboard" to="/teacher/dashboard" :show="!!hasTeacherProfile" />
      <MenuItem label="Teacher List" to="/teacher/list" :show="true" />
      <MenuItem label="Student Dashboard" to="/student/dashboard" :show="!!me" />
      <MenuItem label="Create Student" to="/student/create" :show="!!me" />
    </div>
    <div class="flex items-center gap-2 flex-wrap">
        <MenuItem v-if="auth" label="Logout" to="/auth/logout" :show="true" />
        <MenuItem v-else label="Login" to="/auth/login" :show="true" />
        <ThemeToggle />
    </div>
  </nav>

  <!-- BOTTOM NAV MOBILE -->
  <nav class="fixed bottom-0 left-0 w-full bg-slate-900 text-white flex md:hidden justify-around py-2 border-t border-slate-800 z-100">
    <MenuItem label="Admin" to="/dashboard" icon="🏠" :show="!!isSuperUser"/>
    <MenuItem label="Teacher" to="/teacher/list" icon="👨‍🏫" :show="true" />
    <MenuItem label="Student" to="/student/dashboard" icon="🎓" :show="!!me" />
    <MenuItem v-if="auth" label="Logout" icon="➜]" to="/auth/logout" :show="true" />
    <MenuItem v-else label="Login" icon="➜🚪" to="/auth/login" :show="true" />
    <ThemeToggle />
  </nav>
</template>