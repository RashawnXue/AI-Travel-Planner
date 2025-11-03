/**
 * 支出相关类型定义
 */

// 支出分类
export type ExpenseCategory = '交通' | '住宿' | '餐饮' | '活动' | '购物' | '其他'

// 支出记录
export interface Expense {
  id: string
  plan_id: string
  user_id: string
  category: ExpenseCategory
  amount: number
  description?: string
  expense_date: string
  expense_time: string
  created_at: string
}

// 支出表单数据
export interface ExpenseForm {
  category: ExpenseCategory
  amount: number
  description?: string
  expense_date: string
  expense_time: string
}

