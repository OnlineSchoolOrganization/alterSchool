import { computed, ref } from 'vue'

export type AppTheme = 'default' | 'white'

const STORAGE_KEY = 'app-theme'
const theme = ref<AppTheme>('default')
const initialized = ref(false)

function applyTheme(value: AppTheme) {
  theme.value = value

  if (typeof document !== 'undefined') {
    document.documentElement.dataset.theme = value
  }

  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_KEY, value)
  }
}

function initializeTheme() {
  if (initialized.value) return
  initialized.value = true

  if (typeof window === 'undefined') return

  const storedTheme = localStorage.getItem(STORAGE_KEY)
  const nextTheme: AppTheme = storedTheme === 'white' ? 'white' : 'default'
  applyTheme(nextTheme)
}

export function useTheme() {
  initializeTheme()

  const isWhiteTheme = computed(() => theme.value === 'white')

  function setTheme(value: AppTheme) {
    applyTheme(value)
  }

  function toggleTheme() {
    applyTheme(theme.value === 'white' ? 'default' : 'white')
  }

  return {
    theme: computed(() => theme.value),
    isWhiteTheme,
    setTheme,
    toggleTheme,
  }
}
