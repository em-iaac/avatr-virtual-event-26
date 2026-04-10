import { createRouter, createWebHistory } from 'vue-router'

import LobbyView from '../views/LobbyView.vue'
import WaitingRoomView from '../views/WaitingRoomView.vue'
import RevealRoomView from '../views/RevealRoomView.vue'
import WatchingRoomView from '../views/WatchingRoomView.vue'
import InvitationRoomView from '../views/InvitationRoomView.vue'

const routes = [
  {
    path: '/',
    name: 'lobby',
    component: LobbyView,
    meta: { room: 'lobby' },
  },
  {
    path: '/waiting-room',
    name: 'waiting-room',
    component: WaitingRoomView,
    meta: { room: 'waiting' },
  },
  {
    path: '/reveal-room',
    name: 'reveal-room',
    component: RevealRoomView,
    meta: { room: 'reveal' },
  },
  {
    path: '/watching-room',
    name: 'watching-room',
    component: WatchingRoomView,
    meta: { room: 'watching' },
  },
  {
    path: '/invitation',
    name: 'invitation',
    component: InvitationRoomView,
    meta: { room: 'invitation' },
    beforeEnter: () => {
      if (!localStorage.getItem('avatr-quiz-completed')) {
        return { name: 'waiting-room', query: { tab: 'quiz', locked: '1' } }
      }
    },
  },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

export default router
