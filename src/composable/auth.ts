// auth.js
import router from '@/router/index.ts' // importe seu createRouter

// Função utilitária para verificar login
export function isLoggedIn() {
  // Retorna true se houver token no localStorage
  return !!localStorage.getItem('token')
}

// Guard global de rotas
router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('token')

  // Rotas públicas que não precisam de login
  const publicPages = ['/'] // home/login é pública
  const authRequired = !publicPages.includes(to.path)

  if (authRequired && !token) {
    // Redireciona para a home/login se não estiver logado
    next('/')
  } else {
    // Permite acesso
    next()
  }
})
