import { createRouter, createWebHistory } from 'vue-router'
import Home from '@/views/home.vue'
import StartPage from '@/views/startPage.vue'

const routes = [
  { path: '/', name: 'home', component: Home },
  { path: '/startPage', name: 'startPage', component: StartPage },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

// Guard global
router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('token')
  const publicPages = ['/'] // rotas públicas
  const authRequired = !publicPages.includes(to.path)

  if (authRequired && !token) {
    next('/') // se não logado, redireciona para home
  } else {
    next()
  }
})

export default router
