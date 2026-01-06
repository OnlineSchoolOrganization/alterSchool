<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useApolloClient } from '@vue/apollo-composable'
import { graphql, useFragment, type FragmentType } from '@/api'

import UserHeader from '@/components/user/UserHeader.vue'
import ProfileSelector from '@/components/user/ProfileSelector.vue'

const route = useRoute()
const userId = route.params.id as string
const apollo = useApolloClient().client

/* ROOT FRAGMENT */
const USER_VIEW_FRAGMENT = graphql(`
  fragment UserView on User {
    id
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
  <div class="min-h-screen bg-slate-950 text-slate-200 py-10 px-6">
    <div v-if="user" class="mx-auto bg-slate-900 border border-slate-800 rounded-[2.5rem] shadow-2xl overflow-hidden">
      <UserHeader :user="user" />

      <div class="h-px bg-slate-800 mx-8"></div>

      <ProfileSelector
        :user="user"
        :selectedId="selectedProfileId"
      />
    </div>

    <div v-else class="text-center py-20 text-slate-500 tracking-widest">
      ÎNCĂRCARE DATE...
    </div>
  </div>
</template>