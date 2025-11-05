import { createRouter, createWebHistory } from 'vue-router'
import { message } from 'ant-design-vue'
import { useUserStore } from '@/stores/user'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/login',
      name: 'login',
      component: () => import('@/views/auth/LoginView.vue'),
      meta: { requiresAuth: false }
    },
    {
      path: '/register',
      name: 'register',
      component: () => import('@/views/auth/RegisterView.vue'),
      meta: { requiresAuth: false }
    },
    {
      path: '/',
      name: 'home',
      component: () => import('@/views/plan/PlanListView.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/create',
      name: 'create',
      component: () => import('@/views/plan/CreatePlanView.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/plan/:id',
      name: 'plan-detail',
      component: () => import('@/views/plan/PlanDetailView.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/about',
      name: 'about',
      component: () => import('@/views/AboutView.vue'),
      meta: { requiresAuth: true }
    }
  ]
})

// 全局前置守卫
router.beforeEach(async (to, from, next) => {
  const userStore = useUserStore()
  
  // 白名单路由（无需登录）
  const whiteList = ['/login', '/register']
  const requiresAuth = to.meta.requiresAuth !== false
  
  console.log('🚦 Route guard:', to.path, 'requiresAuth:', requiresAuth, 'isLoggedIn:', userStore.isLoggedIn)
  
  // 如果访问的是白名单路由
  if (whiteList.includes(to.path)) {
    // 先检查认证状态（从 Supabase localStorage 恢复会话）
    if (!userStore.isLoggedIn) {
      await userStore.checkAuth()
    }
    
    // 如果已登录，跳转到首页
    if (userStore.isLoggedIn) {
      console.log('✅ Already logged in, redirect to home')
      next('/')
    } else {
      next()
    }
    return
  }
  
  // 如果需要登录，先检查认证状态
  if (requiresAuth) {
    // 如果 store 中没有用户信息，尝试从 Supabase 恢复会话
    if (!userStore.isLoggedIn) {
      console.log('🔍 Not logged in, checking session...')
      const isAuthenticated = await userStore.checkAuth()
      
      if (!isAuthenticated) {
        console.log('❌ Not authenticated, redirect to login')
        message.warning('请先登录')
        next('/login')
        return
      }
      console.log('✅ Session restored, proceed to route')
    }
  }
  
  next()
})

export default router
