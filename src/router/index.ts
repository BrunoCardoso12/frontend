import { createRouter, createWebHistory } from 'vue-router'
import Home from '@/views/home.vue'
import StartPage from '@/views/startPage.vue'
import MyBooks from '@/views/myBooks.vue'
import MessageView from '@/views/message.vue'


const routes = [
  { path: '/', name: 'home', component: Home },
  { path: '/startPage', name: 'startPage', component: StartPage },
  { path: '/myBooks', name: 'myBooks', component: MyBooks, meta: { requiresAuth: true }},
  { path: '/message', name: 'message', component: MessageView, meta: { requiresAuth: true }},
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('token')
  const publicPages = ['/']
  const authRequired = !publicPages.includes(to.path)

  if (authRequired && !token) {
    next('/')
  } else {
    next()
  }
})

export default router
