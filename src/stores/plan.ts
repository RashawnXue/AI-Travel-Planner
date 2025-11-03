/**
 * 行程状态管理
 */

import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { TravelPlan, PlanListItem } from '@/types/plan'
import { getPlanList, getPlanDetail, deletePlan } from '@/api/plan'

export const usePlanStore = defineStore('plan', () => {
  // 状态
  const planList = ref<PlanListItem[]>([])
  const currentPlan = ref<TravelPlan | null>(null)
  const loading = ref(false)
  const currentPage = ref(1)
  const pageSize = ref(20)
  const hasMore = ref(true)

  // 计算属性
  const hasPlanList = computed(() => planList.value.length > 0)

  // 方法
  const fetchPlanList = async (page = 1) => {
    loading.value = true
    try {
      const { data, error } = await getPlanList(page, pageSize.value)
      
      if (error) {
        console.error('获取行程列表失败:', error.message)
        return false
      }

      if (data) {
        if (page === 1) {
          planList.value = data
        } else {
          planList.value.push(...data)
        }
        currentPage.value = page
        hasMore.value = data.length === pageSize.value
      }
      
      return true
    } catch (err) {
      console.error('获取行程列表异常:', err)
      return false
    } finally {
      loading.value = false
    }
  }

  const fetchPlanDetail = async (planId: string) => {
    loading.value = true
    try {
      const { data, error } = await getPlanDetail(planId)
      
      if (error) {
        console.error('获取行程详情失败:', error.message)
        return false
      }

      if (data) {
        currentPlan.value = data
      }
      
      return true
    } catch (err) {
      console.error('获取行程详情异常:', err)
      return false
    } finally {
      loading.value = false
    }
  }

  const removePlan = async (planId: string) => {
    try {
      const { error } = await deletePlan(planId)
      
      if (error) {
        console.error('删除行程失败:', error.message)
        return false
      }

      // 从列表中移除
      planList.value = planList.value.filter(plan => plan.id !== planId)
      
      // 如果删除的是当前查看的行程，清空详情
      if (currentPlan.value?.id === planId) {
        currentPlan.value = null
      }
      
      return true
    } catch (err) {
      console.error('删除行程异常:', err)
      return false
    }
  }

  const clearCurrentPlan = () => {
    currentPlan.value = null
  }

  const loadMorePlans = async () => {
    if (!hasMore.value || loading.value) {
      return false
    }
    return await fetchPlanList(currentPage.value + 1)
  }

  return {
    // 状态
    planList,
    currentPlan,
    loading,
    hasMore,
    // 计算属性
    hasPlanList,
    // 方法
    fetchPlanList,
    fetchPlanDetail,
    removePlan,
    clearCurrentPlan,
    loadMorePlans
  }
})

