<script setup lang="ts">
import { useRouter } from 'vue-router'

const router = useRouter()

localStorage.removeItem('token')
window.dispatchEvent(new Event('auth-changed'))
router.push('/teacher/list')
</script>

<template>Loading</template>
