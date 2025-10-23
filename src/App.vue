<script setup lang="ts">
import { onMounted } from 'vue'
import { RouterView } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { supabase } from '@/utils/supabase'

const userStore = useUserStore()

// 应用初始化时检查登录状态
onMounted(async () => {
  // 检查当前会话
  await userStore.checkAuth()
  
  // 监听认证状态变化
  supabase.auth.onAuthStateChange(async (event, session) => {
    if (event === 'SIGNED_IN' && session) {
      await userStore.checkAuth()
    } else if (event === 'SIGNED_OUT') {
      userStore.clearUser()
    }
  })
})
</script>

<template>
  <RouterView />
</template>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html,
body,
#app {
  width: 100vw;
  height: 100vh;
  margin: 0;
  padding: 0;
  overflow: hidden;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial,
    sans-serif;
}
</style>
