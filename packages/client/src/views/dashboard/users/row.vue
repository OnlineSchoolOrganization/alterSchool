<script setup lang="ts">
import { graphql, useFragment, type FragmentType } from '@/api'
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

const TeacherAddDoc = graphql(`
  mutation TeacherAdd($userId: ID!) {
    teacherAdd(userId: $userId) {
      ...ProfileFragment
    }
  }
`)

const TeacherRemoveDoc = graphql(`
  mutation TeacherRemove($userId: ID!) {
    teacherRemove(userId: $userId) {
      ...ProfileFragment
    }
  }
`)

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
          profiles: [
            ...(userInCache.profiles || []),
            data?.teacherAdd,
          ],
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
  <tr>
    <td class="border p-2">
      <router-link
        :to="`/dashboard/users/${user.id}`"
        class="text-blue-600 hover:underline"
      >
        {{ user.email }}
      </router-link>
    </td>
    <td class="border p-2">{{ user.firstName }}</td>
    <td class="border p-2">{{ user.lastName }}</td>
    <td class="border p-2">
      <div class="flex items-center gap-2">
        <span>
          {{ user.profiles?.filter(p => p.roleProfile?.__typename === 'Teacher' && !p.deleted).length }}
        </span>

        <button
          class="px-2 py-1 text-xs rounded bg-green-600 text-white disabled:opacity-50"
          :disabled="isTeacher || loading"
          @click="teacherAdd"
        >
          <span v-if="teacherAddLoading">Adding...</span>
          <span v-else>Add</span>
        </button>

        <button
          class="px-2 py-1 text-xs rounded bg-red-600 text-white disabled:opacity-50"
          :disabled="!isTeacher || loading"
          @click="teacherRemove"
        >
          <span v-if="teacherRemoveLoading">Removing...</span>
          <span v-else>Remove</span>
        </button>
      </div>
    </td>
    <td class="border p-2">
      {{ user.profiles?.filter(p => p.roleProfile && p.roleProfile.__typename === 'Student' && !p.deleted).length }}
    </td>
    <td class="border p-2">{{ user.profiles?.filter(p => p.deleted).length }}</td>
  </tr>
</template>
