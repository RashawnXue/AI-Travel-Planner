/**
 * 支出状态管理
 */

import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { Expense, ExpenseForm } from '@/types/expense'
import { getExpenseList, addExpense, deleteExpense } from '@/api/expense'

export const useExpenseStore = defineStore('expense', () => {
  // 状态
  const expenseList = ref<Expense[]>([])
  const loading = ref(false)

  // 方法
  const fetchExpenseList = async (planId: string) => {
    loading.value = true
    try {
      const { data, error } = await getExpenseList(planId)
      
      if (error) {
        console.error('获取支出列表失败:', error.message)
        return false
      }

      if (data) {
        expenseList.value = data
      }
      
      return true
    } catch (err) {
      console.error('获取支出列表异常:', err)
      return false
    } finally {
      loading.value = false
    }
  }

  const createExpense = async (planId: string, form: ExpenseForm) => {
    try {
      const { data, error } = await addExpense(planId, form)
      
      if (error) {
        console.error('添加支出记录失败:', error.message)
        return false
      }

      if (data) {
        // 添加到列表开头
        expenseList.value.unshift(data)
      }
      
      return true
    } catch (err) {
      console.error('添加支出记录异常:', err)
      return false
    }
  }

  const removeExpense = async (expenseId: string) => {
    try {
      const { error } = await deleteExpense(expenseId)
      
      if (error) {
        console.error('删除支出记录失败:', error.message)
        return false
      }

      // 从列表中移除
      expenseList.value = expenseList.value.filter(expense => expense.id !== expenseId)
      
      return true
    } catch (err) {
      console.error('删除支出记录异常:', err)
      return false
    }
  }

  const clearExpenseList = () => {
    expenseList.value = []
  }

  return {
    // 状态
    expenseList,
    loading,
    // 方法
    fetchExpenseList,
    createExpense,
    removeExpense,
    clearExpenseList
  }
})

