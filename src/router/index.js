import { createRouter, createWebHistory } from 'vue-router'
import App from '../App.vue'
import SpotifyCallback from '../views/SpotifyCallback.vue'

const routes = [
  { path: '/', component: App },
  { path: '/callback', component: SpotifyCallback },
]

export default createRouter({
  history: createWebHistory(),
  routes,
})
