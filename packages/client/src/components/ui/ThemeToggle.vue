<script setup lang="ts">
import { useTheme } from '@/composables/useTheme'

const { isWhiteTheme, setTheme } = useTheme()
</script>

<template>
  <div class="theme-toggle-shell">
    <div class="theme-toggle">
      <button
        type="button"
        class="theme-toggle__option"
        :class="{ 'theme-toggle__option--active': !isWhiteTheme }"
        @click="setTheme('default')"
      >
        Current
      </button>
      <button
        type="button"
        class="theme-toggle__option"
        :class="{ 'theme-toggle__option--active': isWhiteTheme }"
        @click="setTheme('white')"
      >
        White
      </button>
    </div>
  </div>
</template>
