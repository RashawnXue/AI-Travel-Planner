/**
 * AI 应用（阿里云百炼 DashScope App）相关 API 封装
 */

import type { ApiResponse } from '@/types/api'
import { useUserStore } from '@/stores/user'

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
 * 对应 curl:
 * curl -X POST https://dashscope.aliyuncs.com/api/v1/apps/{APP_ID}/completion \
 *  --header "Authorization: Bearer $DASHSCOPE_API_KEY" \
 *  --header 'Content-Type: application/json' \
 *  --data '{"input":{"prompt":"..."},"parameters":{},"debug":{}}'
 */
export async function invokeBailianApp(
  input: BailianCompletionInput,
  options: BailianCompletionOptions = {}
): Promise<ApiResponse<unknown>> {
  try {
    const userStore = useUserStore()
    const appId = import.meta.env.VITE_BAILIAN_APP_ID as string | undefined
    // 优先使用用户配置的 API Key，如果没有则使用环境变量
    const apiKey = userStore.apiKey || import.meta.env.VITE_BAILIAN_API_KEY as string | undefined

    if (!appId || !apiKey) {
      return {
        data: null,
        error: {
          message: appId ? '请先在顶部导航栏配置 API 密钥' : '缺少百炼配置：VITE_BAILIAN_APP_ID 未设置',
        }
      }
    }

    const endpoint = `https://dashscope.aliyuncs.com/api/v1/apps/${encodeURIComponent(appId)}/completion`

    // 创建 AbortController 用于超时控制
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 300000) // 5 分钟超时

    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          input: { prompt: input.prompt },
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