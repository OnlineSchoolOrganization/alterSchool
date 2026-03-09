import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'
import { createRouter, createWebHistory } from 'vue-router'
import { routes } from 'vue-router/auto-routes'
import { DefaultApolloClient } from '@vue/apollo-composable'
import { apolloClient } from './apollo'
// import { createPinia } from 'pinia'

const app = createApp(App)

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})
// app.use(createPinia())
app.provide(DefaultApolloClient, apolloClient)

app.use(router)

app.mount('#app')
