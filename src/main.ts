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

// 应用启动时恢复会话并监听认证状态变化
const userStore = useUserStore()

userStore.checkAuth().finally(() => {
  supabase.auth.onAuthStateChange(async (event, session) => {
    if (event === 'TOKEN_REFRESHED' || event === 'SIGNED_IN' || event === 'USER_UPDATED' || event === 'INITIAL_SESSION') {
      await userStore.checkAuth()
    } else if (event === 'SIGNED_OUT') {
      userStore.clearUser()
    }
  })

  app.mount('#app')
})
