<template>
  <div>
    <!-- 预算总览 -->
    <div class="budget-overview">
      <div class="budget-circle">
        <div class="budget-chart" :style="{ background: chartGradient }">
          <div class="budget-inner">
            <div class="budget-amount">¥{{ formatNumber(actualExpenses.total) }}</div>
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
      <h3 class="breakdown-title">AI 推荐预算分配</h3>
      
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

      <!-- 实际支出 vs 预算对比 -->
      <div class="actual-expense-comparison">
        <div class="comparison-header">
          <h3>实际支出 vs 预算对比</h3>
          <div class="legend">
            <span class="legend-item">
              <span class="legend-color-box safe"></span>
              <span>&lt;80% 节省</span>
            </span>
            <span class="legend-item">
              <span class="legend-color-box normal"></span>
              <span>80-100% 正常</span>
            </span>
            <span class="legend-item">
              <span class="legend-color-box warning"></span>
              <span>100-120% 轻微超支</span>
            </span>
            <span class="legend-item">
              <span class="legend-color-box danger"></span>
              <span>&gt;120% 严重超支</span>
            </span>
          </div>
        </div>

        <div class="comparison-item">
          <div class="breakdown-label">
            <span>✈️</span>
            <span>交通</span>
          </div>
          <div class="comparison-bar-container">
            <div class="comparison-bar-wrapper">
              <div class="budget-base-bar" :style="{ width: '100%', background: '#f0f0f0' }">
                <div 
                  class="actual-expense-bar" 
                  :style="getComparisonSingleBarStyle(actualExpenses.transportation, budgetBreakdown.transportation)"
                >
                  <span class="bar-label" v-if="actualExpenses.transportation > 0">
                    ¥{{ formatNumber(actualExpenses.transportation) }}
                  </span>
                </div>
              </div>
              <div class="budget-marker">
                <span class="budget-label">预算 ¥{{ formatNumber(budgetBreakdown.transportation) }}</span>
              </div>
            </div>
          </div>
          <div class="ratio-badge" :class="getComparisonRatio(actualExpenses.transportation, budgetBreakdown.transportation).status">
            {{ getComparisonRatio(actualExpenses.transportation, budgetBreakdown.transportation).percent }}%
          </div>
        </div>

        <div class="comparison-item">
          <div class="breakdown-label">
            <span>🏨</span>
            <span>住宿</span>
          </div>
          <div class="comparison-bar-container">
            <div class="comparison-bar-wrapper">
              <div class="budget-base-bar" :style="{ width: '100%', background: '#f0f0f0' }">
                <div 
                  class="actual-expense-bar" 
                  :style="getComparisonSingleBarStyle(actualExpenses.accommodation, budgetBreakdown.accommodation)"
                >
                  <span class="bar-label" v-if="actualExpenses.accommodation > 0">
                    ¥{{ formatNumber(actualExpenses.accommodation) }}
                  </span>
                </div>
              </div>
              <div class="budget-marker">
                <span class="budget-label">预算 ¥{{ formatNumber(budgetBreakdown.accommodation) }}</span>
              </div>
            </div>
          </div>
          <div class="ratio-badge" :class="getComparisonRatio(actualExpenses.accommodation, budgetBreakdown.accommodation).status">
            {{ getComparisonRatio(actualExpenses.accommodation, budgetBreakdown.accommodation).percent }}%
          </div>
        </div>

        <div class="comparison-item">
          <div class="breakdown-label">
            <span>🍜</span>
            <span>餐饮</span>
          </div>
          <div class="comparison-bar-container">
            <div class="comparison-bar-wrapper">
              <div class="budget-base-bar" :style="{ width: '100%', background: '#f0f0f0' }">
                <div 
                  class="actual-expense-bar" 
                  :style="getComparisonSingleBarStyle(actualExpenses.food, budgetBreakdown.food)"
                >
                  <span class="bar-label" v-if="actualExpenses.food > 0">
                    ¥{{ formatNumber(actualExpenses.food) }}
                  </span>
                </div>
              </div>
              <div class="budget-marker">
                <span class="budget-label">预算 ¥{{ formatNumber(budgetBreakdown.food) }}</span>
              </div>
            </div>
          </div>
          <div class="ratio-badge" :class="getComparisonRatio(actualExpenses.food, budgetBreakdown.food).status">
            {{ getComparisonRatio(actualExpenses.food, budgetBreakdown.food).percent }}%
          </div>
        </div>

        <div class="comparison-item">
          <div class="breakdown-label">
            <span>🎫</span>
            <span>活动</span>
          </div>
          <div class="comparison-bar-container">
            <div class="comparison-bar-wrapper">
              <div class="budget-base-bar" :style="{ width: '100%', background: '#f0f0f0' }">
                <div 
                  class="actual-expense-bar" 
                  :style="getComparisonSingleBarStyle(actualExpenses.activities, budgetBreakdown.activities)"
                >
                  <span class="bar-label" v-if="actualExpenses.activities > 0">
                    ¥{{ formatNumber(actualExpenses.activities) }}
                  </span>
                </div>
              </div>
              <div class="budget-marker">
                <span class="budget-label">预算 ¥{{ formatNumber(budgetBreakdown.activities) }}</span>
              </div>
            </div>
          </div>
          <div class="ratio-badge" :class="getComparisonRatio(actualExpenses.activities, budgetBreakdown.activities).status">
            {{ getComparisonRatio(actualExpenses.activities, budgetBreakdown.activities).percent }}%
          </div>
        </div>

        <div class="comparison-item">
          <div class="breakdown-label">
            <span>🛍️</span>
            <span>购物</span>
          </div>
          <div class="comparison-bar-container">
            <div class="comparison-bar-wrapper">
              <div class="budget-base-bar" :style="{ width: '100%', background: '#f0f0f0' }">
                <div 
                  class="actual-expense-bar" 
                  :style="getComparisonSingleBarStyle(actualExpenses.shopping, budgetBreakdown.shopping)"
                >
                  <span class="bar-label" v-if="actualExpenses.shopping > 0">
                    ¥{{ formatNumber(actualExpenses.shopping) }}
                  </span>
                </div>
              </div>
              <div class="budget-marker">
                <span class="budget-label">预算 ¥{{ formatNumber(budgetBreakdown.shopping) }}</span>
              </div>
            </div>
          </div>
          <div class="ratio-badge" :class="getComparisonRatio(actualExpenses.shopping, budgetBreakdown.shopping).status">
            {{ getComparisonRatio(actualExpenses.shopping, budgetBreakdown.shopping).percent }}%
          </div>
        </div>

        <div class="comparison-item">
          <div class="breakdown-label">
            <span>💼</span>
            <span>其他</span>
          </div>
          <div class="comparison-bar-container">
            <div class="comparison-bar-wrapper">
              <div class="budget-base-bar" :style="{ width: '100%', background: '#f0f0f0' }">
                <div 
                  class="actual-expense-bar" 
                  :style="getComparisonSingleBarStyle(actualExpenses.other, budgetBreakdown.other)"
                >
                  <span class="bar-label" v-if="actualExpenses.other > 0">
                    ¥{{ formatNumber(actualExpenses.other) }}
                  </span>
                </div>
              </div>
              <div class="budget-marker">
                <span class="budget-label">预算 ¥{{ formatNumber(budgetBreakdown.other) }}</span>
              </div>
            </div>
          </div>
          <div class="ratio-badge" :class="getComparisonRatio(actualExpenses.other, budgetBreakdown.other).status">
            {{ getComparisonRatio(actualExpenses.other, budgetBreakdown.other).percent }}%
          </div>
        </div>
      </div>
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

// 根据支出记录计算实际支出
const actualExpenses = computed(() => {
  const expenses = {
    transportation: 0,
    accommodation: 0,
    food: 0,
    activities: 0,
    shopping: 0,
    other: 0,
    total: 0
  }
  
  props.expenseList.forEach(expense => {
    const amount = expense.amount
    expenses.total += amount
    
    switch (expense.category) {
      case '交通':
        expenses.transportation += amount
        break
      case '住宿':
        expenses.accommodation += amount
        break
      case '餐饮':
        expenses.food += amount
        break
      case '活动':
        expenses.activities += amount
        break
      case '购物':
        expenses.shopping += amount
        break
      case '其他':
        expenses.other += amount
        break
    }
  })
  
  return expenses
})

const usagePercent = computed(() => {
  if (props.totalBudget === 0) return 0
  const percent = Math.round((actualExpenses.value.total / props.totalBudget) * 100)
  return Math.min(percent, 100)
})

const remainingBudget = computed(() => {
  return props.totalBudget - actualExpenses.value.total
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

// 预算图的进度条样式（基于 budgetBreakdown 的总预算）
const getBarStyle = (amount: number, color: string) => {
  const percent = props.budgetBreakdown.total > 0 
    ? Math.round((amount / props.budgetBreakdown.total) * 100) 
    : 0
  return {
    width: `${percent}%`,
    background: color
  }
}

// 获取单条形图样式（实际支出占预算的百分比，带颜色编码）
const getComparisonSingleBarStyle = (actualAmount: number, budgetAmount: number) => {
  if (budgetAmount === 0) {
    return {
      width: '0%',
      background: '#f0f0f0'
    }
  }
  
  // 计算实际占预算的百分比，但宽度不超过100%
  const actualPercent = (actualAmount / budgetAmount) * 100
  const displayPercent = Math.min(actualPercent, 100) // 宽度最大100%
  
  // 计算支出占预算的比例
  const ratio = actualAmount / budgetAmount
  let color = '#f0f0f0'
  
  if (ratio > 1.2) {
    // 超支 20% 以上 - 红色
    color = '#ff4d4f'
  } else if (ratio > 1) {
    // 超支但不到 20% - 橙色
    color = '#ff7a45'
  } else if (ratio > 0.8) {
    // 80%-100% - 正常绿色
    color = '#52c41a'
  } else if (ratio > 0) {
    // 低于 80% - 浅蓝色（节省）
    color = '#1890ff'
  }
  
  return {
    width: `${displayPercent}%`,
    background: color
  }
}

// 获取比例标签（用于显示百分比和状态）
const getComparisonRatio = (actualAmount: number, budgetAmount: number) => {
  if (budgetAmount === 0) return { percent: 0, status: 'empty', text: '未设置预算' }
  
  const ratio = actualAmount / budgetAmount
  const percent = Math.round(ratio * 100)
  
  if (ratio > 1.2) {
    return { percent, status: 'danger', text: '严重超支' }
  } else if (ratio > 1) {
    return { percent, status: 'warning', text: '轻微超支' }
  } else if (ratio > 0.8) {
    return { percent, status: 'normal', text: '正常' }
  } else if (ratio > 0) {
    return { percent, status: 'safe', text: '节省中' }
  } else {
    return { percent: 0, status: 'empty', text: '未支出' }
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
  width: 240px;
  height: 240px;
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
  width: 180px;
  height: 180px;
  background: white;
  border-radius: 50%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.budget-amount {
  font-size: 36px;
  font-weight: 700;
  color: #1a1a1a;
  margin-bottom: 4px;
  word-break: break-all;
  text-align: center;
  padding: 0 10px;
}

.budget-percent {
  font-size: 18px;
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

.breakdown-title {
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 20px;
  color: #1a1a1a;
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
  width: 100px;
  font-size: 14px;
  font-weight: 500;
  color: #333;
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

/* 实际支出对比图样式 */
.actual-expense-comparison {
  margin-top: 32px;
  padding-top: 24px;
  border-top: 2px solid #f0f0f0;
}

.comparison-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.comparison-header h3 {
  font-size: 16px;
  font-weight: 600;
  margin: 0;
  color: #1a1a1a;
}

.legend {
  display: flex;
  gap: 16px;
  font-size: 12px;
  flex-wrap: wrap;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 6px;
  color: #666;
}

.legend-color-box {
  width: 20px;
  height: 12px;
  border-radius: 3px;
}

.legend-color-box.safe {
  background: #1890ff;
}

.legend-color-box.normal {
  background: #52c41a;
}

.legend-color-box.warning {
  background: #ff7a45;
}

.legend-color-box.danger {
  background: #ff4d4f;
}

.comparison-item {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 20px;
  padding: 12px;
  background: #fafafa;
  border-radius: 8px;
  transition: all 0.3s;
}

.comparison-item:hover {
  background: #f5f5f5;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.comparison-bar-container {
  flex: 1;
}

.comparison-bar-wrapper {
  position: relative;
  width: 100%;
}

.budget-base-bar {
  height: 24px;
  background: #f0f0f0;
  border-radius: 12px;
  overflow: visible;
  position: relative;
}

.actual-expense-bar {
  height: 100%;
  border-radius: 12px;
  transition: width 0.6s cubic-bezier(0.4, 0, 0.2, 1);
  display: flex;
  align-items: center;
  justify-content: flex-end;
  padding: 0 12px;
  position: relative;
  overflow: visible;
  min-width: 0;
}

.bar-label {
  color: white;
  font-size: 12px;
  font-weight: 600;
  white-space: nowrap;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
}

.budget-marker {
  position: absolute;
  top: -6px;
  right: -1px;
  height: 36px;
  display: flex;
  align-items: center;
  pointer-events: none;
}

.budget-marker::before {
  content: '';
  width: 2px;
  height: 36px;
  background: #595959;
  display: block;
  box-shadow: 0 0 4px rgba(0, 0, 0, 0.3);
}

.budget-label {
  position: absolute;
  left: 6px;
  top: 50%;
  transform: translateY(-50%);
  font-size: 11px;
  color: #595959;
  font-weight: 600;
  white-space: nowrap;
  background: white;
  padding: 2px 6px;
  border-radius: 3px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.ratio-badge {
  margin-left: 8px;
  padding: 4px 10px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 700;
  white-space: nowrap;
  min-width: 48px;
  text-align: center;
}

.ratio-badge.empty {
  background: #f0f0f0;
  color: #999;
}

.ratio-badge.safe {
  background: #e6f7ff;
  color: #1890ff;
}

.ratio-badge.normal {
  background: #f6ffed;
  color: #52c41a;
}

.ratio-badge.warning {
  background: #fff7e6;
  color: #fa8c16;
}

.ratio-badge.danger {
  background: #fff1f0;
  color: #ff4d4f;
}
</style>

