/**
 * 行程相关 API
 */

import { supabase } from '@/utils/supabase'
import type { TravelPlan, PlanListItem, AIResponse } from '@/types/plan'
import type { ApiResponse } from '@/types/api'

/**
 * 获取用户的行程列表
 * @param page 页码，从1开始
 * @param pageSize 每页数量
 */
export async function getPlanList(
  page = 1,
  pageSize = 20
): Promise<ApiResponse<PlanListItem[]>> {
  try {
    const offset = (page - 1) * pageSize
    
    const { data, error } = await supabase
      .from('travel_plans')
      .select('id, title, destination, days, budget, start_date, created_at')
      .order('created_at', { ascending: false })
      .range(offset, offset + pageSize - 1)

    if (error) {
      return {
        data: null,
        error: {
          message: error.message,
          code: error.code
        }
      }
    }

    return {
      data: data as PlanListItem[],
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
    const { data, error } = await supabase
      .from('travel_plans')
      .select('*')
      .eq('id', planId)
      .single()

    if (error) {
      return {
        data: null,
        error: {
          message: error.message,
          code: error.code
        }
      }
    }

    return {
      data: data as TravelPlan,
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
    const { error } = await supabase
      .from('travel_plans')
      .delete()
      .eq('id', planId)

    if (error) {
      return {
        data: null,
        error: {
          message: error.message,
          code: error.code
        }
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
      user_id: userId,
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

    console.log('Inserting travel plan with payload:', payload)

    const { data, error } = await supabase
      .from('travel_plans')
      .insert(payload)
      .select('id')
      .single()

    if (error) {
      return {
        data: null,
        error: { message: error.message, code: error.code }
      }
    }

    return { data: { id: data.id as string }, error: null }
  } catch (err) {
    const error = err as Error
    return { data: null, error: { message: error.message || '创建行程失败' } }
  }
}

