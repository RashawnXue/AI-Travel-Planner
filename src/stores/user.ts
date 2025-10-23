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
    const { data, error } = await getSession()
    
    if (error || !data) {
      clearUser()
      return false
    }

    setUser(data)
    return true
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

