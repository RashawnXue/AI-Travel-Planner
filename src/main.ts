import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import Antd from 'ant-design-vue'
import 'ant-design-vue/dist/reset.css'

import App from './App.vue'
import router from './router'
import { supabase } from '@/utils/supabase'
import { useUserStore } from '@/stores/user'

const app = createApp(App)
const pinia = createPinia()

app.use(pinia)
app.use(router)
app.use(Antd)

// 应用启动时：先等待 Supabase 完成初始会话恢复（INITIAL_SESSION），再进行首轮校验
const userStore = useUserStore()

const waitForInitialSession = new Promise<void>((resolve) => {
  let resolved = false
  const { data } = supabase.auth.onAuthStateChange((event) => {
    if (event === 'INITIAL_SESSION' && !resolved) {
      resolved = true
      // 只为等待初始会话的临时订阅，完成后立即取消
      data.subscription.unsubscribe()
      resolve()
    }
  })
  // 兜底超时，避免某些边缘情况下事件未触发导致卡住
  setTimeout(() => {
    if (!resolved) {
      data.subscription.unsubscribe()
      resolve()
    }
  }, 400)
})

waitForInitialSession
  .catch(() => {})
  .finally(async () => {
    await userStore.checkAuth()

    // 常驻订阅：后续事件变化时同步到 store
    supabase.auth.onAuthStateChange(async (event) => {
      if (event === 'TOKEN_REFRESHED' || event === 'SIGNED_IN' || event === 'USER_UPDATED') {
        await userStore.checkAuth()
      } else if (event === 'SIGNED_OUT') {
        userStore.clearUser()
      }
    })

    // 添加页面可见性监听：当页面从隐藏变为可见时，检查并刷新会话
    document.addEventListener('visibilitychange', async () => {
      if (!document.hidden && userStore.isLoggedIn) {
        // 页面变为可见时，主动刷新会话
        const { data: { session }, error } = await supabase.auth.getSession()
        if (error || !session) {
          console.warn('会话已失效，需要重新登录')
          userStore.clearUser()
          router.push('/login')
        } else {
          // 如果会话即将过期（小于5分钟），主动刷新
          const expiresAt = session.expires_at || 0
          const now = Math.floor(Date.now() / 1000)
          if (expiresAt - now < 300) {
            console.log('会话即将过期，主动刷新...')
            await supabase.auth.refreshSession()
          }
        }
      }
    })

    // 定期检查会话状态（每5分钟）
    setInterval(async () => {
      if (userStore.isLoggedIn) {
        const { data: { session }, error } = await supabase.auth.getSession()
        if (error || !session) {
          console.warn('会话检查失败，清除登录状态')
          userStore.clearUser()
        }
      }
    }, 5 * 60 * 1000)

    app.mount('#app')
  })
