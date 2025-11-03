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
 * 自动从当前登录用户中获取 user_id
 */
export async function createPlanFromAI(ai: AIResponse): Promise<ApiResponse<{ id: string }>> {
  try {
    const { data: userRes, error: userErr } = await supabase.auth.getUser()
    if (userErr || !userRes?.user?.id) {
      return {
        data: null,
        error: { message: '未登录或无法获取用户信息' }
      }
    }

    const payload = {
      user_id: userRes.user.id,
      title: ai.title,
      destination: ai.destination,
      days: ai.days,
      budget: ai.budget,
      travelers: ai.travelers,
      preferences: ai.preferences,
      start_date: ai.start_date,
      summary: ai.summary,
      ai_response: ai
    }

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

