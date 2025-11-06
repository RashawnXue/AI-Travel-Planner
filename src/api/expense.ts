/**
 * 支出相关 API
 * 现在通过后端 API 处理，不再直接调用 Supabase
 */

import type { Expense, ExpenseForm } from '@/types/expense'
import type { ApiResponse } from '@/types/api'
import { getStoredToken } from './auth'
import { get, post, put, del } from '@/utils/request'

const API_BASE = '/api/backend/expenses'

/**
 * 获取行程的支出记录列表
 * @param planId 行程ID
 */
export async function getExpenseList(planId: string): Promise<ApiResponse<Expense[]>> {
  try {
    const token = getStoredToken()
    
    if (!token) {
      return {
        data: null,
        error: { message: '请先登录' }
      }
    }

    const result = await get<{ data: Expense[]; error?: { message: string } }>(
      `${API_BASE}/plan/${planId}`,
      token
    )

    if (result.error) {
      return {
        data: null,
        error: { message: result.error.message || '获取支出记录失败' }
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
        message: error.message || '获取支出记录失败'
      }
    }
  }
}

/**
 * 获取行程的支出汇总
 * @param planId 行程ID
 */
export async function getExpenseSummary(planId: string): Promise<ApiResponse<{
  total: number
  count: number
  by_category: Record<string, number>
}>> {
  try {
    const token = getStoredToken()
    
    if (!token) {
      return {
        data: null,
        error: { message: '请先登录' }
      }
    }

    const result = await get<{ 
      data: { total: number; count: number; by_category: Record<string, number> }; 
      error?: { message: string } 
    }>(
      `${API_BASE}/plan/${planId}/summary`,
      token
    )

    if (result.error) {
      return {
        data: null,
        error: { message: result.error.message || '获取支出汇总失败' }
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
        message: error.message || '获取支出汇总失败'
      }
    }
  }
}

/**
 * 添加支出记录
 * @param planId 行程ID
 * @param form 支出表单数据
 */
export async function addExpense(
  planId: string,
  form: ExpenseForm
): Promise<ApiResponse<Expense>> {
  try {
    const token = getStoredToken()
    
    if (!token) {
      return {
        data: null,
        error: { message: '请先登录' }
      }
    }

    const result = await post<{ data: Expense; error?: { message: string } }>(
      API_BASE,
      {
        plan_id: planId,
        ...form
      },
      token
    )

    if (result.error) {
      return {
        data: null,
        error: { message: result.error.message || '添加支出记录失败' }
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
        message: error.message || '添加支出记录失败'
      }
    }
  }
}

/**
 * 更新支出记录
 * @param expenseId 支出记录ID
 * @param form 支出表单数据
 */
export async function updateExpense(
  expenseId: string,
  form: Partial<ExpenseForm>
): Promise<ApiResponse<Expense>> {
  try {
    const token = getStoredToken()
    
    if (!token) {
      return {
        data: null,
        error: { message: '请先登录' }
      }
    }

    const result = await put<{ data: Expense; error?: { message: string } }>(
      `${API_BASE}/${expenseId}`,
      form,
      token
    )

    if (result.error) {
      return {
        data: null,
        error: { message: result.error.message || '更新支出记录失败' }
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
        message: error.message || '更新支出记录失败'
      }
    }
  }
}

/**
 * 删除支出记录
 * @param expenseId 支出记录ID
 */
export async function deleteExpense(expenseId: string): Promise<ApiResponse<null>> {
  try {
    const token = getStoredToken()
    
    if (!token) {
      return {
        data: null,
        error: { message: '请先登录' }
      }
    }

    const result = await del<{ error?: { message: string } }>(
      `${API_BASE}/${expenseId}`,
      token
    )

    if (result.error) {
      return {
        data: null,
        error: { message: result.error.message || '删除支出记录失败' }
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
        message: error.message || '删除支出记录失败'
      }
    }
  }
}

