import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import Antd from 'ant-design-vue'
import 'ant-design-vue/dist/reset.css'

import App from './App.vue'
import router from './router'
import { useUserStore } from '@/stores/user'

const app = createApp(App)
const pinia = createPinia()

app.use(pinia)
app.use(router)
app.use(Antd)

// 应用启动时检查认证状态
const userStore = useUserStore()

// 初始化：从后端验证 token
;(async () => {
  await userStore.checkAuth()
  app.mount('#app')
})()
