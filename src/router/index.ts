import { createRouter, createWebHistory } from 'vue-router'
import Home from '@/views/home.vue'
import StartPage from '@/views/startPage.vue'
// import Cadastro from '@/views/cadastro.vue'

const routes = [
  { 
    path: '/', 
    name: 'home', 
    component: Home 
  },
  {
    path:'/startPage',
    name:'startPage',
    component: StartPage
  },
  // { 
  //   path: '/cadastro', 
  //   name: 'cadastro', 
  //   component: Cadastro 
  // }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
