<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useApolloClient } from '@vue/apollo-composable'
import { graphql, useFragment, type FragmentType } from '@/api'

import UserHeader from '@/components/user/UserHeader.vue'
import ProfileSelector from '@/components/user/ProfileSelector.vue'
import ProfileDetails from '@/components/user/ProfileDetails.vue'

const route = useRoute()
const userId = route.params.id as string
const apollo = useApolloClient().client

/* ROOT FRAGMENT */
const USER_VIEW_FRAGMENT = graphql(`
  fragment UserView on User {
    id
    profiles {
        ...ProfileDetails
    }
    ...UserHeader
    ...ProfileSelector
  }
`)

const userRef = computed(() =>
  apollo.readFragment<FragmentType<typeof USER_VIEW_FRAGMENT>>({
    id: apollo.cache.identify({ __typename: 'User', id: userId }),
    fragment: USER_VIEW_FRAGMENT,
    fragmentName: 'UserView',
  })
)

const user = computed(() =>
  userRef.value ? useFragment(USER_VIEW_FRAGMENT, userRef.value) : null
)

const selectedProfileId = computed(() => route.query.profileId as string | undefined)
</script>

<template>
  <div v-if="user" class="max-w-6xl mx-auto px-6 py-8 space-y-6">
    <UserHeader :user="user" />

    <ProfileSelector
      :user="user"
      :selectedId="selectedProfileId"
    />

    <!-- <ProfileDetails
      v-if="selectedProfileId"
      :profiles="user?.profiles"
      :selectedId="selectedProfileId"
    /> -->
  </div>

  <div v-else class="text-center text-gray-500 py-20">
    Userul nu este în cache
  </div>
</template>
