/**
 * 支出相关 API
 */

import { supabase } from '@/utils/supabase'
import type { Expense, ExpenseForm } from '@/types/expense'
import type { ApiResponse } from '@/types/api'

/**
 * 获取行程的支出记录列表
 * @param planId 行程ID
 */
export async function getExpenseList(planId: string): Promise<ApiResponse<Expense[]>> {
  try {
    const { data, error } = await supabase
      .from('expenses')
      .select('*')
      .eq('plan_id', planId)
      .order('expense_date', { ascending: false })
      .order('expense_time', { ascending: false })

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
      data: data as Expense[],
      error: null
    }
  } catch (err: any) {
    return {
      data: null,
      error: {
        message: err.message || '获取支出记录失败'
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
    // 获取当前用户ID
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      return {
        data: null,
        error: {
          message: '用户未登录'
        }
      }
    }

    const { data, error } = await supabase
      .from('expenses')
      .insert({
        plan_id: planId,
        user_id: user.id,
        ...form
      })
      .select()
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
      data: data as Expense,
      error: null
    }
  } catch (err: any) {
    return {
      data: null,
      error: {
        message: err.message || '添加支出记录失败'
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
    const { error } = await supabase
      .from('expenses')
      .delete()
      .eq('id', expenseId)

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
  } catch (err: any) {
    return {
      data: null,
      error: {
        message: err.message || '删除支出记录失败'
      }
    }
  }
}

