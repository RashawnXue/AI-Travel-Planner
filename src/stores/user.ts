/**
 * 用户状态管理
 */

import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { User, UserState } from '@/types/user'
import { getSession } from '@/api/auth'

export const useUserStore = defineStore('user', () => {
  // 状态
  const id = ref<string | null>(null)
  const email = ref<string | null>(null)
  const username = ref<string | null>(null)
  
  // 添加一个标记，避免重复检查
  const isChecking = ref(false)
  const lastCheckTime = ref<number>(0)

  // 计算属性
  const isLoggedIn = computed(() => !!id.value)

  const userState = computed<UserState>(() => ({
    id: id.value,
    email: email.value,
    username: username.value,
    isLoggedIn: isLoggedIn.value
  }))

  // 方法
  const setUser = (user: User) => {
    id.value = user.id
    email.value = user.email
    username.value = user.username
  }

  const clearUser = () => {
    id.value = null
    email.value = null
    username.value = null
  }

  const checkAuth = async () => {
    // 如果正在检查，直接返回当前登录状态
    if (isChecking.value) {
      console.log('⏳ Auth check already in progress')
      return isLoggedIn.value
    }
    
    // 如果已登录且最近检查过（5秒内），直接返回
    const now = Date.now()
    if (isLoggedIn.value && (now - lastCheckTime.value) < 5000) {
      console.log('✅ Using recent auth check result:', email.value)
      return true
    }
    
    isChecking.value = true
    console.log('🔍 Checking auth status...')
    
    try {
      const { data, error } = await getSession()
      
      if (error || !data) {
        console.log('❌ Auth check failed:', error?.message || 'No session')
        clearUser()
        return false
      }

      console.log('✅ Auth check successful:', data.email)
      setUser(data)
      lastCheckTime.value = now
      return true
    } catch (err) {
      console.error('❌ Exception in checkAuth:', err)
      clearUser()
      return false
    } finally {
      isChecking.value = false
    }
  }

  return {
    // 状态
    id,
    email,
    username,
    // 计算属性
    isLoggedIn,
    userState,
    // 方法
    setUser,
    clearUser,
    checkAuth
  }
})

