/**
 * API 相关类型定义
 */

// API 响应基础类型
export interface ApiResponse<T = unknown> {
  data: T | null
  error: ApiError | null
}

// API 错误类型
export interface ApiError {
  message: string
  code?: string
  status?: number
}

