<script setup lang="ts">
    import MiniProfile from '@/components/ui/profile/MiniProfile.vue';
    import AddProfile from '@/components/ui/profile/AddProfile.vue';
    import { useQuery } from '@vue/apollo-composable';
    import { computed } from 'vue';
    import { GET_MY_PROFILES } from './query';
    const { result, loading } = useQuery(GET_MY_PROFILES)
    const user = computed(() => result.value?.user)
</script>

<template>
    <div class="p-10" v-if="!loading">
        <div class="mb-10">
            <h1 class="text-3xl text-center">Selecteaza un profil</h1>
            <p class="text-lg text-center">Selectează profilul pe care vrei să-l folosești</p>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-stretch mx-auto max-w-7xl">
            <MiniProfile v-for="profile in user?.profiles" :key="profile.id" :name="profile.username" :email="profile.email" />
            <AddProfile />
        </div>
    </div>
    <div v-else>Loading</div>
</template>