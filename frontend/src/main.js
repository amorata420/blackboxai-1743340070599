import { createApp } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import App from './App.vue'
import './assets/styles/branding.css'

// Initialize Vue app
const app = createApp(App)

// Set up basic routes
const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', component: () => import('./views/Home.vue') },
    { path: '/streams', component: () => import('./views/Streams.vue') },
    { path: '/documents', component: () => import('./views/Documents.vue') }
  ]
})

// Mount the app
app.use(router)
app.mount('#app')

// Add global styles
import './assets/styles/main.css'