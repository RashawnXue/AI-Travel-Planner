/**
 * AI 应用（阿里云百炼 DashScope App）相关 API 封装
 * 现在通过后端代理调用
 */

import type { ApiResponse } from '@/types/api'
import { useUserStore } from '@/stores/user'
import { getStoredToken } from './auth'

export interface BailianCompletionInput {
  prompt: string
}

export interface BailianCompletionOptions {
  parameters?: Record<string, unknown>
  debug?: Record<string, unknown>
}

// 从百炼返回中提取 output.text
export function extractBailianText(raw: unknown): string | null {
  try {
    if (!raw) return null
    const obj = typeof raw === 'string' ? JSON.parse(raw) : (raw as Record<string, unknown>)
    const output = obj?.output as Record<string, unknown> | undefined
    const text = output?.text
    return typeof text === 'string' ? text : null
  } catch {
    return null
  }
}

// 尝试将 text 解析为 JSON 对象
export function parsePlanJsonFromText<T = unknown>(text: string): T | null {
  try {
    return JSON.parse(text) as T
  } catch {
    return null
  }
}

/**
 * 调用百炼 DashScope App 的 completion 能力
 * 通过后端 API 代理调用
 */
export async function invokeBailianApp(
  input: BailianCompletionInput,
  options: BailianCompletionOptions = {}
): Promise<ApiResponse<unknown>> {
  try {
    const userStore = useUserStore()
    const apiKey = userStore.apiKey || undefined

    if (!apiKey) {
      return {
        data: null,
        error: {
          message: '请先在顶部导航栏配置 API 密钥',
        }
      }
    }

    // 调用后端 API
    const endpoint = '/api/backend/ai/completion'

    // 创建 AbortController 用于超时控制
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 300000) // 5 分钟超时

    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          prompt: input.prompt,
          api_key: apiKey,
          parameters: options.parameters ?? {},
          debug: options.debug ?? {}
        }),
        signal: controller.signal
      })

      clearTimeout(timeoutId) // 请求成功，清除超时定时器

      const contentType = res.headers.get('content-type') || ''
      const isJson = contentType.includes('application/json')
      const data = isJson ? await res.json() : await res.text()

      if (!res.ok) {
        return {
          data: null,
          error: {
            message: (data && (data.message || data.error || data.msg)) || '调用百炼接口失败',
            status: res.status
          }
        }
      }

      return { data, error: null }
    } catch (fetchErr) {
      clearTimeout(timeoutId) // 清除超时定时器
      const error = fetchErr as Error
      
      // 判断是否是超时错误
      if (error.name === 'AbortError') {
        return {
          data: null,
          error: {
            message: 'AI 生成超时（超过5分钟），请稍后重试或简化需求'
          }
        }
      }
      
      return {
        data: null,
        error: {
          message: error.message || '请求百炼接口异常'
        }
      }
    }
  } catch (err) {
    const error = err as Error
    return {
      data: null,
      error: {
        message: error.message || '请求百炼接口异常'
      }
    }
  }
}

/**
 * 生成行程并直接保存到数据库
 * 一步完成：AI 生成 + 数据库插入
 */
export async function generateAndCreatePlan(
  input: BailianCompletionInput,
  options: BailianCompletionOptions = {}
): Promise<ApiResponse<{ id: string }>> {
  try {
    const userStore = useUserStore()
    const apiKey = userStore.apiKey || undefined
    const token = getStoredToken()

    if (!apiKey) {
      return {
        data: null,
        error: {
          message: '请先在顶部导航栏配置 API 密钥',
        }
      }
    }

    if (!token) {
      return {
        data: null,
        error: {
          message: '请先登录',
        }
      }
    }

    // 调用后端 API
    const endpoint = '/api/backend/ai/generate-plan'

    // 创建 AbortController 用于超时控制
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 300000) // 5 分钟超时

    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          prompt: input.prompt,
          api_key: apiKey,
          parameters: options.parameters ?? {}
        }),
        signal: controller.signal
      })

      clearTimeout(timeoutId)

      const data = await res.json()

      if (!res.ok || data.error) {
        return {
          data: null,
          error: {
            message: data.error?.message || '生成行程失败',
            status: res.status
          }
        }
      }

      if (!data.plan_id) {
        return {
          data: null,
          error: {
            message: '生成行程失败，未返回行程 ID'
          }
        }
      }

      return {
        data: { id: data.plan_id },
        error: null
      }
    } catch (fetchErr) {
      clearTimeout(timeoutId)
      const error = fetchErr as Error
      
      if (error.name === 'AbortError') {
        return {
          data: null,
          error: {
            message: 'AI 生成超时（超过5分钟），请稍后重试或简化需求'
          }
        }
      }
      
      return {
        data: null,
        error: {
          message: error.message || '生成行程失败'
        }
      }
    }
  } catch (err) {
    const error = err as Error
    return {
      data: null,
      error: {
        message: error.message || '生成行程失败'
      }
    }
  }
}