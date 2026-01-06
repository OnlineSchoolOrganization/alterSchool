<script setup lang="ts">
import { graphql, useFragment, type FragmentType } from '@/api'
import { computed, ref } from 'vue';
import { useRouter, useRoute } from 'vue-router'

const router = useRouter()
const route = useRoute()

const selectedId = route.query.profileId as string | undefined;

const PROFILE_SELECTOR_FRAGMENT = graphql(`
  fragment ProfileSelector on User {
    profiles {
      id
      firstName
      lastName
      deleted
      roleProfile {
        __typename
      }
        ...ProfileDetails
    }
  }
`)

const props = defineProps<{
  user: FragmentType<typeof PROFILE_SELECTOR_FRAGMENT>
}>()

const profiles = computed(() =>
  useFragment(PROFILE_SELECTOR_FRAGMENT, props.user).profiles
)

function selectProfile(id: string) {
  router.replace({
    query: { ...route.query, profileId: id },
  })
}

</script>

<template>
  <div class="bg-white rounded-2xl shadow p-4">
    <h2 class="text-lg font-medium mb-3">Profile</h2>

    <div class="flex flex-wrap gap-2">
      <button
        v-for="profile in profiles"
        :key="profile.id"
        @click="selectProfile(profile.id)"
        class="px-4 py-2 rounded-xl border text-sm transition"
        :class="profile.id === selectedId
          ? 'bg-blue-600 text-white border-blue-600'
          : 'bg-gray-50 hover:bg-gray-100 border-gray-200'"
      >
        {{ profile?.firstName }} {{ profile.lastName }}
        <span class="ml-1 text-xs opacity-70">
          ({{ profile.roleProfile?.__typename }})
        </span>
      </button>
    </div>
  </div>
</template>
