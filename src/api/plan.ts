/**
 * 行程相关 API
 * 现在通过后端 API 处理，不再直接调用 Supabase
 */

import type { TravelPlan, PlanListItem, AIResponse } from '@/types/plan'
import type { ApiResponse } from '@/types/api'
import { getStoredToken } from './auth'
import { get, post, del } from '@/utils/request'

const API_BASE = '/api/backend/plans'

/**
 * 获取用户的行程列表
 */
export async function getPlanList(): Promise<ApiResponse<PlanListItem[]>> {
  try {
    const token = getStoredToken()
    
    if (!token) {
      return {
        data: null,
        error: { message: '请先登录' }
      }
    }

    const result = await get<{ data: PlanListItem[]; error?: { message: string } }>(
      API_BASE,
      token
    )

    if (result.error) {
      return {
        data: null,
        error: { message: result.error.message || '获取行程列表失败' }
      }
    }

    return {
      data: result.data,
      error: null
    }
  } catch (err: unknown) {
    const error = err as Error
    return {
      data: null,
      error: {
        message: error.message || '获取行程列表失败'
      }
    }
  }
}

/**
 * 获取行程详情
 * @param planId 行程ID
 */
export async function getPlanDetail(planId: string): Promise<ApiResponse<TravelPlan>> {
  try {
    const token = getStoredToken()
    
    if (!token) {
      return {
        data: null,
        error: { message: '请先登录' }
      }
    }

    const result = await get<{ data: TravelPlan; error?: { message: string } }>(
      `${API_BASE}/${planId}`,
      token
    )

    if (result.error) {
      return {
        data: null,
        error: { message: result.error.message || '获取行程详情失败' }
      }
    }

    return {
      data: result.data,
      error: null
    }
  } catch (err: unknown) {
    const error = err as Error
    return {
      data: null,
      error: {
        message: error.message || '获取行程详情失败'
      }
    }
  }
}

/**
 * 删除行程
 * @param planId 行程ID
 */
export async function deletePlan(planId: string): Promise<ApiResponse<null>> {
  try {
    const token = getStoredToken()
    
    if (!token) {
      return {
        data: null,
        error: { message: '请先登录' }
      }
    }

    const result = await del<{ error?: { message: string } }>(
      `${API_BASE}/${planId}`,
      token
    )

    if (result.error) {
      return {
        data: null,
        error: { message: result.error.message || '删除行程失败' }
      }
    }

    return {
      data: null,
      error: null
    }
  } catch (err: unknown) {
    const error = err as Error
    return {
      data: null,
      error: {
        message: error.message || '删除行程失败'
      }
    }
  }
}

/**
 * 基于 AI 解析结果创建行程
 * @param ai AI 生成的行程数据
 * @param userId 用户 ID（由调用方提前获取，避免长时间操作后 session 过期）
 */
export async function createPlanFromAI(
  ai: AIResponse, 
  userId: string
): Promise<ApiResponse<{ id: string }>> {
  try {
    if (!userId) {
      return {
        data: null,
        error: { message: '用户 ID 无效' }
      }
    }

    const token = getStoredToken()
    
    if (!token) {
      return {
        data: null,
        error: { message: '请先登录' }
      }
    }

    // 如果没有出发日期，设置为当前日期后三天
    let startDate: string
    if (!ai.start_date || ai.start_date.trim() === '') {
      const futureDate = new Date()
      futureDate.setDate(futureDate.getDate() + 3)
      const isoDate = futureDate.toISOString().split('T')[0]
      startDate = isoDate || ''
    } else {
      startDate = ai.start_date.trim()
    }

    const payload = {
      title: ai.title?.trim() || '未命名行程',
      destination: ai.destination?.trim() || '未知目的地',
      days: ai.days || 1,
      budget: ai.budget || 0,
      travelers: ai.travelers || 1,
      preferences: Array.isArray(ai.preferences) ? ai.preferences : [],
      start_date: startDate,
      summary: ai.summary?.trim() || '',
      ai_response: ai
    }

    console.log('Creating travel plan with payload:', payload)

    const result = await post<{ data: { id: string }; error?: { message: string } }>(
      API_BASE,
      payload,
      token
    )

    if (result.error) {
      return {
        data: null,
        error: { message: result.error.message || '创建行程失败' }
      }
    }

    return { 
      data: { id: result.data.id }, 
      error: null 
    }
  } catch (err) {
    const error = err as Error
    return { 
      data: null, 
      error: { message: error.message || '创建行程失败' } 
    }
  }
}

