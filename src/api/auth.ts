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
  } catch (err: any) {
    return {
      data: null,
      error: {
        message: err.message || '网络错误，请稍后重试'
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
  } catch (err: any) {
    return {
      data: null,
      error: {
        message: err.message || '网络错误，请稍后重试'
      }
    }
  }
}

/**
 * 用户登出
 */
export const logout = async (): Promise<ApiResponse<null>> => {
  try {
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
  } catch (err: any) {
    return {
      data: null,
      error: {
        message: err.message || '网络错误，请稍后重试'
      }
    }
  }
}

/**
 * 获取当前会话
 */
export const getSession = async () => {
  try {
    const { data, error } = await supabase.auth.getSession()
    
    if (error || !data.session) {
      return {
        data: null,
        error: error ? { message: error.message } : null
      }
    }

    // 获取用户扩展信息
    const { data: profile } = await supabase
      .from('user_profiles')
      .select('username')
      .eq('id', data.session.user.id)
      .single()

    return {
      data: {
        id: data.session.user.id,
        email: data.session.user.email || '',
        username: profile?.username || data.session.user.user_metadata?.username || ''
      },
      error: null
    }
  } catch (err: any) {
    return {
      data: null,
      error: {
        message: err.message || '获取会话失败'
      }
    }
  }
}

