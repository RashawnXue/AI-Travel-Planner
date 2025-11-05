/**
 * 认证相关 API
 */

import { supabase } from '@/utils/supabase'
import type { ApiResponse } from '@/types/api'
import type { User, LoginForm, RegisterForm } from '@/types/user'

/**
 * 用户注册
 */
export const register = async (
  form: RegisterForm
): Promise<ApiResponse<User>> => {
  try {
    const { data, error } = await supabase.auth.signUp({
      email: form.email,
      password: form.password,
      options: {
        data: {
          username: form.username
        }
      }
    })

    if (error) {
      return {
        data: null,
        error: {
          message: error.message === 'User already registered'
            ? '该邮箱已被注册，请直接登录'
            : `注册失败: ${error.message}`,
          code: error.code,
          status: error.status
        }
      }
    }

    if (!data.user) {
      return {
        data: null,
        error: {
          message: '注册失败，请重试'
        }
      }
    }

    return {
      data: {
        id: data.user.id,
        email: data.user.email || '',
        username: form.username
      },
      error: null
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
    const { data, error } = await supabase.auth.signInWithPassword({
      email: form.email,
      password: form.password
    })

    if (error) {
      let message = '登录失败，请重试'
      if (error.message.includes('Invalid login credentials')) {
        message = '邮箱或密码错误'
      } else if (error.message.includes('Email not confirmed')) {
        message = '请先验证邮箱后再登录'
      }
      
      return {
        data: null,
        error: {
          message,
          code: error.code,
          status: error.status
        }
      }
    }

    if (!data.user) {
      return {
        data: null,
        error: {
          message: '登录失败，请重试'
        }
      }
    }

    // 获取用户扩展信息
    const { data: profile } = await supabase
      .from('user_profiles')
      .select('username')
      .eq('id', data.user.id)
      .single()

    return {
      data: {
        id: data.user.id,
        email: data.user.email || '',
        username: profile?.username || data.user.user_metadata?.username || ''
      },
      error: null
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
    // 清除会话缓存
    clearSessionCache()
    
    const { error } = await supabase.auth.signOut()

    if (error) {
      return {
        data: null,
        error: {
          message: `退出失败: ${error.message}`
        }
      }
    }

    return {
      data: null,
      error: null
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
 * 获取当前会话
 */
let sessionCache: { data: User | null; timestamp: number } | null = null
const SESSION_CACHE_TTL = 5000 // 缓存 5 秒

export const getSession = async () => {
  try {
    // 如果有缓存且未过期，直接返回
    const now = Date.now()
    if (sessionCache && (now - sessionCache.timestamp) < SESSION_CACHE_TTL && sessionCache.data) {
      console.log('📦 Using cached session:', sessionCache.data.email)
      return {
        data: sessionCache.data,
        error: null
      }
    }
    
    console.log('🔍 Fetching session from Supabase...')
    const { data, error } = await supabase.auth.getSession()
    
    if (error) {
      console.error('❌ Session error:', error.message)
      sessionCache = null
      return {
        data: null,
        error: { message: error.message }
      }
    }
    
    if (!data.session) {
      console.log('ℹ️ No active session found')
      sessionCache = null
      return {
        data: null,
        error: null
      }
    }

    console.log('✅ Session found for user:', data.session.user.email)

    // 获取用户扩展信息
    const { data: profile, error: profileError } = await supabase
      .from('user_profiles')
      .select('username')
      .eq('id', data.session.user.id)
      .single()

    if (profileError) {
      console.warn('⚠️ Could not fetch user profile:', profileError.message)
    }

    const userData = {
      id: data.session.user.id,
      email: data.session.user.email || '',
      username: profile?.username || data.session.user.user_metadata?.username || ''
    }
    
    // 更新缓存
    sessionCache = {
      data: userData,
      timestamp: now
    }

    console.log('💾 Session cached:', userData.email)

    return {
      data: userData,
      error: null
    }
  } catch (err) {
    console.error('❌ Exception in getSession:', err)
    sessionCache = null
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

