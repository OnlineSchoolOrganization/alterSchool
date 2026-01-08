<script setup lang="ts">
import { graphql, useFragment, type FragmentType } from '@/api'
import { gql } from '@apollo/client'
import { useMutation } from '@vue/apollo-composable'
import { computed } from 'vue'

const UserRow = graphql(`
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
      ...ProfileFragment
    }
  }
`)

const ProfileFragment = graphql(`
  fragment ProfileFragment on Profile {
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
`)

const TeacherAddDoc = gql`
  mutation TeacherAdd($userId: ID!) {
    teacherAdd(userId: $userId) {
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
`

const TeacherRemoveDoc = gql`
  mutation TeacherRemove($userId: ID!) {
    teacherRemove(userId: $userId) {
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
`

const props = defineProps<{
  user: FragmentType<typeof UserRow>
}>()
const user = computed(() => useFragment(UserRow, props.user))

const { mutate: teacherAddMutate, loading: teacherAddLoading } = useMutation(TeacherAddDoc, () => ({
  variables: { userId: user.value.id },
  update: (store, { data }) => {
    if (!data) return
    const userInCache = store.readFragment({
      id: store.identify({ __typename: 'User', id: user.value.id }),
      fragment: UserRow,
      fragmentName: 'UserRow',
    })

    if (userInCache) {
      store.writeFragment({
        id: store.identify({ __typename: 'User', id: user.value.id }),
        fragment: UserRow,
        fragmentName: 'UserRow',
        data: {
          ...userInCache,
          profiles: [...(userInCache.profiles || []), data?.teacherAdd],
        },
      })
    }
  },
  optimisticResponse: {
    __typename: 'Mutation',
    teacherAdd: {
      __typename: 'Profile',
      id: 'temp-id',
      deleted: false,
      roleProfile: {
        __typename: 'Teacher',
        id: 'temp-id-teacher',
      },
    },
  },
}))

const { mutate: teacherRemoveMutate, loading: teacherRemoveLoading } = useMutation(TeacherRemoveDoc, () => ({
  variables: { userId: user.value.id },
  update: (store, { data }) => {
    if (!data) return
    const profileInCache = store.readFragment({
      id: store.identify({ __typename: 'Profile', id: activeTeacherProfile.value?.id }),
      fragment: ProfileFragment,
    })

    if (profileInCache) {
      store.writeFragment({
        id: store.identify({ __typename: 'Profile', id: user.value.id }),
        fragment: ProfileFragment,
        data: {
          ...profileInCache,
          deleted: true,
        },
      })
    }
  },
  optimisticResponse: {
    __typename: 'Mutation',
    teacherRemove: {
      __typename: 'Profile',
      id: activeTeacherProfile.value?.id || 'temp-id',
      deleted: true,
      roleProfile: {
        __typename: 'Teacher',
        id: activeTeacherProfile.value?.roleProfile?.id || 'temp-id-teacher',
      },
    },
  },
}))

const activeTeacherProfile = computed(() =>
  user.value.profiles?.find(p => !p.deleted && p.roleProfile?.__typename === 'Teacher'),
)

const isTeacher = computed(() => !!activeTeacherProfile.value)

const loading = computed(() => teacherAddLoading.value || teacherRemoveLoading.value)

async function teacherAdd() {
  await teacherAddMutate()
}

async function teacherRemove() {
  if (!activeTeacherProfile.value) return
  await teacherRemoveMutate()
}
</script>

<template>
  <tr class="group hover:bg-white/[0.03] transition-all border-b border-zinc-800/50 last:border-0">
    <td class="p-4 w-1/3">
      <div class="flex flex-col gap-0.5">
        <router-link
          :to="`/dashboard/user/${user.id}`"
          class="text-zinc-100 font-semibold hover:text-[#d4af37] transition-colors text-[14px]"
        >
          {{ user.email }}
        </router-link>
        <span class="text-[10px] font-mono text-zinc-500 tracking-wider">ID: {{ user.id.slice(0, 12) }}</span>
      </div>
    </td>

    <td class="p-4">
      <span class="text-zinc-300 text-sm font-medium"> {{ user.firstName }} {{ user.lastName }} </span>
    </td>

    <td class="p-4">
      <div class="flex items-center justify-center">
        <button
          v-if="isTeacher"
          @click="teacherRemove"
          :disabled="loading || teacherRemoveLoading"
          class="cursor-pointer min-w-[120px] px-4 py-1.5 rounded border border-red-500/20 bg-red-500/5 text-red-400 text-[11px] font-bold uppercase tracking-widest hover:bg-red-500 hover:text-white transition-all disabled:opacity-20"
        >
          <span v-if="teacherRemoveLoading">Procesare...</span>
          <span v-else>Remove Teacher</span>
        </button>

        <button
          v-else
          @click="teacherAdd"
          :disabled="loading || teacherAddLoading"
          class="cursor-pointer min-w-[120px] px-4 py-1.5 rounded border border-[#d4af37]/30 bg-[#d4af37]/5 text-[#d4af37] text-[11px] font-bold uppercase tracking-widest hover:bg-[#d4af37] hover:text-black transition-all disabled:opacity-20"
        >
          <span v-if="teacherAddLoading">Procesare...</span>
          <span v-else>Add Teacher</span>
        </button>
      </div>
    </td>

    <td class="p-4 text-center">
      <div
        class="inline-flex items-center px-2.5 py-0.5 rounded-full bg-zinc-800 text-zinc-400 text-[10px] font-bold border border-zinc-700"
      >
        {{ user.profiles?.filter(p => p.roleProfile?.__typename === 'Student' && !p.deleted).length }} STUDENȚI
      </div>
    </td>

    <td class="p-4 text-right">
      <span v-if="user.profiles?.filter(p => p.deleted).length" class="text-red-500/40 font-mono text-xs">
        [{{ user.profiles?.filter(p => p.deleted).length }}]
      </span>
      <span v-else class="text-zinc-800 text-xs">-</span>
    </td>
  </tr>
</template>
