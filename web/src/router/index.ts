import { createRouter, createWebHistory } from 'vue-router'
import Auth from '@/views/Auth.vue'
import Shelf from '@/views/Shelf.vue'
import Notes from '@/views/Notes.vue'
import Statistics from '@/views/Statistics.vue'
import Search from '@/views/Search.vue'
import Discover from '@/views/Discover.vue'

const routes = [
  {
    path: '/',
    redirect: '/shelf'
  },
  {
    path: '/auth',
    name: 'Auth',
    component: Auth
  },
  {
    path: '/shelf',
    name: 'Shelf',
    component: Shelf
  },
  {
    path: '/notes',
    name: 'Notes',
    component: Notes
  },
  {
    path: '/statistics',
    name: 'Statistics',
    component: Statistics
  },
  {
    path: '/search',
    name: 'Search',
    component: Search
  },
  {
    path: '/discover',
    name: 'Discover',
    component: Discover
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach((to) => {
  const apiKey = localStorage.getItem('weread_api_key')
  if (to.path !== '/auth' && !apiKey) {
    return '/auth'
  }
  return true
})

export default router