/**
 * 统一的 HTTP 请求工具
 * 处理认证、错误、token 过期等
 */

import { message } from 'ant-design-vue'
import router from '@/router'
import { useUserStore } from '@/stores/user'

/**
 * 统一的 fetch 包装器
 * 自动处理 401 错误并跳转到登录页
 */
export async function request(url: string, options: RequestInit = {}): Promise<Response> {
  try {
    const response = await fetch(url, options)
    
    // 处理 401 未授权错误
    if (response.status === 401) {
      console.warn('🔒 Token expired or invalid, redirecting to login...')
      
      // 清除用户状态
      const userStore = useUserStore()
      userStore.clearUser()
      
      // 清除本地存储
      localStorage.removeItem('auth_token')
      localStorage.removeItem('refresh_token')
      localStorage.removeItem('user_data')
      
      // 提示用户
      message.warning('登录已过期，请重新登录')
      
      // 跳转到登录页
      router.push('/login')
      
      // 抛出错误以中断后续处理
      throw new Error('认证已过期')
    }
    
    return response
  } catch (err) {
    // 如果是网络错误或其他异常
    if (err instanceof TypeError && err.message.includes('Failed to fetch')) {
      console.error('❌ Network error:', err)
      message.error('网络错误，请检查网络连接')
    }
    throw err
  }
}

/**
 * GET 请求
 */
export async function get<T = unknown>(url: string, token?: string): Promise<T> {
  const headers: HeadersInit = {
    'Content-Type': 'application/json'
  }
  
  if (token) {
    headers['Authorization'] = `Bearer ${token}`
  }
  
  const response = await request(url, {
    method: 'GET',
    headers
  })
  
  return response.json()
}

/**
 * POST 请求
 */
export async function post<T = unknown>(url: string, data?: unknown, token?: string): Promise<T> {
  const headers: HeadersInit = {
    'Content-Type': 'application/json'
  }
  
  if (token) {
    headers['Authorization'] = `Bearer ${token}`
  }
  
  const response = await request(url, {
    method: 'POST',
    headers,
    body: data ? JSON.stringify(data) : undefined
  })
  
  return response.json()
}

/**
 * PUT 请求
 */
export async function put<T = unknown>(url: string, data?: unknown, token?: string): Promise<T> {
  const headers: HeadersInit = {
    'Content-Type': 'application/json'
  }
  
  if (token) {
    headers['Authorization'] = `Bearer ${token}`
  }
  
  const response = await request(url, {
    method: 'PUT',
    headers,
    body: data ? JSON.stringify(data) : undefined
  })
  
  return response.json()
}

/**
 * DELETE 请求
 */
export async function del<T = unknown>(url: string, token?: string): Promise<T> {
  const headers: HeadersInit = {
    'Content-Type': 'application/json'
  }
  
  if (token) {
    headers['Authorization'] = `Bearer ${token}`
  }
  
  const response = await request(url, {
    method: 'DELETE',
    headers
  })
  
  return response.json()
}
