import Vue from 'vue'
import VueRouter from 'vue-router'
import login from '@/components/login'
import home from '@/components/home'

Vue.use(VueRouter)

const routes = [
  {
    path: '/login',
    component: login
  },
  {
    path: '/',
    redirect: '/login'
  },
  {
    path: '/home',
    component: home
  }
]

const router = new VueRouter({
  routes
})

router.beforeEach((to, from, next) => {
  // to是想要访问的路径
  // from是从哪个路径跳转过来
  // next是函数，表示放行next（） next（'/path'）强制跳转
  if (to.path === '/login') return next()
  const tokenStr = window.sessionStorage.getItem('token')
  if (!tokenStr) return next('login')
  next()
})

export default router
