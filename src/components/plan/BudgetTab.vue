<template>
  <div>
    <!-- 预算总览 -->
    <div class="budget-overview">
      <div class="budget-circle">
        <div class="budget-chart" :style="{ background: chartGradient }">
          <div class="budget-inner">
            <div class="budget-amount">¥{{ formatNumber(budgetBreakdown.total) }}</div>
            <div class="budget-percent">{{ usagePercent }}%</div>
          </div>
        </div>
      </div>
      <div class="budget-summary">
        <div>总预算: ¥{{ formatNumber(totalBudget) }}</div>
        <div :style="{ color: remainingBudget < 0 ? 'var(--color-accent)' : '#52c41a' }">
          {{ remainingBudget >= 0 ? '剩余预算' : '超出预算' }}: 
          ¥{{ formatNumber(Math.abs(remainingBudget)) }}
        </div>
      </div>
    </div>

    <!-- 费用明细 -->
    <div class="budget-breakdown">
      <div class="breakdown-item">
        <div class="breakdown-label">
          <span>✈️</span>
          <span>交通</span>
        </div>
        <div class="breakdown-bar">
          <div class="breakdown-fill" :style="getBarStyle(budgetBreakdown.transportation, '#1890ff')"></div>
        </div>
        <div class="breakdown-amount">¥ {{ formatNumber(budgetBreakdown.transportation) }}</div>
      </div>

      <div class="breakdown-item">
        <div class="breakdown-label">
          <span>🏨</span>
          <span>住宿</span>
        </div>
        <div class="breakdown-bar">
          <div class="breakdown-fill" :style="getBarStyle(budgetBreakdown.accommodation, '#52c41a')"></div>
        </div>
        <div class="breakdown-amount">¥ {{ formatNumber(budgetBreakdown.accommodation) }}</div>
      </div>

      <div class="breakdown-item">
        <div class="breakdown-label">
          <span>🍜</span>
          <span>餐饮</span>
        </div>
        <div class="breakdown-bar">
          <div class="breakdown-fill" :style="getBarStyle(budgetBreakdown.food, '#fa8c16')"></div>
        </div>
        <div class="breakdown-amount">¥ {{ formatNumber(budgetBreakdown.food) }}</div>
      </div>

      <div class="breakdown-item">
        <div class="breakdown-label">
          <span>🎫</span>
          <span>活动</span>
        </div>
        <div class="breakdown-bar">
          <div class="breakdown-fill" :style="getBarStyle(budgetBreakdown.activities, '#722ed1')"></div>
        </div>
        <div class="breakdown-amount">¥ {{ formatNumber(budgetBreakdown.activities) }}</div>
      </div>

      <div class="breakdown-item">
        <div class="breakdown-label">
          <span>🛍️</span>
          <span>购物</span>
        </div>
        <div class="breakdown-bar">
          <div class="breakdown-fill" :style="getBarStyle(budgetBreakdown.shopping, '#eb2f96')"></div>
        </div>
        <div class="breakdown-amount">¥ {{ formatNumber(budgetBreakdown.shopping) }}</div>
      </div>

      <div class="breakdown-item">
        <div class="breakdown-label">
          <span>💼</span>
          <span>其他</span>
        </div>
        <div class="breakdown-bar">
          <div class="breakdown-fill" :style="getBarStyle(budgetBreakdown.other, '#8c8c8c')"></div>
        </div>
        <div class="breakdown-amount">¥ {{ formatNumber(budgetBreakdown.other) }}</div>
      </div>
    </div>

    <button class="add-expense-btn" @click="$emit('addExpense')">+ 添加支出记录</button>

    <!-- 支出记录 -->
    <div v-if="expenseList.length > 0" class="expense-records">
      <h3 class="expense-title">支出记录</h3>
      <table class="expense-table">
        <thead>
          <tr>
            <th>日期时间</th>
            <th>分类</th>
            <th>描述</th>
            <th style="text-align: right;">金额</th>
            <th style="text-align: center;">操作</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="expense in expenseList" :key="expense.id">
            <td>{{ formatDateTime(expense.expense_date, expense.expense_time) }}</td>
            <td><span class="expense-category" :class="getCategoryClass(expense.category)">{{ expense.category }}</span></td>
            <td>{{ expense.description || '-' }}</td>
            <td style="text-align: right;" class="expense-amount">¥ {{ formatNumber(expense.amount) }}</td>
            <td style="text-align: center;">
              <button class="delete-btn" @click="$emit('deleteExpense', expense.id)">删除</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { BudgetBreakdown } from '@/types/plan'
import type { Expense, ExpenseCategory } from '@/types/expense'

interface Props {
  budgetBreakdown: BudgetBreakdown
  totalBudget: number
  expenseList: Expense[]
}

const props = defineProps<Props>()

defineEmits<{
  addExpense: []
  deleteExpense: [expenseId: string]
}>()

const usagePercent = computed(() => {
  if (props.totalBudget === 0) return 0
  const percent = Math.round((props.budgetBreakdown.total / props.totalBudget) * 100)
  return Math.min(percent, 100)
})

const remainingBudget = computed(() => {
  return props.totalBudget - props.budgetBreakdown.total
})

const chartGradient = computed(() => {
  const percent = usagePercent.value
  let color = '#1E88E5'
  
  if (percent >= 100) {
    color = '#FF6F3C'
  } else if (percent >= 80) {
    color = '#FFB74D'
  }
  
  return `conic-gradient(${color} 0% ${percent}%, #e8e8e8 ${percent}% 100%)`
})

const formatNumber = (num: number) => {
  return num.toLocaleString('zh-CN', { minimumFractionDigits: 0, maximumFractionDigits: 2 })
}

const getBarStyle = (amount: number, color: string) => {
  const percent = props.budgetBreakdown.total > 0 
    ? Math.round((amount / props.budgetBreakdown.total) * 100) 
    : 0
  return {
    width: `${percent}%`,
    background: color
  }
}

const formatDateTime = (date: string, time: string) => {
  return `${date} ${time}`
}

const getCategoryClass = (category: ExpenseCategory) => {
  const classMap: Record<ExpenseCategory, string> = {
    '交通': 'category-transport',
    '住宿': 'category-accommodation',
    '餐饮': 'category-food',
    '活动': 'category-activity',
    '购物': 'category-shopping',
    '其他': 'category-other'
  }
  return classMap[category] || 'category-other'
}
</script>

<style scoped>
.budget-overview {
  text-align: center;
  padding: 40px 0;
}

.budget-circle {
  width: 200px;
  height: 200px;
  margin: 0 auto 24px;
  position: relative;
}

.budget-chart {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.budget-inner {
  width: 140px;
  height: 140px;
  background: white;
  border-radius: 50%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.budget-amount {
  font-size: 32px;
  font-weight: 700;
  color: #1a1a1a;
  margin-bottom: 4px;
}

.budget-percent {
  font-size: 16px;
  color: #666;
}

.budget-summary {
  display: flex;
  justify-content: center;
  gap: 48px;
  font-size: 18px;
  margin-bottom: 40px;
}

.budget-breakdown {
  margin-bottom: 24px;
}

.breakdown-item {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 16px;
}

.breakdown-label {
  display: flex;
  align-items: center;
  gap: 8px;
  width: 120px;
  font-size: 14px;
}

.breakdown-bar {
  flex: 1;
  height: 20px;
  background: #f5f5f5;
  border-radius: 10px;
  overflow: hidden;
}

.breakdown-fill {
  height: 100%;
  border-radius: 10px;
  transition: width 0.3s ease;
}

.breakdown-amount {
  width: 100px;
  text-align: right;
  font-size: 14px;
  font-weight: 600;
}

.add-expense-btn {
  width: 100%;
  height: 40px;
  background: var(--color-primary);
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  cursor: pointer;
  margin-top: 24px;
  transition: all 0.3s;
}

.add-expense-btn:hover {
  background: #5568d3;
}

.expense-records {
  margin-top: 32px;
}

.expense-title {
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 16px;
}

.expense-table {
  width: 100%;
  border-collapse: collapse;
}

.expense-table th {
  background: #fafafa;
  padding: 12px;
  text-align: left;
  font-size: 14px;
  color: #666;
  border-bottom: 1px solid #e8e8e8;
}

.expense-table td {
  padding: 12px;
  border-bottom: 1px solid #f5f5f5;
  font-size: 14px;
}

.expense-category {
  display: inline-block;
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 12px;
}

.category-transport {
  background: #e6f7ff;
  color: #1890ff;
}

.category-accommodation {
  background: #f6ffed;
  color: #52c41a;
}

.category-food {
  background: #fff7e6;
  color: #fa8c16;
}

.category-activity {
  background: #f9f0ff;
  color: #722ed1;
}

.category-shopping {
  background: #fff0f6;
  color: #eb2f96;
}

.category-other {
  background: #f5f5f5;
  color: #8c8c8c;
}

.expense-amount {
  color: var(--color-accent);
  font-weight: 600;
}

.delete-btn {
  color: var(--color-accent);
  cursor: pointer;
  border: none;
  background: none;
  font-size: 14px;
}

.delete-btn:hover {
  text-decoration: underline;
}
</style>

