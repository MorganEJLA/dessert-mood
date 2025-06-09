import { createRouter, createWebHistory } from 'vue-router'
import App from '../App.vue'
import CallbackPage from '../views/CallbackPage.vue'

const routes = [
  { path: '/', component: App },
  { path: '/callback', component: CallbackPage },
]

export default createRouter({
  history: createWebHistory(),
  routes,
})
