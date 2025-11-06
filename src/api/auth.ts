/**
 * 认证相关 API
 * 现在通过后端 API 处理，不再直接调用 Supabase
 */

import type { ApiResponse } from '@/types/api'
import type { User, LoginForm, RegisterForm } from '@/types/user'

const API_BASE = '/api/backend/auth'

// Session token 存储
const TOKEN_KEY = 'auth_token'
const REFRESH_TOKEN_KEY = 'refresh_token'
const USER_KEY = 'user_data'

/**
 * 获取存储的 token
 */
export const getStoredToken = (): string | null => {
  return localStorage.getItem(TOKEN_KEY)
}

/**
 * 获取存储的 refresh token
 */
export const getStoredRefreshToken = (): string | null => {
  return localStorage.getItem(REFRESH_TOKEN_KEY)
}

/**
 * 存储 token
 */
const storeToken = (accessToken: string, refreshToken: string) => {
  localStorage.setItem(TOKEN_KEY, accessToken)
  localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken)
}

/**
 * 存储用户数据
 */
const storeUser = (user: User) => {
  localStorage.setItem(USER_KEY, JSON.stringify(user))
}

/**
 * 获取存储的用户数据
 */
export const getStoredUser = (): User | null => {
  const userData = localStorage.getItem(USER_KEY)
  if (!userData) return null
  try {
    return JSON.parse(userData)
  } catch {
    return null
  }
}

/**
 * 清除存储的认证信息
 */
const clearAuth = () => {
  localStorage.removeItem(TOKEN_KEY)
  localStorage.removeItem(REFRESH_TOKEN_KEY)
  localStorage.removeItem(USER_KEY)
  clearSessionCache()
}

/**
 * 用户注册
 */
export const register = async (
  form: RegisterForm
): Promise<ApiResponse<User>> => {
  try {
    const response = await fetch(`${API_BASE}/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: form.email,
        password: form.password
      })
    })

    const result = await response.json()

    if (result.error) {
      return {
        data: null,
        error: {
          message: result.error.message || '注册失败'
        }
      }
    }

    if (result.user && result.session) {
      // 存储认证信息
      storeToken(result.session.access_token, result.session.refresh_token)
      
      const user: User = {
        id: result.user.id,
        email: result.user.email,
        username: result.user.username || form.username || result.user.email.split('@')[0]
      }
      
      storeUser(user)

      return {
        data: user,
        error: null
      }
    }

    return {
      data: null,
      error: {
        message: '注册失败，未返回用户信息'
      }
    }
  } catch (err) {
    return {
      data: null,
      error: {
        message: err instanceof Error ? err.message : '网络错误，请稍后重试'
      }
    }
  }
}

/**
 * 用户登录
 */
export const login = async (form: LoginForm): Promise<ApiResponse<User>> => {
  try {
    const response = await fetch(`${API_BASE}/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: form.email,
        password: form.password
      })
    })

    const result = await response.json()

    if (result.error) {
      return {
        data: null,
        error: {
          message: result.error.message || '登录失败'
        }
      }
    }

    if (result.user && result.session) {
      // 存储认证信息
      storeToken(result.session.access_token, result.session.refresh_token)
      
      const user: User = {
        id: result.user.id,
        email: result.user.email,
        username: result.user.username || result.user.email.split('@')[0]
      }
      
      storeUser(user)

      return {
        data: user,
        error: null
      }
    }

    return {
      data: null,
      error: {
        message: '登录失败，未返回用户信息'
      }
    }
  } catch (err) {
    return {
      data: null,
      error: {
        message: err instanceof Error ? err.message : '网络错误，请稍后重试'
      }
    }
  }
}

/**
 * 用户登出
 */
export const logout = async (): Promise<ApiResponse<null>> => {
  try {
    const token = getStoredToken()
    
    if (!token) {
      clearAuth()
      return {
        data: null,
        error: null
      }
    }

    await fetch(`${API_BASE}/logout`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })

    // 无论后端返回什么，都清除本地认证信息
    clearAuth()

    return {
      data: null,
      error: null
    }
  } catch {
    // 即使出错也清除本地信息
    clearAuth()
    return {
      data: null,
      error: null
    }
  }
}

/**
 * 获取当前会话
 */
let sessionCache: { data: User | null; timestamp: number } | null = null
const SESSION_CACHE_TTL = 5000 // 缓存 5 秒

export const getSession = async (): Promise<ApiResponse<User | null>> => {
  try {
    // 如果有缓存且未过期，直接返回
    const now = Date.now()
    if (sessionCache && (now - sessionCache.timestamp) < SESSION_CACHE_TTL) {
      console.log('📦 Using cached session')
      return {
        data: sessionCache.data,
        error: null
      }
    }

    const token = getStoredToken()
    
    // 没有 token，返回 null
    if (!token) {
      console.log('ℹ️ No token found')
      sessionCache = { data: null, timestamp: now }
      return {
        data: null,
        error: null
      }
    }

    // 先尝试从本地存储获取
    const storedUser = getStoredUser()
    if (storedUser) {
      console.log('✅ Using stored user data')
      sessionCache = { data: storedUser, timestamp: now }
      return {
        data: storedUser,
        error: null
      }
    }

    // 从后端验证 token 并获取用户信息
    console.log('🔍 Fetching user from backend...')
    const response = await fetch(`${API_BASE}/me`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })

    const result = await response.json()

    if (result.error || !result.user) {
      console.error('❌ Session validation failed')
      clearAuth()
      sessionCache = { data: null, timestamp: now }
      return {
        data: null,
        error: result.error || { message: '会话已过期' }
      }
    }

    const user: User = {
      id: result.user.id,
      email: result.user.email,
      username: result.user.username || result.user.email.split('@')[0]
    }

    storeUser(user)
    sessionCache = { data: user, timestamp: now }

    console.log('✅ Session validated')
    return {
      data: user,
      error: null
    }
  } catch (err) {
    console.error('❌ Exception in getSession:', err)
    clearAuth()
    sessionCache = { data: null, timestamp: Date.now() }
    return {
      data: null,
      error: {
        message: err instanceof Error ? err.message : '获取会话失败'
      }
    }
  }
}

/**
 * 清除会话缓存
 */
export const clearSessionCache = () => {
  sessionCache = null
}

